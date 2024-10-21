export interface GetVariableSpendResponse {
  id: number;
  desc: string;
  monto: number;
  dia: null;
  mes: number;
  anio: number;
  fijar: number;
  mes_termino: null;
  anio_termino: null;
  id_usuario: number;
  tipo_gasto: number;
  subtipo_gasto: number;
  created_at: Date;
  updated_at: Date;
  ahorro_id: null;
  deuda_id: null;
  get_sub_tipo: GetSubTipo;
}

export interface GetSubTipo {
  id: number;
  nombre: string;
  created_at: Date;
  updated_at: Date;
}
