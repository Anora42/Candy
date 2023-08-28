import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.page.html',
  styleUrls: ['./login-admin.page.scss'],
})
export class LoginAdminPage {
  email: string = '';
  contrasena: string = '';
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private alertController: AlertController, 
    private toastController: ToastController,
  ) {}

  irALogin() {
    this.router.navigate(['/login']);
  }

  async showEmptyFieldsAlert() {
    const alert = await this.alertController.create({
      header: 'Campos Vacíos',
      message: 'Por favor, complete todos los campos obligatorios.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showInvalidCredentialsAlert() {
    const alert = await this.alertController.create({
      message: 'Correo y/o contraseña incorrectos',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showSuccessMessage() {
    const toast = await this.toastController.create({
      header: 'BIENVENIDO ADMINISTRADOR',
      message: 'Administrador autenticado correctamente',
      duration: 2000,
      position: 'middle',
      color: 'tertiary'
    });
    toast.present();
  }

  async iniciarSesion() {
    if (!this.email || !this.contrasena) {
      this.showEmptyFieldsAlert();
      return;
    }
  
    // Verificar las credenciales de administrador
    if (this.email === 'solucionesgap1@gmail.com' && this.contrasena === 'DulceriaEstrella') {
      try {
        // Autentica al administrador con Firebase Authentication
        await this.afAuth.signInWithEmailAndPassword(this.email, this.contrasena);
  
        this.showSuccessMessage();
  
        this.router.navigate(['/home-admin']);
      } catch (error) {
        console.error('Error al autenticar al administrador', error);
        this.showInvalidCredentialsAlert();
      }
    } else {
      this.showInvalidCredentialsAlert();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}