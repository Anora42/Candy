import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleProductoModalPage } from './detalle-producto-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleProductoModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleProductoModalPageRoutingModule {}
