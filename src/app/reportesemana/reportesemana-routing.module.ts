import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportesemanaPage } from './reportesemana.page';

const routes: Routes = [
  {
    path: '',
    component: ReportesemanaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesemanaPageRoutingModule {}
