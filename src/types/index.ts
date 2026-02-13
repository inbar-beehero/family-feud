export interface Answer {
  text: string;
  points: number;
}

export interface Question {
  id: number;
  round?: number;
  question: string;
  answers: Answer[];
}

export interface FastMoneyQuestion extends Question {
  id: number;
  question: string;
  answers: Answer[];
}

export type View = "start" | "game" | "admin" | "fastmoney";

export type Phase = "faceoff" | "choose" | "play" | "steal" | "roundEnd";

export type ToastType = "ok" | "err" | "info";

export interface FmAnswerDetail {
  matched: boolean;
  answer?: Answer;
  points?: number;
}
