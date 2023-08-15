import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'login-admin',
    loadChildren: () => import('./login-admin/login-admin.module').then( m => m.LoginAdminPageModule)
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./recuperar/recuperar.module').then( m => m.RecuperarPageModule)
  },
  {
    path: 'home-admin',
    loadChildren: () => import('./home-admin/home-admin.module').then( m => m.HomeAdminPageModule)
  },
  {
    path: 'nuevo-producto-modal',
    loadChildren: () => import('./nuevo-producto-modal/nuevo-producto-modal.module').then( m => m.NuevoProductoModalPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'editar-precio-modal',
    loadChildren: () => import('./editar-precio-modal/editar-precio-modal.module').then( m => m.EditarPrecioModalPageModule)
  },
  {
    path: 'detalle-producto-modal',
    loadChildren: () => import('./detalle-producto-modal/detalle-producto-modal.module').then( m => m.DetalleProductoModalPageModule)
  },
  
  {
    path: 'ofertas',
    loadChildren: () => import('./ofertas/ofertas.module').then( m => m.OfertasPageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'pedido-confirmado-modal',
    loadChildren: () => import('./pedido-confirmado-modal/pedido-confirmado-modal.module').then( m => m.PedidoConfirmadoModalPageModule)
  },
  {
    path: 'reportedia',
    loadChildren: () => import('./reportedia/reportedia.module').then( m => m.ReportediaPageModule)
  },
  {
    path: 'reportesemana',
    loadChildren: () => import('./reportesemana/reportesemana.module').then( m => m.ReportesemanaPageModule)
  },
  {
    path: 'reportemes',
    loadChildren: () => import('./reportemes/reportemes.module').then( m => m.ReportemesPageModule)
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./pedidos/pedidos.module').then( m => m.PedidosPageModule)
  },
  {
    path: 'perfil-admin',
    loadChildren: () => import('./perfil-admin/perfil-admin.module').then( m => m.PerfilAdminPageModule)
  },
  {
    path: 'welcome-modal',
    loadChildren: () => import('./welcome-modal/welcome-modal.module').then( m => m.WelcomeModalPageModule)
  },
  {
    path: 'login-modal',
    loadChildren: () => import('./login-modal/login-modal.module').then( m => m.LoginModalPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  declarations: [
    // Otros componentes declarados anteriormente
  ],
  exports: [RouterModule]
  
})
export class AppRoutingModule { }
