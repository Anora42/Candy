import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  contrasena: string = '';
  constructor(private router: Router) { }
  irALoginAdmin() {
    this.router.navigate(['/login-admin']);
  }



  guardar() {

    console.log('Correo electrónico:', this.email);
    console.log('Contraseña:', this.contrasena);
  }

  Volver(){
    this.router.navigate(['registro']);
  }
  ngOnInit() {
  }

}
