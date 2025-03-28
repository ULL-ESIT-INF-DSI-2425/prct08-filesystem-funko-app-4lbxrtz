import { FunkoGenre, FunkoType } from "./enums.js";

export interface Funko {
  id: string;
  name: string;
  description: string;
  type: FunkoType;
  genre: FunkoGenre;
  franchise: string;
  number: number;
  exclusive: boolean;
  specialFeatures: string;
  marketValue: number;
}
