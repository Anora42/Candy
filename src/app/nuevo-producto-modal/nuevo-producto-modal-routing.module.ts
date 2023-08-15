import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoProductoModalPage } from './nuevo-producto-modal.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoProductoModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoProductoModalPageRoutingModule {}
