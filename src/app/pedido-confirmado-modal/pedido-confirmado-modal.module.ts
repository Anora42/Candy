import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoConfirmadoModalPageRoutingModule } from './pedido-confirmado-modal-routing.module';

import { PedidoConfirmadoModalPage } from './pedido-confirmado-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidoConfirmadoModalPageRoutingModule
  ],
  declarations: [PedidoConfirmadoModalPage]
})
export class PedidoConfirmadoModalPageModule {}
