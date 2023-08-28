import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  correo: string = '';
  contrasena: string = '';
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private alertController: AlertController
  ) {}

  irALoginAdmin() {
    this.router.navigate(['/login-admin']);
  }

  async Login() {
    const email = this.correo;
    const password = this.contrasena;

    if (!email || !password) {
      const alert = await this.alertController.create({
        header: 'Campos Obligatorios',
        message: 'Por favor, complete todos los campos obligatorios.',
        buttons: ['OK'],
      });

      await alert.present();
      return;
    }

    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      const alert = await this.alertController.create({
        header: 'Credenciales Incorrectas',
        message: 'El correo electrónico o la contraseña son incorrectos.',
        buttons: ['OK'],
      });

      await alert.present();
    }
  }

  Volver() {
    this.router.navigate(['registro']);
  }

  Recuperar() {
    this.router.navigate(['recuperar']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}