import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMethodo } from './card-methodo';

describe('CardMethodo', () => {
  let component: CardMethodo;
  let fixture: ComponentFixture<CardMethodo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMethodo],
    }).compileComponents();

    fixture = TestBed.createComponent(CardMethodo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
