import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  telefono: string = '';
  email: string = '';
  contrasena: string = '';
  codigoVerificacion: string = '';

  recaptchaVerifier?: firebase.auth.RecaptchaVerifier;
  confirmationResult?: firebase.auth.ConfirmationResult;
  showPassword: boolean = false; 

  constructor(
    private toastController: ToastController,    
    private router: Router,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private alertController: AlertController // Add the AlertController
  ) {}

  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container', // ID del elemento HTML del recaptcha
      {
        size: 'normal',
        callback: (response: any) => {
          // Recaptcha verificado correctamente
        },
        'expired-callback': () => {
          // Recaptcha expirado
        },
      }
    );
    this.recaptchaVerifier.render();
  }

  irALogin() {
    this.router.navigate(['/login'], {
      state: { telefono: this.telefono, contrasena: this.contrasena },
    });
  }

  enviarCodigoVerificacion() {
    const phoneNumber = '+52' + this.telefono; // código de país correspondiente
    if (this.recaptchaVerifier) {
      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier)
        .then((confirmationResult) => {
          // El código de verificación se ha enviado correctamente
          this.confirmationResult = confirmationResult;
        })
        .catch((error) => {
          // Ocurrió un error al enviar el código de verificación
          console.error('Error al enviar el código de verificación:', error);
        });
    } else {
      console.error('El objeto recaptchaVerifier es undefined');
    }
  }
  async showMissingFieldsAlert() {
    let missingFields = [];
    if (!this.nombre) missingFields.push('Nombre');
    if (!this.apellido) missingFields.push('Apellido');
    if (!this.telefono) missingFields.push('Teléfono');
    if (!this.email) missingFields.push('Correo electrónico');
    if (!this.contrasena) missingFields.push('Contraseña');
  
    const alert = await this.alertController.create({
      header: 'Campos Obligatorios',
      message: 'Por favor, complete los siguientes campos obligatorios:',
      buttons: ['OK'],
    });
  
    if (missingFields.length > 0) {
      const listItems = missingFields.map((field) => `<li>${field}</li>`).join('');
      alert.message += `${listItems}`;
    }
  
    await alert.present();
  }
  async showRegistrationSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Registro exitoso. ¡Bienvenido!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }

  guardar() {
    if (!this.nombre || !this.apellido || !this.telefono || !this.email || !this.contrasena) {
      // Call the showMissingFieldsAlert() function when any field is missing
      this.showMissingFieldsAlert();
      return;
    }
    if (!this.nombre || !this.apellido || !this.telefono || !this.email || !this.contrasena) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }
    const verificationCode = this.codigoVerificacion; // Obtén el código de verificación ingresado por el usuario
    const credential = this.confirmationResult?.verificationId
      ? firebase.auth.PhoneAuthProvider.credential(
          this.confirmationResult.verificationId,
          verificationCode
        )
      : null;

    if (!credential) {
      console.error('No se pudo obtener la credencial de verificación');
      return;
    }

    this.afAuth
      .createUserWithEmailAndPassword(this.email, this.contrasena)
      .then((userCredential) => {
        const { user } = userCredential;

        if (user) {
          user.updatePhoneNumber(credential)
            .then(() => {
              // Guardar datos adicionales en Firestore
              return this.firestore.collection('usuarios').doc(user.uid).set({
                nombre: this.nombre,
                apellido: this.apellido,
                telefono: this.telefono,
                correo: this.email,
              });
            })
            .then(() => {
              console.log('Usuario registrado y datos guardados exitosamente');
              this.showRegistrationSuccessToast();
              this.router.navigate(['/home']);
            })
            .catch((error: any) => {
              console.error('Error al actualizar el número de teléfono:', error);
            });
        } else {
          throw new Error('El usuario no está disponible');
        }
      })
      .catch((error: any) => {
        console.error('Error al registrar usuario y guardar los datos:', error);
      });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
}
}