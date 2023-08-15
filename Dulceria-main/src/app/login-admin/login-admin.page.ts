import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.page.html',
  styleUrls: ['./login-admin.page.scss'],
})
export class LoginAdminPage implements OnInit {
  email: string = '';
  contrasena: string = '';
  constructor(private router: Router) { }
  irALogin() {
    this.router.navigate(['/login']);
  }



  guardar() {

    console.log('Correo electrónico:', this.email);
    console.log('Contraseña:', this.contrasena);
  }
  ngOnInit() {
  }

}
