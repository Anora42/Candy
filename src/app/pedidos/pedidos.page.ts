import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../pedidos.service';
import { Order } from '../order.model';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

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
    private firestore: AngularFirestore,
    private navCtrl: NavController

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
      header: 'Confirmar entrega',
      message: '¿El pedido fue realizado?',
      buttons: [
        {
          text: 'Pedido Cancelado',
          handler: async () => {
            try {
              // Eliminar el pedido de la colección "pedidos"
              await this.firestore.collection('pedidos').doc(pedidoId).delete();
          
              // Eliminar el pedido de la colección "inventario"
              await this.firestore.collection('inventario').doc(pedidoId).delete();
          
              const toast = await this.toastController.create({
                message: 'Pedido eliminado correctamente',
                duration: 2000,
                position: 'bottom',
              });
              toast.present();
            } catch (error) {
              console.error('Error al eliminar el pedido:', error);
            }}},
          
        {
          text: 'Pedido Entregado',
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

  formatFechaRecoleccion(timestamp: any): string {
    if (!timestamp) {
      return '';
    }

    const date = timestamp.toDate(); // Convertir tiempo en fecha
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
    console.log('Navegando a HomeAdmin');
    this.router.navigate(['/home-admin'], { queryParams: { reload: 'true' } });
  }
  // Método para cambiar el estado de selección del pedido
  toggleOrderSelection(order: Order) {
    order.selected = !order.selected;
  }
}