import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  email: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertController: AlertController
  ) {}

  async recoverPassword() {
    const { email } = this;

    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El correo electrónico ingresado no es válido',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      // Envio de correo electrónico de restablecimiento de contraseña
      await this.afAuth.sendPasswordResetEmail(email);

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Se ha enviado un enlace de restablecimiento de contraseña a su correo electrónico',
        buttons: ['OK']
      });
      await alert.present();

      this.router.navigate(['login']);
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: error.message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  Cancel() {
    this.router.navigate(['login']);
  }
}
