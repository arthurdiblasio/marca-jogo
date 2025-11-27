export interface TeamListFilters {
  sportId?: string | null;
  categoryId?: string | null;
  q?: string | null;
}

export interface TeamListItem {
  id: string;
  name: string;
  abbreviation: string | null;
  logo: string | null;
  sport: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  } | null;
}
