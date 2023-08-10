import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportediaPageRoutingModule } from './reportedia-routing.module';

import { ReportediaPage } from './reportedia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportediaPageRoutingModule
  ],
  declarations: [ReportediaPage]
})
export class ReportediaPageModule {}
