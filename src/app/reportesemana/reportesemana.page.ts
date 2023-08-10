import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CarritoService } from '../carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportesemana',
  templateUrl: './reportesemana.page.html',
  styleUrls: ['./reportesemana.page.scss'],
})
export class ReportesemanaPage implements OnInit {
  inventario$!: Observable<any[]>; // Usar "!" para indicar que será inicializada
  totalCompraTotal: number = 0;

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    this.inventario$ = this.carritoService.getinventario();
    this.calcularTotalCompra(); // Calcular la suma total al cargar el componente
  }

  // Función para obtener el número de semana a partir de una fecha
  public getWeekNumber(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000); // 604800000 = 7 * 24 * 3600 * 1000
  }

  // Función para obtener la fecha formateada en "YYYY-MM-DD"
  public getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Función para crear una nueva instancia de Date y obtener el número de semana
  public getWeekFromDate(fechaRecoleccion: string): number {
    const date = new Date(fechaRecoleccion);
    return this.getWeekNumber(date);
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
