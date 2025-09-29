import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAnimalPage } from './add-animal.page';

describe('AddAnimalPage', () => {
  let component: AddAnimalPage;
  let fixture: ComponentFixture<AddAnimalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnimalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
