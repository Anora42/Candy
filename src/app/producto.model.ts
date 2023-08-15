export interface Producto {
    id: string;
    nombre: string;
    precio: number;
    precioPorMayor: number;
    descripcion: string;
    categoria: string;
    imagen: string;
    cantidad: number;
    mostrarDetalle:boolean;
    fechaRecoleccion: Date; 
  }