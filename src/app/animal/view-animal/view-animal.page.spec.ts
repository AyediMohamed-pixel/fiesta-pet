import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewAnimalPage } from './view-animal.page';

describe('ViewAnimalPage', () => {
  let component: ViewAnimalPage;
  let fixture: ComponentFixture<ViewAnimalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAnimalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
