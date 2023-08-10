import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  telefono: string = '';
  correo: string = '';
  editando: boolean = false;
  userId: string = '';
  categoriaSeleccionada: string = 'categorias';
  cambiosRealizados: boolean = false;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // Usuario autenticado, obtener su ID
        const userId = user.uid;
        this.userId = userId;
        this.obtenerDatosUsuario(userId);
      }
    });
  }

  obtenerDatosUsuario(userId: string) {
    const userDocRef = this.firestore.collection('usuarios').doc(userId);
    userDocRef.get().subscribe(doc => {
      if (doc.exists) {
        // El documento del usuario existe, obtener sus datos
        const data = doc.data() as { nombre: string, apellido: string, telefono: string, correo: string };
        this.nombre = data.nombre;
        this.apellido = data.apellido;
        this.telefono = data.telefono;
        this.correo = data.correo;
      }
    });
  }

  guardar() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const userId = user.uid;
        const userDocRef = this.firestore.collection('usuarios').doc(userId);
        userDocRef.update({
          nombre: this.nombre,
          apellido: this.apellido,
          telefono: this.telefono,
          correo: this.correo
        })
        .then(() => {
          console.log('Datos guardados exitosamente en Firestore');
          this.editando = false;
          this.cambiosRealizados = false;
        })
        .catch((error) => {
          console.error('Error al guardar los datos en Firestore:', error);
        });
      }
    });
  }

  habilitarEdicion() {
    this.editando = true;
    this.cambiosRealizados = false;
    this.nombre = '';
    this.apellido = '';
    this.telefono = '';
  }
  

  cancelarEdicion() {
    this.editando = false;
    this.obtenerDatosUsuario(this.userId);
    this.cambiosRealizados = false;
  }

  detectarCambios() {
    if (!this.cambiosRealizados) {
      this.cambiosRealizados = true;
    }
  }
  getIniciales(): string {
    const apellidoInicial = this.apellido ? this.apellido.charAt(0) : '';
    const nombreInicial = this.nombre ? this.nombre.charAt(0) : '';
    return apellidoInicial + nombreInicial;
  }
    cerrarSesion() {
      this.afAuth.signOut()
        .then(() => {
          this.router.navigate(['/login']);
          // Cierre de sesión exitoso, realiza cualquier acción adicional necesaria
        })
        .catch((error) => {
          // Ocurrió un error al cerrar sesión, maneja el error adecuadamente
          console.error('Error al cerrar sesión:', error);
        });
    }
    irAHome(){
      this.router.navigate(['/home']);
    }
  }

