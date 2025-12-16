export interface GameOfferFilters {
  sportId: string;
  modalityId: string;
  gender: string;

  categoryId?: string;
  date?: string;
  weekday?: string;
  dayOfMonth?: string;
  time?: string;
  turno?: "morning" | "afternoon" | "night";

  page?: number;
  pageSize?: number;
}
