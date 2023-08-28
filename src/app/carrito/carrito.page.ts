// carrito.page.ts
import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { Producto } from '../producto.model';
import { v4 as uuidv4 } from 'uuid';
import { ModalController } from '@ionic/angular';
import { PedidoConfirmadoModalPage } from '../pedido-confirmado-modal/pedido-confirmado-modal.page'; // Import PedidoConfirmadoModalPage
import {  AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFirestore,  } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  carrito: Producto[] = [];
  productosAgrupados: { [key: string]: Producto[] } = {};
  total: number = 0;
  private productosCollection: AngularFirestoreCollection<Producto>;

  constructor(private carritoService: CarritoService, private modalController: ModalController,
  private firestore: AngularFirestore,
  private alertController: AlertController,
  private router: Router
  ) {
    this.productosCollection = this.firestore.collection<Producto>('productos');
  }


  ngOnInit() {
    this.carrito = this.carritoService.getCarrito();
    this.productosAgrupados = this.groupByNombre(this.carrito);
    this.calculateTotal();
    this.carritoService.setFechaRecoleccion(new Date()); // Establecer fechaRecoleccion a la fecha actual
  }

  fechaRecoleccion: Date | null = null;

  async setFechaRecoleccion(eventValue: string) {
    const fechaSeleccionada = new Date(eventValue);
    const fechaActual = new Date();
  
    if (fechaSeleccionada < fechaActual) {
      // Mostrar alerta de fecha no válida
      await this.mostrarAlertaFechaPasada();
    } else {
      this.carritoService.setFechaRecoleccion(fechaSeleccionada);
    }
  }

  private groupByNombre(productos: Producto[]): { [key: string]: Producto[] } {
    const groupedProducts: { [key: string]: Producto[] } = {};

    productos.forEach((producto) => {
      const nombre = producto.nombre;
      if (!groupedProducts[nombre]) {
        groupedProducts[nombre] = [];
      }
      groupedProducts[nombre].push({ ...producto });
    });

    return groupedProducts;
  }

  getProductKeys() {
    return Object.keys(this.productosAgrupados);
  }
  

  removeProduct(producto: Producto) {
    
    const index = this.carrito.findIndex((p) => p.nombre === producto.nombre);
  
    // Si el producto está en el carrito, reducir su cantidad en uno
    if (index !== -1) {
      const productoEnCarrito = this.carrito[index];
      if (productoEnCarrito.cantidad > 1) {
        productoEnCarrito.cantidad--;
      } else {
        // Si la cantidad es 1 o menos, eliminar el producto del carrito
        this.carrito.splice(index, 1);
      }
    }
  
    // Actualizar la lista de productos agrupados y el total
    this.productosAgrupados = this.groupByNombre(this.carrito);
    this.calculateTotal();
  }
  
  

  private calculateTotal() {
    this.total = 0;
    this.carrito.forEach((producto) => {
      this.total += producto.precio * producto.cantidad;
    });
    this.carritoService.totalCompra = this.total;
  }
  async actualizarCantidadesEnBaseDeDatos() {
    const productosCarrito = this.carritoService.getCarrito();
    for (const producto of productosCarrito) {
      await this.carritoService.actualizarCantidadProducto(producto.nombre, producto.cantidad);
    }
  }

  async realizarPedido() {
    if (this.carritoService.fechaRecoleccion) {
      if (this.carritoService.getCarrito().length === 0) {
        // Mostrar una alerta indicando que el carrito está vacío
        await this.mostrarAlertaCarritoVacio();
      } else {
        const confirmacion = await this.mostrarDialogoConfirmacion();

        if (confirmacion) {
          const diaCarritoId = 'some-unique-id';
          const semanaCarritoId = 'some-unique-id';
          const mesCarritoId = 'some-unique-id';
          this.carritoService.guardarCarritoEnFirestore(diaCarritoId, semanaCarritoId, mesCarritoId);

          await this.actualizarCantidadesEnBaseDeDatos();

          // Muestra un modal de confirmación con los detalles del pedido
          const modal = await this.modalController.create({
            component: PedidoConfirmadoModalPage,
            componentProps: {
              productos: this.carritoService.getCarrito(),
              totalCompra: this.carritoService.totalCompra,
              fechaRecoleccion: this.carritoService.fechaRecoleccion,
            },
          });

          // Descarta el modal y vaciar el carrito cuando esté cerrado
          modal.onDidDismiss().then(() => {
            this.carritoService.vaciarCarrito();
          });

          await modal.present();
        }
      }
    } else {
      console.error('Por favor, selecciona una fecha y hora de recolección válidas.');
    }
  }

  async mostrarAlertaCarritoVacio() {
    const alert = await this.alertController.create({
      header: 'Carrito vacío',
      message: 'No puedes realizar un pedido con el carrito vacío.',
      buttons: ['OK'],
    });

    await alert.present();
  }
irAHome(){
  this.router.navigate(['/home']);
}
async mostrarAlertaFechaPasada() {
  const alert = await this.alertController.create({
    header: 'Fecha no válida',
    message: 'No puede seleccionar una fecha y hora anterior a la actual.',
    buttons: ['OK'],
  });

  await alert.present();
  }
async mostrarDialogoConfirmacion(): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    const alert = await this.alertController.create({
      header: 'Confirmación de Pedido',
      message: '¿Estás seguro de que deseas realizar este pedido?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            resolve(false);
          },
        },
        {
          text: 'Confirmar',
          handler: () => {
            resolve(true);
          },
        },
      ],
    });

    await alert.present();
    });
  }
}