import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DetalleProductoModalPage } from '../detalle-producto-modal/detalle-producto-modal.page';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';



export interface ProductoOferta {
  id: string;
  nombre: string;
  precio: number;
  precioPorMayor: number;
  descripcion: string;
  categoria: string;
  imagen: string;
  cantidad: number;
}



@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.page.html',
  styleUrls: ['./ofertas.page.scss'],
})
export class OfertasPage implements OnInit {
  productosOfertasCollection?: AngularFirestoreCollection<ProductoOferta>;
  productosOfertas$?: Observable<ProductoOferta[]>;
  

constructor(private firestore: AngularFirestore,  
  private modalController: ModalController, 
  private toastController: ToastController,
  private router: Router) { }

  ngOnInit() {
    this.productosOfertasCollection = this.firestore.collection<ProductoOferta>('ofertas');
    this.productosOfertas$ = this.productosOfertasCollection.valueChanges();
  }
   imagenNoDisponible(event: any) {
    // Lógica para manejar el caso de imagen no disponible
    event.target.src = 'ruta-de-la-imagen-por-defecto';
  }
  async agregarAlCarrito(producto: any) {
    if (producto.cantidad > 0) {
      // Restar la cantidad del producto
      producto.cantidad--;

      // Actualizar el contador en el botón
      const contadorButton = document.getElementById(`contador-${producto.id}`);
      if (contadorButton) {
        contadorButton.innerHTML = producto.cantidad.toString();
      }

      // Mostrar un mensaje emergente
      const toast = await this.toastController.create({
        message: 'Producto agregado al carrito',
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
    }
  }
  async mostrarDetalle(producto: any) {
    const modal = await this.modalController.create({
      component: DetalleProductoModalPage,
      componentProps: {
        producto: producto
      }
    });
    return await modal.present();
  }
  irAHome(){
    this.router.navigate(['/home']);
  }
}
