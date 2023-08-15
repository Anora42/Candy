import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoConfirmadoModalPage } from './pedido-confirmado-modal.page';

describe('PedidoConfirmadoModalPage', () => {
  let component: PedidoConfirmadoModalPage;
  let fixture: ComponentFixture<PedidoConfirmadoModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PedidoConfirmadoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
