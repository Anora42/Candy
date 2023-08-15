import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportesemanaPageRoutingModule } from './reportesemana-routing.module';

import { ReportesemanaPage } from './reportesemana.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportesemanaPageRoutingModule
  ],
  declarations: [ReportesemanaPage]
})
export class ReportesemanaPageModule {}
