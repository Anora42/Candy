import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarPrecioModalPage } from './editar-precio-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EditarPrecioModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarPrecioModalPageRoutingModule {}
