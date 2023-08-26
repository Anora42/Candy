export interface Order {
  user: string;
  productos: any[]; 
  totalCompra: number;
  fechaRecoleccion: Date;
  selected: boolean;
  pedidoId: string;
  firebaseId: string;

}
export interface Producto {
  nombre: string;
  cantidad: number;
  // Otros campos relacionados con el producto
}