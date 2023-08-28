import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';


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
}

@Component({
  selector: 'app-editar-precio-modal',
  templateUrl: './editar-precio-modal.page.html',
  styleUrls: ['./editar-precio-modal.page.scss'],
})
export class EditarPrecioModalPage implements OnInit {
  producto!: Producto;
  nuevoNombre: string = '';
  nuevoPrecio: number = 0;
  nuevoPrecioPorMayor: number = 0;
  nuevaDescripcion: string = '';
  nuevaCategoria: string = '';
  nuevaImagen: string = '';
  nuevaCantidad: number =0;

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    if (this.producto) {
      this.nuevoNombre = this.producto.nombre;
      this.nuevoPrecio = this.producto.precio;
      this.nuevoPrecioPorMayor = this.producto.precioPorMayor;
      this.nuevaDescripcion = this.producto.descripcion;
      this.nuevaCategoria = this.producto.categoria;
      this.nuevaImagen = this.producto.imagen;
      this.nuevaCantidad = this.producto.cantidad;
    }
  }

  guardarCambios() {
    // Realiza la consulta para buscar el documento por el nombre en la colección productos
    const productosQuery = this.firestore.collection('productos', ref => ref.where('nombre', '==', this.producto.nombre));
  
    // Ejecuta la consulta y obtén el primer resultado
    productosQuery.get().subscribe(snapshot => {
      if (snapshot.docs.length > 0) {
        const doc = snapshot.docs[0];
        const docId = doc.id;
  
        // actualiza el documento con los nuevos valores en la colección productos
        this.firestore.collection('productos').doc(docId).update({
          nombre: this.nuevoNombre,
          precio: this.nuevoPrecio,
          precioPorMayor: this.nuevoPrecioPorMayor,
          descripcion: this.nuevaDescripcion,
          categoria: this.nuevaCategoria,
          imagen: this.nuevaImagen,
          cantidad: this.nuevaCantidad
          // actualiza los productos
        }).then(async () => {
          // cierra el modal
          this.modalController.dismiss();
  
          // Muestra un mensaje de exito
          const toast = await this.toastController.create({
            message: 'Cambios guardados exitosamente',
            duration: 2000,
            position: 'bottom',
            color: 'success'
          });
          toast.present();
        }).catch(error => {
          console.error('Error al guardar cambios en la colección "productos":', error);
          // Muestra un mensaje de error si la actualizacion falla
        });
      } else {
        console.error('No se encontró ningún documento con el nombre proporcionado en la colección "productos"');
      }
    });
    // Realiza la consulta para buscar el documento por el nombre en la colección ofertas
    const ofertasQuery = this.firestore.collection('ofertas', ref => ref.where('nombre', '==', this.producto.nombre));
  
    // Ejecuta la consulta y obtén el primer resultado
    ofertasQuery.get().subscribe(snapshot => {
      if (snapshot.docs.length > 0) {
        const doc = snapshot.docs[0];
        const docId = doc.id;
  
        // Actualiza el documento con los nuevos valores en la colección ofertas
        this.firestore.collection('ofertas').doc(docId).update({
          nombre: this.nuevoNombre,
          precio: this.nuevoPrecio,
          precioPorMayor: this.nuevoPrecioPorMayor,
          descripcion: this.nuevaDescripcion,
          categoria: this.nuevaCategoria,
          imagen: this.nuevaImagen,
          cantidad: this.nuevaCantidad
          // Actualiza campos
        }).then(async () => {
          // Cierra el modal
          this.modalController.dismiss();
  
          // Muestra un mensaje de exito
          const toast = await this.toastController.create({
            message: 'Cambios de oferta guardados exitosamente',
            duration: 2000,
            position: 'bottom',
            color: 'success'
          });
          toast.present();
        }).catch(error => {
          console.error('Error al guardar cambios en la colección "ofertas":', error);
          // Muestra un mensaje de error si la actualizacion falla
        });
      } else {
        console.error('No se encontró ningún documento con el nombre proporcionado en la colección "ofertas"');
      }
    });
  }
  
  cancelarEdicion() {
    this.modalController.dismiss({ success: false });
  }
}








