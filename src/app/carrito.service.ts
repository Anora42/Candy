import { Injectable } from '@angular/core';
import { Producto } from './producto.model';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';





@Injectable({
    providedIn: 'root'
  })
  export class CarritoService {
    public fechaRecoleccion: Date | null = null;
    carrito: Producto[] = [];
    totalCompra: number = 0;

    dia: string = '';
   semana: string = '';
    mes: string = '';

    productosOriginales: Producto[] = [];
    private productosCollection: AngularFirestoreCollection<Producto>;
    

    constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) { 
       this.productosCollection = this.firestore.collection<Producto>('productos');
    }

    getinventario(): Observable<any[]> {
      const pedidosRef = this.firestore.collection('inventario');
      return pedidosRef.valueChanges();
    }


    agregarProducto(producto: Producto) {
      const productoEnCarrito = this.carrito.find((item) => item.nombre === producto.nombre);
      if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
      } else {
        this.carrito.push({ ...producto, cantidad: 1 });
      }
     
    }
    
    getCarrito(): Producto[] {
      return this.carrito; 
    }
  
    vaciarCarrito() {
      this.carrito = []; 
    }
    
    setFechaRecoleccion(fecha: Date) {
      this.fechaRecoleccion = fecha;
      // Calcula los valores de dia, semana y mes a partir de la fecha de recolección
      this.dia = fecha.toISOString().substr(0, 10); // YYYY-MM-DD
      this.semana = this.getWeekNumber(fecha).toString();
      this.mes = fecha.toISOString().substr(0, 7); // YYYY-MM
    
      // Asegúrate de que los valores no sean vacíos o nulos
      if (!this.dia) {
        this.dia = 'unknown';
      }
      if (!this.semana) {
        this.semana = 'unknown';
      }
      if (!this.mes) {
        this.mes = 'unknown';
      }
    }
    
    private getWeekNumber(date: Date): number {
      const target = new Date(date.valueOf());
      const dayNr = (date.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNr + 3);
      const firstThursday = target.valueOf();
      target.setMonth(0, 1);
      if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
      }
      return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000); // 604800000 = 7 * 24 * 3600 * 1000
    }
// Obtener el número de semana a partir de una fecha
private getFormattedDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
  


async actualizarCantidadProducto(nombre: string, cantidad: number): Promise<void> {
  try {
    const querySnapshot = await this.firestore.collection<Producto>('productos', ref =>
      ref.where('nombre', '==', nombre).limit(1)
    ).get().toPromise();

    if (querySnapshot && !querySnapshot.empty) { // Verificar si querySnapshot no es undefined
      const docRef = querySnapshot.docs[0].ref;
      const productoData = querySnapshot.docs[0].data() as Producto;
      const currentCantidad = productoData.cantidad || 0;
      const updatedCantidad = currentCantidad - cantidad;

      await docRef.update({ cantidad: updatedCantidad });
    } else {
      console.error('No se encontró el producto con el nombre:', nombre);
      throw new Error('Producto no encontrado en la base de datos');
    }
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto en la base de datos:', error);
    throw error;
  }
}





async guardarCarritoEnFirestore(diaCarritoId: string, semanaCarritoId: string, mesCarritoId: string) {
  try {
    const user = await this.afAuth.currentUser;
    if (user) {
      const email = user.email;
      if (email) {
        const carritoRef = this.firestore.collection('carrito').doc(email);
        const ordersRef = carritoRef.collection('orders');
        const pedidosRef = this.firestore.collection('inventario'); // Referencia a la colección "pedidos"

        // Guarde el pedido en la subcolección adecuada según la fecha seleccionada
        if (this.fechaRecoleccion) {
          const diaCarritoId = uuidv4();
          console.log('Dia Carrito ID:', diaCarritoId);
          ordersRef.doc('dia').collection(this.getFormattedDate(this.fechaRecoleccion)).doc(diaCarritoId).set({
            productos: this.carrito,
            totalCompra: this.totalCompra
          });
          console.log('Carrito guardado en Firestore');

          // También guarda el pedido en la colección "pedidos"
          const inventarioId = uuidv4();
          console.log('Inventario ID:', inventarioId);
          pedidosRef.doc(inventarioId).set({
            usuario: email,
            fechaRecoleccion: this.getFormattedDate(this.fechaRecoleccion),
            productos: this.carrito,
            totalCompra: this.totalCompra
          });
          console.log('Inventario guardado en Firestore');
        }
          
     
          // Crear subcolección para la semana
          console.log('Semana:', this.semana);
          if (!this.semana) {
            console.error('ERROR: Valor de "this.semana" es nulo o vacío.');
          } else {
            const semanaCarritoId = uuidv4(); // Identificador único para el pedido en la semana
            console.log('Semana Carrito ID:', semanaCarritoId);
            ordersRef.doc('semana').collection(this.semana).doc(semanaCarritoId).set({
              // Aquí puedes guardar los datos del pedido en la subcolección "semana"
              productos: this.carrito,
              totalCompra: this.totalCompra
            });
          }
    
          // Crear subcolección para el mes
          console.log('Mes:', this.mes);
          if (!this.mes) {
            console.error('ERROR: Valor de "this.mes" es nulo o vacío.');
          } else {
            const mesCarritoId = uuidv4(); // Identificador único para el pedido en el mes
            console.log('Mes Carrito ID:', mesCarritoId);
            ordersRef.doc('mes').collection(this.mes).doc(mesCarritoId).set({
              // Aquí puedes guardar los datos del pedido en la subcolección "mes"
              productos: this.carrito,
              totalCompra: this.totalCompra
            });
          }
    
          console.log('Carrito guardado en Firestore');
        } else {
          console.error('El usuario no tiene un correo electrónico.');
        }
      } else {
        console.error('No se pudo obtener el usuario actual.');
      }
    } catch (error) {
      console.error('Error al guardar el carrito en Firestore:', error);
    }
  }
  // Agregar función para guardar el pedido en la colección "pedidos"
  guardarPedidoEnPedidos(diaCarritoId: string, semanaCarritoId: string, mesCarritoId: string) {
    const user = firebase.auth().currentUser;
    if (user) {
      const email = user.email;
      if (email) {
        const pedidoRef = this.firestore.collection('pedidos');

        // Guardar el pedido en la colección "pedidos"
        if (this.fechaRecoleccion) {
          const pedidoId = uuidv4(); // Identificador único para el pedido
          console.log('Pedido ID:', pedidoId);
          pedidoRef.doc(pedidoId).set({
            user: email,
            productos: this.carrito,
            totalCompra: this.totalCompra,
            fechaRecoleccion: this.fechaRecoleccion,
            pedidoId: pedidoId, // Agregar el pedidoId
          });
        }

        console.log('Pedido guardado en la colección "pedidos"');
      } else {
        console.error('El usuario no tiene un correo electrónico.');
      }
    } else {
      console.error('No se pudo obtener el usuario actual.');
    }
  }


  
    removeProducto(producto: Producto) {
      // Encontrar el índice del producto en el carrito
      const index = this.carrito.findIndex((p) => p.nombre === producto.nombre);
  
      // Si el producto está en el carrito, eliminarlo
      if (index !== -1) {
        this.carrito.splice(index, 1);
    }
   }
}