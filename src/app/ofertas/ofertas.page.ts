import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import Swiper, { Navigation, Autoplay } from 'swiper';
import { ModalController, NavController} from '@ionic/angular';
import { NuevoProductoModalPage } from '../nuevo-producto-modal/nuevo-producto-modal.page';
import { EditarPrecioModalPage } from '../editar-precio-modal/editar-precio-modal.page';
import { ToastController } from '@ionic/angular';
import { DetalleProductoModalPage } from '../detalle-producto-modal/detalle-producto-modal.page';
import { CarritoService } from '../carrito.service';
import { map, startWith, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { WelcomeModalPage } from '../welcome-modal/welcome-modal.page';
import { LoginModalPage } from '../login-modal/login-modal.page';





interface Producto {
  id: string;
  nombre: string;
  precio: number;
  precioPorMayor: number;
  descripcion: string;
  categoria: string;
  imagen: string;
  cantidad: number;
  mostrarDetalle: boolean;
  fechaRecoleccion: Date; 
  horaRecoleccion: Date;
  cantidadCarrito: number; 
}
export interface ProductoOferta {
  id: string;
  nombre: string;
  precio: number;
  precioPorMayor: number;
  descripcion: string;
  categoria: string;
  imagen: string;
  cantidad: number;
}
@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.page.html',
  styleUrls: ['./ofertas.page.scss'],
})
export class OfertasPage implements OnInit {
  categorias: string[] = [];
  categoriaSeleccionada: string = 'categorias';
  productosCollection!: AngularFirestoreCollection<Producto>;
  productos$!: Observable<Producto[]>;
  productos!: Producto[]; 
  carrito: Producto[] = [];
  searchQuery: string = ''; 
  cantidadTotalCarrito = 0;
  userId: string = '';
  imagenNoDisponible(event: any) {
    event.target.src = 'ruta-de-la-imagen-por-defecto';
  }
  constructor(
    private modalController: ModalController,  
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private navCtrl: NavController,
    private carritoService: CarritoService,
    private afAuth: AngularFireAuth,
    private router:Router
  ) {}

  ngOnInit() {
    
    Swiper.use([Navigation]);
    this.productosCollection = this.firestore.collection<Producto>('productos');
    this.productos$ = this.productosCollection.valueChanges().pipe(
      map((productos: Producto[]) => {
      productos.forEach((producto) => (producto.cantidadCarrito = producto.cantidad));
        if (this.searchQuery.trim() !== '') {
          return productos.filter((producto: Producto) => producto.nombre.includes(this.searchQuery));
        } else {
          if (this.categoriaSeleccionada === 'categorias') {
            return productos;
          } else {
            return productos.filter((producto: Producto) => producto.categoria === this.categoriaSeleccionada);
          }
        }
      }),
      startWith([]), 
      tap((productos: Producto[]) => {
      
        console.log(productos);
      })
    );
    
    this.carritoService.getCarrito().forEach((producto) => {
      const contadorButton = document.getElementById(`contador-${producto.nombre}`);
      if (contadorButton) {
        contadorButton.innerHTML = producto.cantidad.toString();
      }
    });
  }
  
  async agregarAlCarrito(producto: Producto, cantidad: number) {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
      
        const userId = user.uid;
        const userDocRef = this.firestore.collection('usuarios').doc(userId);
  
        const userSnapshot = await userDocRef.get().toPromise();
        if (userSnapshot && userSnapshot.exists) {
          console.log('Usuario autenticado y existe en la colección "usuarios"');
        } else {
          // Mostrar el modal para iniciar sesion
          const loginModal = await this.modalController.create({
            component: LoginModalPage,
            cssClass: 'my-custom-modal'
          });
          loginModal.present();
          return;
        }
      } else {
        // si el usuario no esta autenticado mustra el modal para iniciar sesion o registrarse
        const loginModal = await this.modalController.create({
          component: LoginModalPage,
          cssClass: 'my-custom-modal'
        });
        loginModal.present();
        return; 
      }
  
    } catch (error) {
      console.error('Error al verificar la autenticación o la existencia del usuario:', error);
    }
  
  
  
    // Verificar si hay suficientes productos disponibles para agregar al carrito
    if (producto.cantidad >= cantidad) {
      producto.cantidad -= cantidad; // Restar la cantidad seleccionada del producto

      // Agregar el producto al carrito
      this.carritoService.agregarProducto(producto);

      // Actualizar el contador en el boton despues de agregar un producto al carrito
      const contadorButton = document.getElementById(`contador-${producto.nombre}`);
      if (contadorButton) {
        contadorButton.innerHTML = producto.cantidad.toString();
      }

      const toast = await this.toastController.create({
        message: 'Producto agregado al carrito',
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: 'No hay suficientes productos disponibles',
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
    }
    
  }
  
 // obtiene el total del producto del carrito de compras 
 getTotalProductosEnCarrito(): number {
  return this.carritoService.getCarrito().reduce((total, producto) => total + producto.cantidad, 0);
}

// Función para vaciar el carrito
vaciarCarrito() {
  this.carritoService.vaciarCarrito();
}

buscar() {
  const searchQueryLower = this.searchQuery.toLowerCase(); // combierte las letras de busqueda 

  if (searchQueryLower.trim() !== '') {
    this.productos$ = this.productosCollection.valueChanges().pipe(
      map((productos: Producto[]) =>
        productos.filter((producto: Producto) =>
          producto.nombre.toLowerCase().includes(searchQueryLower) 
        )
      ),
      tap(() => (this.categoriaSeleccionada = 'categorias'))
    );
  } else {
    if (this.categoriaSeleccionada === 'categorias') {
      this.productos$ = this.productosCollection.valueChanges().pipe(
        tap(() => (this.categoriaSeleccionada = 'categorias'))
      );
    } else {
      this.productos$ = this.productosCollection.valueChanges().pipe(
        map((productos: Producto[]) =>
          productos.filter(
            (producto: Producto) =>
              producto.categoria === this.categoriaSeleccionada
          )
        ),
        tap(() => (this.categoriaSeleccionada = 'categorias'))
      );
    }
  }
}




  async mostrarDetalle(producto: any) {
    const modal = await this.modalController.create({
      component: DetalleProductoModalPage,
      componentProps: {
        producto: producto
      }
    });
    return await modal.present();
  }
  goToCart() {
    this.navCtrl.navigateForward('/cart');
  }
  
  irAHome(){
    this.router.navigate(['/home']);
  }

  
}
