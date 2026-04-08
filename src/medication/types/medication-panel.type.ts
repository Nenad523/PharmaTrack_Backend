/* eslint-disable prettier/prettier */
import { ActiveIngredientType } from "./medication-ActiveI.type";

/* eslint-disable prettier/prettier */
export type MedicationPanel = {
  id: number;
  name: string;
  description: string;
  img_url: string;
  activeIngredients: ActiveIngredientType[]
};