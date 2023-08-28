import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-detalle-producto-modal',
  templateUrl: './detalle-producto-modal.page.html',
  styleUrls: ['./detalle-producto-modal.page.scss'],
})
export class DetalleProductoModalPage  {

  producto: any;

  constructor(private modalController: ModalController, private navParams: NavParams) {
    this.producto = this.navParams.get('producto');
  }
  
  imagenNoDisponible(event: any) {
    event.target.src = 'ruta-de-la-imagen-por-defecto';
  }

  cerrarModal() {
    this.modalController.dismiss();
  }
}
 


