import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CarritoService } from '../carrito.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Agrega esta importación
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reportedia',
  templateUrl: './reportedia.page.html',
  styleUrls: ['./reportedia.page.scss'],
})
export class ReportediaPage implements OnInit {
  inventario$!: Observable<any[]>; // Usar "!" para indicar que será inicializada
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
              this.router.navigate(['/login']); // Redirige a la página de inicio de sesión u otra vista
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
          // Autenticar al administrador con Firebase Authentication
          try {

            this.loadReporteInventarioView();
          } catch (error) {
            this.showInvalidAdminAlert();
          }
        } else {
          // Usuario autenticado, pero no es administrador, mostrar alerta y redirigir
          this.showInvalidAdminAlert();
        }
      } else {
        // Usuario no autenticado, redirigir a la página de inicio de sesión
        this.router.navigate(['/home']);
      }
    });
  }

  loadReporteInventarioView() {
    this.inventario$ = this.carritoService.getinventario(); // Obtener la lista de todos los pedidos
    this.calcularTotalCompra(); // Calcular la suma total al cargar el componente
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
