import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const sessionLogPath = path.join(rootDir, "docs", "session-progress-log.md");
const projectStatePath = path.join(rootDir, "docs", "project-state.json");

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : "true";
    args[key] = value;
    if (value !== "true") i += 1;
  }
  return args;
}

function toList(value, fallback) {
  if (!value) return fallback;
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatNow() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 8);
  return { date, time };
}

async function updateSessionLog({ summary, doneItems, nextItems, checks }) {
  const { date, time } = formatNow();
  let content = "";
  try {
    content = await fs.readFile(sessionLogPath, "utf8");
  } catch {
    content = "# Session Progress Log\n\n";
  }

  const entry = [
    `## ${date} ${time} 자동 기록`,
    "",
    `- 요약: ${summary}`,
    ...doneItems.map((item) => `- 완료: ${item}`),
    ...checks.map((item) => `- 검증: ${item}`),
    ...nextItems.map((item) => `- 다음: ${item}`),
    ""
  ].join("\n");

  await fs.writeFile(sessionLogPath, `${content.trimEnd()}\n\n${entry}`, "utf8");
}

async function updateProjectState({ summary, nextItems, status }) {
  let state = {};
  try {
    const raw = await fs.readFile(projectStatePath, "utf8");
    state = JSON.parse(raw);
  } catch {
    state = {};
  }

  const { date, time } = formatNow();
  const updated = {
    ...state,
    updatedAt: date,
    lastSessionAt: `${date} ${time}`,
    lastSummary: summary,
    status: status || state.status || "in-progress",
    nextRecommended: nextItems.length ? nextItems : state.nextRecommended || []
  };

  await fs.writeFile(projectStatePath, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const summary = args.summary || "세션 작업 기록 업데이트";
  const doneItems = toList(args.done, ["최근 변경사항 문서화"]);
  const nextItems = toList(args.next, ["다음 우선순위 작업 정의"]);
  const checks = toList(args.checks, []);
  const status = args.status;

  await updateSessionLog({ summary, doneItems, nextItems, checks });
  await updateProjectState({ summary, nextItems, status });

  process.stdout.write("Session log and project state updated.\n");
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
