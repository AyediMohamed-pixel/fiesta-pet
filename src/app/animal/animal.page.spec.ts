import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimalPage } from './animal.page';

describe('AnimalPage', () => {
  let component: AnimalPage;
  let fixture: ComponentFixture<AnimalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
