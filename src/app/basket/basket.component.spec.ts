import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketComponent } from './basket.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef, MatDialogConfig, MatSidenavModule, MatToolbarModule, MatTableModule } from '@angular/material';
import { Router } from '@angular/router';
import { BasketService } from 'src/services/basketService';
import { TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/core/src/render3';
import { Product } from 'src/models/product.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export class MockMatDialog {
  open() {  }
}

export class MockRouter {
  // navigate(commands: any[], extras?: NavigationExtras): Promise<boolean>;
  navigate() {

  }
}

class MockBasketService {
  mockProduct: Product;
  mockProducts: Array<Product>;
  mockPrice = 10;
  mockCount = 20;
  constructor() {
    this.mockProduct = new Product();
    this.mockProduct.id = "mockProduct.id";
    this.mockProduct.name = "name";
    this.mockProduct.description = "this.mockProduct.description";
    this.mockProduct.category = "category";
    this.mockProduct.count = 10;
    this.mockProduct.price = 10;
    this.mockProduct.imageUrl = "imageUrl";
    this.mockProduct.promotionId = "promotionId";
    this.mockProducts = [this.mockProduct];
  }
  getbasketProductsObservable(): BehaviorSubject<Array<Product>> {
    return new BehaviorSubject(this.mockProducts);
  }
  getProductsSumObservable(): BehaviorSubject<number> {
    return new BehaviorSubject(this.mockPrice);
  }
  getProductsCountObservable(): BehaviorSubject<number> {
    return new BehaviorSubject(this.mockCount);
  }
  getPriceForProduct(product: Product): number {  
    return 10;
  }
  addOneFromBasket(product: Product) {}
  removeOneFromBasket(product: Product) {}
  deleteFormBasket(product: Product) {}
}

describe('BasketComponent', () => {
  let component: BasketComponent;
  let fixture: ComponentFixture<BasketComponent>;
  let mockMatDialog: MockMatDialog;
  let mockRouter: MockRouter;
  let mockBasketService: MockBasketService;

    beforeEach(async(() => {
      mockMatDialog = new MockMatDialog();
      mockRouter = new MockRouter();
      mockBasketService = new MockBasketService();
    TestBed.configureTestingModule({
      imports: [ MatSidenavModule, MatToolbarModule, MatTableModule, BrowserAnimationsModule ],
      declarations: [ BasketComponent ]
    })
    .overrideComponent(BasketComponent, {
      set: {
        providers: [ BreakpointObserver, 
          { provide: MatDialog, useValue: mockMatDialog}, 
          { provide: Router, useValue: mockRouter}, 
          { provide: BasketService, useValue: mockBasketService} ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketComponent);
    component = fixture.componentInstance;
    fixture.debugElement.nativeElement.style.visibility = "hidden";
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('Check Products', () => {
    let spy = spyOn(mockBasketService, 'getbasketProductsObservable').and.callThrough();
    fixture.detectChanges();
    expect(spy.calls.any()).toBe(true);
    expect(component.dataSource.data).toEqual(mockBasketService.mockProducts)
  });

  it('Check Price', () => {
    let spy = spyOn(mockBasketService, 'getProductsSumObservable').and.callThrough();
    fixture.detectChanges();
    expect(spy.calls.any()).toBe(true);
    expect(component.totalSum).toEqual(mockBasketService.mockPrice)
  });

  it('Check Count', () => {
    let spy = spyOn(mockBasketService, 'getProductsCountObservable').and.callThrough();
    fixture.detectChanges();
    expect(spy.calls.any()).toBe(true);
    expect(component.totalCount).toEqual(mockBasketService.mockCount)
  });

  it('Add To Basket', () => {
    let spy = spyOn(mockBasketService, 'addOneFromBasket').and.callFake((product: Product) => {
      expect(product).toEqual(mockBasketService.mockProduct);
    });
    fixture.detectChanges();
    expect(spy.calls.any()).toBe(false);
    expect(component.totalSum).toEqual(mockBasketService.mockPrice)
    expect(component.totalCount).toEqual(mockBasketService.mockCount)

    component.addOneToBasket(mockBasketService.mockProduct);
    expect(spy.calls.any()).toBe(true);
    expect(component.totalSum).toEqual(mockBasketService.mockPrice)
    expect(component.totalCount).toEqual(mockBasketService.mockCount)
  });

  it('Remove From Basket', () => {
    let spy = spyOn(mockBasketService, 'removeOneFromBasket').and.callFake((product: Product) => {
      expect(product).toEqual(mockBasketService.mockProduct);
    });
    fixture.detectChanges();
    expect(spy.calls.any()).toBe(false);
    expect(component.totalSum).toEqual(mockBasketService.mockPrice)
    expect(component.totalCount).toEqual(mockBasketService.mockCount)

    component.removeOneFromBasket(mockBasketService.mockProduct);
    expect(spy.calls.any()).toBe(true);
    expect(component.totalSum).toEqual(mockBasketService.mockPrice)
    expect(component.totalCount).toEqual(mockBasketService.mockCount)
  });

  it('Delete From Basket', () => {
    let spy = spyOn(mockBasketService, 'deleteFormBasket').and.callFake((product: Product) => {
      expect(product).toEqual(mockBasketService.mockProduct);
    });
    fixture.detectChanges();
    expect(spy.calls.any()).toBe(false);
    expect(component.totalSum).toEqual(mockBasketService.mockPrice)
    expect(component.totalCount).toEqual(mockBasketService.mockCount)

    component.deleteFromBasket(mockBasketService.mockProduct);
    expect(spy.calls.any()).toBe(true);
    expect(component.totalSum).toEqual(mockBasketService.mockPrice)
    expect(component.totalCount).toEqual(mockBasketService.mockCount)
  });

  it('Navigate to shop', () => {
    let spy = spyOn(mockRouter, 'navigate').and.callFake((arrayPath: Array<string>) => {
      expect(arrayPath).toEqual(['']);
    });
    fixture.detectChanges();
    expect(spy.calls.any()).toBe(false);
    component.continueShopping();
    expect(spy.calls.any()).toBe(true);
  });

  it('Open Order without products', () => {
    mockBasketService.mockCount = 0;
    let spy = spyOn(mockMatDialog, 'open').and.callThrough();
    fixture.detectChanges();
    expect(spy.calls.any()).toBe(false);
    component.makeOrder()
    expect(spy.calls.any()).toBe(false);
  });

  it('Open Order with products', () => {
    let spy = spyOn(mockMatDialog, 'open').and.callThrough();
    fixture.detectChanges();
    expect(spy.calls.any()).toBe(false);
    component.makeOrder()
    expect(spy.calls.any()).toBe(true);
  });

  it('Check Table', () => {
    fixture.detectChanges();
    expect(component.displayedColumns).toEqual(['name', 'price', 'count', 'amount', 'add', 'remove', 'delete']);
    expect(component.displayedColumnsFooter).toEqual(['name', 'price', 'count', 'amount']);
    expect(component.dataSource).toBeTruthy();
  });

});
