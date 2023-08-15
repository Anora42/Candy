import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidoConfirmadoModalPage } from './pedido-confirmado-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoConfirmadoModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoConfirmadoModalPageRoutingModule {}
