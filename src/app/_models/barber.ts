import { WorkHour } from "./workHour";

export interface Barber {
  id: number;
  firstName: string;
  lastName: string;
  workhours: WorkHour[];
}