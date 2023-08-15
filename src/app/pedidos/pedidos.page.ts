// pedidos.page.ts
import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../pedidos.service';
import { Order } from '../order.model';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {
  orders: Order[] = [];
  categoriaSeleccionada: string = 'categorias';

  constructor(
    private pedidosService: PedidosService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private firestore: AngularFirestore // Agrega AngularFirestore al constructor
  ) {}

  ngOnInit() {
    this.fetchAllOrders();
  }

  fetchAllOrders() {
    this.pedidosService.getAllOrders().subscribe((orders: Order[]) => {
      this.orders = orders;
      
    });
  }
 


  async eliminarPedido(pedidoId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este pedido?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.firestore.collection('pedidos').doc(pedidoId).delete();

              const toast = await this.toastController.create({
                message: 'Pedido eliminado correctamente',
                duration: 2000,
                position: 'bottom',
              });
              toast.present();
            } catch (error) {
              console.error('Error al eliminar el pedido:', error);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  // Helper method to format the date
  formatFechaRecoleccion(timestamp: any): string {
    if (!timestamp) {
      return ''; // O cualquier valor por defecto o mensaje que desees mostrar
    }

    const date = timestamp.toDate(); // Convert Timestamp to Date object
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    });
  }
  irAHomeAdmind() {
    this.router.navigate(['/home-admin']);
  }
  // Método para cambiar el estado de selección del pedido
  toggleOrderSelection(order: Order) {
    order.selected = !order.selected;
  }
}