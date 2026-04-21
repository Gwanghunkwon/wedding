export type AnalyticsEventName =
  | "compare_started"
  | "compare_result_viewed"
  | "lead_submitted"
  | "lead_answered"
  | "contract_case_uploaded";

export type AnalyticsEvent = {
  id: string;
  name: AnalyticsEventName;
  category: "wedding" | "interior" | "common";
  source: "web" | "api" | "b2b";
  createdAt: string;
};

const eventStore: AnalyticsEvent[] = [];

export function addEvent(input: Omit<AnalyticsEvent, "id" | "createdAt">) {
  const event: AnalyticsEvent = {
    id: `evt-${eventStore.length + 1}`,
    createdAt: new Date().toISOString(),
    ...input
  };
  eventStore.push(event);
  return event;
}

export function listEvents() {
  return eventStore;
}

export function summarizeEvents() {
  const count = (name: AnalyticsEventName) => eventStore.filter((event) => event.name === name).length;
  const compareViewed = count("compare_result_viewed");
  const leadSubmitted = count("lead_submitted");
  const leadAnswered = count("lead_answered");

  return {
    totals: {
      compare_started: count("compare_started"),
      compare_result_viewed: compareViewed,
      lead_submitted: leadSubmitted,
      lead_answered: leadAnswered,
      contract_case_uploaded: count("contract_case_uploaded")
    },
    metrics: {
      inquiryConversionRate: compareViewed ? Number(((leadSubmitted / compareViewed) * 100).toFixed(2)) : 0,
      providerResponseRate: leadSubmitted ? Number(((leadAnswered / leadSubmitted) * 100).toFixed(2)) : 0
    }
  };
}
