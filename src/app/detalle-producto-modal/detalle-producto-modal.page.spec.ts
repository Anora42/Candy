import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleProductoModalPage } from './detalle-producto-modal.page';

describe('DetalleProductoModalPage', () => {
  let component: DetalleProductoModalPage;
  let fixture: ComponentFixture<DetalleProductoModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetalleProductoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
