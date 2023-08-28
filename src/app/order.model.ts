export interface Order {
  user: string;
  productos: any[];
  totalCompra: number;
  fechaRecoleccion: Date;
  selected: boolean;
  pedidoId: string;
  firebaseId: string;
  inventarioId: string;
}
export interface Producto {
  nombre: string;
  cantidad: number;
}
