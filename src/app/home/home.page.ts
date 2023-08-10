import { Component, OnInit } from '@angular/core';
import Swiper, { Navigation, Autoplay } from 'swiper';
import { ModalController, NavController} from '@ionic/angular';
import { NuevoProductoModalPage } from '../nuevo-producto-modal/nuevo-producto-modal.page';
import { EditarPrecioModalPage } from '../editar-precio-modal/editar-precio-modal.page';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { DetalleProductoModalPage } from '../detalle-producto-modal/detalle-producto-modal.page';
import { CarritoService } from '../carrito.service';
import { Router } from '@angular/router'
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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  categorias: string[] = [];
  categoriaSeleccionada: string = 'categorias';
  productosCollection!: AngularFirestoreCollection<Producto>;
  productos$!: Observable<Producto[]>;
  productos!: Producto[]; // Propiedad para almacenar los productos
  carrito: Producto[] = [];
  searchQuery: string = ''; // Declaración de searchQuery aquí
  cantidadTotalCarrito = 0; // Nueva propiedad para mantener el número total de productos en el carrito
  userId: string = '';

  imagenNoDisponible(event: any) {
    // Lógica para manejar el caso de imagen no disponible
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
  async openModal() {
    const modal = await this.modalController.create({
      component: NuevoProductoModalPage,
      cssClass: 'my-custom-modal'
    });
  
    return await modal.present();
  }
  async abrirModal() {
    const modal = await this.modalController.create({
      component: EditarPrecioModalPage,
      cssClass: 'my-custom-modal' 
    });
  
    return await modal.present();
}
  
  
ofertas(){
  this.router.navigate(['/ofertas']); 
}
 
  ngOnInit() {
    
    Swiper.use([Navigation]);
    this.initSwiper();
    this.productosCollection = this.firestore.collection<Producto>('productos');
    this.productos$ = this.productosCollection.valueChanges().pipe(
      map((productos: Producto[]) => {
        // Después de cargar los productos, inicializa cantidadCarrito con cantidad
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
      startWith([]), // Inicia el Observable con un arreglo vacío
      tap((productos: Producto[]) => {
        // Verificar que los productos se estén filtrando correctamente
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
        // Usuario autenticado, verificar su existencia en la colección "usuarios"
        const userId = user.uid;
        const userDocRef = this.firestore.collection('usuarios').doc(userId);
  
        // Verificar si el documento del usuario existe en la colección "usuarios"
        const userSnapshot = await userDocRef.get().toPromise();
        if (userSnapshot && userSnapshot.exists) {
          // Usuario autenticado y existe en la colección "usuarios"
          // Agregar el producto al carrito y realizar otras acciones necesarias
          console.log('Usuario autenticado y existe en la colección "usuarios"');
          // Resto del código...
        } else {
          // Usuario autenticado pero no existe en la colección "usuarios"
          // Mostrar el modal para iniciar sesión o registrarse
          const loginModal = await this.modalController.create({
            component: LoginModalPage,
            cssClass: 'my-custom-modal'
          });
          loginModal.present();
          return;
        }
      } else {
        // Usuario no autenticado, mostrar el modal para iniciar sesión o registrarse
        const loginModal = await this.modalController.create({
          component: LoginModalPage,
          cssClass: 'my-custom-modal'
        });
        loginModal.present();
        return; // Detener la función si el usuario no está autenticado
      }
  
      // Resto del código para agregar al carrito si el usuario está autenticado
      // ...
    } catch (error) {
      console.error('Error al verificar la autenticación o la existencia del usuario:', error);
      // Resto del código para manejar el error si ocurre algún problema en la verificación
      // ...
    }
  
  
  
    // Verificar si hay suficientes productos disponibles para agregar al carrito
    if (producto.cantidad >= cantidad) {
      producto.cantidad -= cantidad; // Restar la cantidad seleccionada del producto

      // Agregar el producto al carrito
      this.carritoService.agregarProducto(producto);

      // Actualizar el contador en el botón después de agregar un producto al carrito
      const contadorButton = document.getElementById(`contador-${producto.nombre}`);
      if (contadorButton) {
        contadorButton.innerHTML = producto.cantidad.toString();
      }

      // Show a toast message
      const toast = await this.toastController.create({
        message: 'Producto agregado al carrito',
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
    } else {
      // Show a toast message indicating that there are not enough products available
      const toast = await this.toastController.create({
        message: 'No hay suficientes productos disponibles',
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
    }
    
  }
  
 // Función para obtener el total de productos en el carrito
 getTotalProductosEnCarrito(): number {
  return this.carritoService.getCarrito().reduce((total, producto) => total + producto.cantidad, 0);
}

// Función para vaciar el carrito
vaciarCarrito() {
  this.carritoService.vaciarCarrito();
}

buscar() {
  const searchQueryLower = this.searchQuery.toLowerCase(); // Convertir la cadena de búsqueda a minúsculas

  if (searchQueryLower.trim() !== '') {
    this.productos$ = this.productosCollection.valueChanges().pipe(
      map((productos: Producto[]) =>
        productos.filter((producto: Producto) =>
          producto.nombre.toLowerCase().includes(searchQueryLower) // Convertir el nombre del producto a minúsculas antes de comparar
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
  
  private initSwiper() {
    setTimeout(() => {
      Swiper.use([Navigation, Autoplay]);
      const swiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        slidesPerView: 'auto',
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        autoplay: {
          delay: 3000, // Ajusta el intervalo de tiempo (en milisegundos) entre diapositivas
        },
      });
  
      swiper.on('init', () => {
        console.log('Swiper initialized');
      });
  
      swiper.on('slideChange', () => {
        console.log('Slide changed');
      });
  
      swiper.on('click', () => {
        console.log('Navigation button clicked');
      });
    }, 0);
    
}
ionViewDidEnter() {
  this.presentWelcomeModal();
}
async presentWelcomeModal() {
  const modal = await this.modalController.create({
    cssClass: 'welcome-modal', // Aquí puedes definir estilos para el modal
    component: WelcomeModalPage, // Cambia "WelcomeModalPage" por el nombre de tu página modal
  });
  return await modal.present();
}
}