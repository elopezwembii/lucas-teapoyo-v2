export interface GetDebtResponse {
  id: number;
  desc: string;
  saldada: number;
  costo_total: number;
  deuda_pendiente: number;
  cuotas_totales: number;
  cuotas_pagadas: number;
  pago_mensual: number;
  dia_pago: number;
  id_usuario: number;
  id_banco: number;
  id_tipo_deuda: number;
  created_at: Date;
  updated_at: Date;
}
