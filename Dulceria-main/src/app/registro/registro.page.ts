import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  nombre: string = '';
  apellido: string = '';
  telefono: string = '';
  email: string = '';
  contrasena: string = '';

  constructor(private router: Router) { }
  irALogin() {
    this.router.navigate(['/login']);
  }
  

  guardar() {
    console.log('Nombre:', this.nombre);
    console.log('Apellido:', this.apellido);
    console.log('Teléfono:', this.telefono);
    console.log('Correo electrónico:', this.email);
    console.log('Contraseña:', this.contrasena);
  }
}
