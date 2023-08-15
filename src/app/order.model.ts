export interface Order {
  user: string;
  productos: any[]; // Cambiar esto por el tipo de objeto que represente un producto en el pedido
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