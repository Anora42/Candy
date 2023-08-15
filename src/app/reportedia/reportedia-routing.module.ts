import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportediaPage } from './reportedia.page';

const routes: Routes = [
  {
    path: '',
    component: ReportediaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportediaPageRoutingModule {}
