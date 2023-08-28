import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CarritoService } from '../carrito.service';
import { Router } from '@angular/router';
interface WeekData {
  week: number;
  user: string;
  products: any[]; 
  totalCompra: number;
}
@Component({
  selector: 'app-reportesemana',
  templateUrl: './reportesemana.page.html',
  styleUrls: ['./reportesemana.page.scss'],
})
export class ReportesemanaPage implements OnInit {
  inventario$!: Observable<any[]>; 
  weeklyData: WeekData[] = [];

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    this.inventario$ = this.carritoService.getinventario();
    this.agruparDatosPorSemana();
  }

  public getWeekNumber(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000); 
  }

  public getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public getWeekFromDate(fechaRecoleccion: string): number {
    const date = new Date(fechaRecoleccion);
    return this.getWeekNumber(date);
  }
  irAHome(){
    this.router.navigate(['/home-admin']);
  }
  agruparDatosPorSemana() {
    this.inventario$.subscribe((inventarios) => {
      const groupedData: { [key: number]: WeekData } = {};

      inventarios.forEach((inventario) => {
        const week = this.getWeekFromDate(inventario.fechaRecoleccion);

        if (!groupedData[week]) {
          groupedData[week] = {
            week: week,
            user: inventario.usuario,
            products: inventario.productos,
            totalCompra: inventario.totalCompra,
          };
        } else {
          groupedData[week].products.push(...inventario.productos);
          groupedData[week].totalCompra += inventario.totalCompra;
        }
      });

      this.weeklyData = Object.values(groupedData);
    });
  }
}

