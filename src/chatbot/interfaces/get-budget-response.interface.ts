export interface GetBudgetResponse {
  presupuesto: Presupuesto[];
  ingreso: number;
}

export interface Presupuesto {
  id: number;
  mes: number;
  anio: number;
  fijado: number;
  id_usuario: number;
  created_at: Date;
  updated_at: Date;
  get_items: GetItem[];
}

export interface GetItem {
  id: number;
  monto: number;
  id_presupuesto: number;
  tipo_gasto: number;
  created_at: Date;
  updated_at: Date;
}
