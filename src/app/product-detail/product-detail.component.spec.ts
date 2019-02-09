import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailComponent } from './product-detail.component';
import { Product } from 'src/models/product.model';
import { BehaviorSubject } from 'rxjs';
import { MatCardModule, MatDialogModule, MatGridListModule, MAT_DIALOG_DATA } from '@angular/material';
import { BasketService } from 'src/services/basketService';

class MockBasketService {
  mockProduct: Product;
  mockProducts: Array<Product>;
  mockCount = 10;
  constructor() {
    this.mockProduct = new Product();
    this.mockProduct.id = "mockProduct.id";
    this.mockProduct.name = "name";
    this.mockProduct.description = "this.mockProduct.description";
    this.mockProduct.category = "category";
    this.mockProduct.count = 20;
    this.mockProduct.price = 10;
    this.mockProduct.imageUrl = "imageUrl";
    this.mockProduct.promotionId = "promotionId";
    this.mockProducts = [this.mockProduct];
  }
  getbasketProductsObservable(): BehaviorSubject<Array<Product>> {
    return new BehaviorSubject(this.mockProducts);
  }
  countOfProduct(product: Product): number {
    return this.mockCount
  }
  addOne(product: Product) { }
  removeOne(product: Product, withDelete: Boolean) { }
}

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  let mockBasketService: MockBasketService

  beforeEach(async(() => {
    mockBasketService = new MockBasketService()

    TestBed.configureTestingModule({
      imports: [ MatCardModule, MatDialogModule, MatGridListModule, MatDialogModule ],
      declarations: [ ProductDetailComponent ]
    })
    .overrideComponent(ProductDetailComponent, {
      set: {
        providers: [
          { provide: MAT_DIALOG_DATA, useValue: mockBasketService.mockProduct },
          // { provide: MdDialogRef, useValue: {} }
          { provide: BasketService, useValue: mockBasketService } ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.product).toEqual(mockBasketService.mockProduct);
  });

  it('Init calls', () => {
    let spyOnBasket = spyOn(mockBasketService, 'getbasketProductsObservable').and.callThrough();
    let spyOnBasketCount = spyOn(mockBasketService, 'countOfProduct').and.callThrough();

    fixture.detectChanges();
    
    expect(spyOnBasket.calls.any()).toBe(true);
    expect(spyOnBasketCount.calls.any()).toBe(true);
  });

  it('Init calls can Edit True', () => {
    mockBasketService.mockCount = 20;
    component.product.count = 30;

    fixture.detectChanges();
    
    expect(component.isCanAdd).toEqual(true);
    expect(component.isCanRemove).toEqual(true);
  });

  it('Init calls can Edit Flase', () => {
    mockBasketService.mockCount = 0;
    component.product.count = 0;

    fixture.detectChanges();
    
    expect(component.isCanAdd).toEqual(false);
    expect(component.isCanRemove).toEqual(false);
  });

  it('Add One product', () => {
    let spyBasketAdd = spyOn(mockBasketService, 'addOne').and.callFake((product: Product) => {
      expect(product).toEqual(mockBasketService.mockProduct);
    });
    fixture.detectChanges();
    expect(spyBasketAdd.calls.any()).toBe(false);
    component.addOneProduct();
    expect(spyBasketAdd.calls.any()).toBe(true);
  });

  it('Remove One product', () => {
    let spyBasketAdd = spyOn(mockBasketService, 'removeOne').and.callFake((product: Product, isDelete: boolean) => {
      expect(product).toEqual(mockBasketService.mockProduct);
      expect(isDelete).toEqual(true);
    });
    fixture.detectChanges();
    expect(spyBasketAdd.calls.any()).toBe(false);
    component.removeOneProduct();
    expect(spyBasketAdd.calls.any()).toBe(true);
  });

});
