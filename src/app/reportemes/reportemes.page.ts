import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CarritoService } from '../carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportemes',
  templateUrl: './reportemes.page.html',
  styleUrls: ['./reportemes.page.scss'],
})
export class ReportemesPage implements OnInit {
  inventario$!: Observable<any[]>; // Usar "!" para indicar que será inicializada
  totalCompraTotal: number = 0;

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    this.inventario$ = this.carritoService.getinventario();
    this.calcularTotalCompra(); // Calcular la suma total al cargar el componente
  }

  // Función para obtener el número de mes a partir de una fecha
  public getMonthNumber(date: Date): number {
    return date.getMonth() + 1;
  }

  // Función para obtener la fecha formateada en "YYYY-MM"
  public getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  // Función para crear una nueva instancia de Date y formatear la fecha
  public formatFechaRecoleccion(fechaRecoleccion: string): string {
    const date = new Date(fechaRecoleccion);
    return this.getFormattedDate(date);
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
