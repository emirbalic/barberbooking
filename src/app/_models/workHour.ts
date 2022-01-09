import { LunchTime } from "./lunchTime";

export interface WorkHour {
  id: number;
  day: number;
  startHour: number;
  endHour: string;
  lunchTime?: LunchTime;
}

