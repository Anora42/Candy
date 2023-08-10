import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportemesPage } from './reportemes.page';

describe('ReportemesPage', () => {
  let component: ReportemesPage;
  let fixture: ComponentFixture<ReportemesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReportemesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
