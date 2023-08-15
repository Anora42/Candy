import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPrecioModalPage } from './editar-precio-modal.page';

describe('EditarPrecioModalPage', () => {
  let component: EditarPrecioModalPage;
  let fixture: ComponentFixture<EditarPrecioModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditarPrecioModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
