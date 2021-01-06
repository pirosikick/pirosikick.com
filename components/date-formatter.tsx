import { format } from "date-fns";

export interface DateFormatterProps {
  timestamp: number;
}

export default function DateFormatter({ timestamp }: DateFormatterProps) {
  const date = new Date(timestamp);
  return <time dateTime={date.toISOString()}>{format(date, "yyyy-MM-dd")}</time>;
}
