import { IGameOffer } from "@/types/IGameOffer";

export interface IGameOfferEnriched extends IGameOffer {
  // team: {
  //   id: string;
  //   name: string;
  //   logo?: string | null;
  // };

  // sport: {
  //   id: string;
  //   name: string;
  // };

  // modality: {
  //   id: string;
  //   name: string;
  // };

  // category?: {
  //   id: string;
  //   name: string;
  // } | null;

  // fieldInfo?: {
  //   address?: string;
  //   [key: string]: any;
  // };
  teamName: string;
  teamLogo?: string | null;

  sportName: string;
  modalityName: string;
  categoryName?: string | null;

  fieldAddress?: string | null;

  fee?: number | null;
}
