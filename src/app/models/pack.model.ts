// models/pack.model.ts
export interface Pack {
  index: number;
  grossWeight: number | null;
  tareWeight: number | null;
  netWeight: number | null;
  isEditing: boolean;
  batchNumber: string; // Add batchNumber property if necessary
}
