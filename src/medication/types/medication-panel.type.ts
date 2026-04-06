/* eslint-disable prettier/prettier */
export type MedicationPanel = {
  id: number;
  name: string;
  description: string;
  img_url: string;
  activeIngredients: {
    id: number;
    name: string;
  }[];
};