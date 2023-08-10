import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportediaPage } from './reportedia.page';

describe('ReportediaPage', () => {
  let component: ReportediaPage;
  let fixture: ComponentFixture<ReportediaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReportediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
