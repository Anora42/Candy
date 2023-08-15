import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  constructor(private firestore: AngularFirestore) {}

  getAllOrders(): Observable<Order[]> {
    return this.firestore.collection<Order>('pedidos').valueChanges();
  }
}