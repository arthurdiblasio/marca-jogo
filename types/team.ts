import { Gender } from "./gender";

export interface TeamListFilters {
  sportId?: string | null;
  categoryId?: string | null;
  q?: string | null;
}

export interface TeamListItem {
  id: string;
  name: string;
  sport: {
    name: string;
    id: string;
    durationMin: number;
  };
  category?: {
    name: string;
    id: string;
  };
  latitude: number;
  longitude: number;
  categoryId: null;
  gender: Gender;
  hasField: boolean;
  fieldInfo?: {
    address?: string;
    latitude?: number;
    longitude?: number;
    images?: string[];
    observations?: string;
  } | null;
}

export interface UserTeam {
  id: string;
  name: string;
  sport: {
    name: string;
    id: string;
    durationMin: number;
  };
  category?: {
    name: string;
    id: string;
  };
  latitude: number;
  logo?: string | null;
  longitude: number;
  categoryId: null;
  gender: Gender;
  hasField: boolean;
  fieldInfo?: {
    address?: string;
    latitude?: number;
    longitude?: number;
    images?: string[];
    observations?: string;
  } | null;
}
