
export interface WizardData {
  painPoints: string[];
  benefits: string[];
  peopleCount: string;
  location: string;
  dates: string;
  budget: string;
  crazyLevel: string;
  planType: string;
  funnyQuestion: string;
  name: string;
  whatsapp: string;
}

export interface ReportResponse {
  reportText: string;
  score: number;
}

export enum Step {
  INTRO_1 = 0, // Hook: Disaster or Legend?
  INTRO_2 = 1, // Solution: What you get
  PAIN_POINTS = 2,
  BENEFITS = 3,
  LOCATION = 4,
  DETAILS = 5,
  CRAZY_LEVEL = 6,
  PLAN_TYPE = 7,
  FUNNY_QUESTION = 8,
  CONTACT = 9,
  LOADING = 10,
  RESULT = 11,
}
