export interface IGameOffer {
  id: string;
  sportId: string;
  modalityId: string;
  gender: "MALE" | "FEMALE" | "MIXED";
  categoryId?: string | null;
  gameDate: string;
  status: "OPEN" | "PENDING" | "CONFIRMED" | "CANCELED";
  fieldInfo?: unknown;
  teamId: string;
  createdAt: string;
  updatedAt: string;

  // campos adicionados pela API
  teamName: string;
  teamLogo?: string | null;
  sportName: string;
  modalityName: string;
  categoryName?: string | null;
  fieldAddress?: string | null;
  fee?: number | null;
}
