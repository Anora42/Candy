import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CarritoService } from '../carrito.service';
import { Router } from '@angular/router';
interface MonthData {
  month: string;
  user: string;
  products: any[]; 
  totalCompra: number;
}
@Component({
  selector: 'app-reportemes',
  templateUrl: './reportemes.page.html',
  styleUrls: ['./reportemes.page.scss'],
})
export class ReportemesPage implements OnInit {
  inventario$!: Observable<any[]>; 
  monthlyData: MonthData[] = [];

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    this.inventario$ = this.carritoService.getinventario();
    this.agruparDatosPorMes();
  }

  // Funcion para obtener el numero de mes a partir de una fecha
  public getMonthNumber(date: Date): number {
    return date.getMonth() + 1;
  }

  // Funcion para obtener la fecha formateada en "YYYY-MM"
  public getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  // Funcion para crear una nueva instancia de Date y formatear la fecha
  public formatFechaRecoleccion(fechaRecoleccion: string): string {
    const date = new Date(fechaRecoleccion);
    return this.getFormattedDate(date);
  }
  agruparDatosPorMes() {
    this.inventario$.subscribe((inventarios) => {
      const groupedData: { [key: string]: MonthData } = {};

      inventarios.forEach((inventario) => {
        const month = this.getMonthNameFromDate(inventario.fechaRecoleccion);

        if (!groupedData[month]) {
          groupedData[month] = {
            month: month,
            user: inventario.usuario,
            products: inventario.productos,
            totalCompra: inventario.totalCompra,
          };
        } else {
          groupedData[month].products.push(...inventario.productos);
          groupedData[month].totalCompra += inventario.totalCompra;
        }
      });

      this.monthlyData = Object.values(groupedData);
    });
  }

  getMonthNameFromDate(fechaRecoleccion: string): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const date = new Date(fechaRecoleccion);
    return months[date.getMonth()];
  }

  irAHome(){
    this.router.navigate(['/home-admin']);
  }
}
  