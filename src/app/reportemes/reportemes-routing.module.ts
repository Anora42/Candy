import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportemesPage } from './reportemes.page';

const routes: Routes = [
  {
    path: '',
    component: ReportemesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportemesPageRoutingModule {}
