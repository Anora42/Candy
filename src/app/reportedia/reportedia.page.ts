import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CarritoService } from '../carrito.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reportedia',
  templateUrl: './reportedia.page.html',
  styleUrls: ['./reportedia.page.scss'],
})
export class ReportediaPage implements OnInit {
  inventario$!: Observable<any[]>; 
  totalCompraTotal: number = 0;
  contrasena: string = 'DulceriaEstrella';

  constructor(private carritoService: CarritoService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
    ) {}
    showInvalidAdminAlert() {
      this.alertController.create({
        header: 'Acceso no autorizado',
        message: 'No tienes permisos para acceder a esta vista.',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.router.navigate(['/login']); 
            }
          }
        ]
      }).then(alert => {
        alert.present();
      });
    }
  
  ngOnInit() {
    this.afAuth.authState.subscribe(async user => {
      if (user) {
        if (user.email === 'solucionesgap1@gmail.com' && this.contrasena === 'DulceriaEstrella') {
         
          try {

            this.loadReporteInventarioView();
          } catch (error) {
            this.showInvalidAdminAlert();
          }
        } else {
         
          this.showInvalidAdminAlert();
        }
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  loadReporteInventarioView() {
    this.inventario$ = this.carritoService.getinventario(); // Obtener la lista de todos los pedidos
    this.calcularTotalCompra(); 
  }

  irAHome() {
    this.router.navigate(['/home-admin']);
  }
  calcularTotalCompra() {
    this.inventario$.subscribe((inventarios) => {
      this.totalCompraTotal = inventarios.reduce(
        (total, inventario) => total + inventario.totalCompra,
        0
      );
    });
  }
}
