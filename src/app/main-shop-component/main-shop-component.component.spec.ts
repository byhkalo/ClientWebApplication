import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainShopComponentComponent } from './main-shop-component.component';

describe('MainShopComponentComponent', () => {
  let component: MainShopComponentComponent;
  let fixture: ComponentFixture<MainShopComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainShopComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainShopComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
