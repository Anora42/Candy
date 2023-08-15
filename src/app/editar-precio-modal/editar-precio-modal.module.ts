import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarPrecioModalPageRoutingModule } from './editar-precio-modal-routing.module';

import { EditarPrecioModalPage } from './editar-precio-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarPrecioModalPageRoutingModule
  ],
  declarations: [EditarPrecioModalPage]
})
export class EditarPrecioModalPageModule {}
