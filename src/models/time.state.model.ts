import { Promotion } from "./promotion.model";

export class TimeState {
    isActive: boolean;
    total: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    promotion: Promotion;
  }