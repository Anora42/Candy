import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesemanaPage } from './reportesemana.page';

describe('ReportesemanaPage', () => {
  let component: ReportesemanaPage;
  let fixture: ComponentFixture<ReportesemanaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReportesemanaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
