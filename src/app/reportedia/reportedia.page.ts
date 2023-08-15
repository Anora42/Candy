import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CarritoService } from '../carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportedia',
  templateUrl: './reportedia.page.html',
  styleUrls: ['./reportedia.page.scss'],
})
export class ReportediaPage implements OnInit {
  inventario$!: Observable<any[]>; // Usar "!" para indicar que será inicializada
  totalCompraTotal: number = 0;

  constructor(private carritoService: CarritoService,private router: Router ) {}

  ngOnInit() {
    this.inventario$ = this.carritoService.getinventario(); // Obtener la lista de todos los pedidos
    this.calcularTotalCompra(); // Calcular la suma total al cargar el componente
  }
  irAHome(){
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
