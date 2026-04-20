import { format } from "date-fns";

export const formatTime = (timeStr?: string) => {
  if (!timeStr) return "";
  const date = new Date(timeStr);
  return !isNaN(date.getTime()) ? format(date, "dd/MM/yyyy") : timeStr;
};
