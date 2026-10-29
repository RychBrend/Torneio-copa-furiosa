export const dateLabel = (dateTime: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
    .format(new Date(dateTime));
export const timeLabel = (dateTime: string) =>
  dateTime.slice(11, 16);
export const weekdayLabel = (dateTime: string) =>
  new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(new Date(dateTime));
export const newId = () => crypto.randomUUID();
