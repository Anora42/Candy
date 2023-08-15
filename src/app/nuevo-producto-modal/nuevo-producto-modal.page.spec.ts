import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoProductoModalPage } from './nuevo-producto-modal.page';

describe('NuevoProductoModalPage', () => {
  let component: NuevoProductoModalPage;
  let fixture: ComponentFixture<NuevoProductoModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NuevoProductoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
