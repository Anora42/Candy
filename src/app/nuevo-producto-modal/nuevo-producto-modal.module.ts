import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoProductoModalPageRoutingModule } from './nuevo-producto-modal-routing.module';

import { NuevoProductoModalPage } from './nuevo-producto-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoProductoModalPageRoutingModule
  ],
  declarations: [NuevoProductoModalPage]
})
export class NuevoProductoModalPageModule {}
