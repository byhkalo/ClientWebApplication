import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponent } from './product.component';
import { MatDialog, MatButtonModule, MatCardModule } from '@angular/material';
import { ProductsService } from 'src/services/product.service';
import { BasketService } from 'src/services/basketService';
import { PromotionService } from 'src/services/promotion.service';
import { Product } from 'src/models/product.model';
import { BehaviorSubject } from 'rxjs';
import { Promotion } from 'src/models/promotion.model';
import { TimeState } from 'src/models/time.state.model';
import { ProductDetailComponent } from '../product-detail/product-detail.component';

//     public dialog: MatDialog, 
//     private productService: ProductsService,
//     private basketService: BasketService, 
//     private promotionService: PromotionService

class MockMatDialog {
  open() {}
}
class MockProductsService {
  mockProducts: Array<Product>
  constructor(private mockProductsArray: Array<Product>) {
    this.mockProducts = mockProductsArray
  }

  getAllProductsObservable(): BehaviorSubject<Product[]> {
    return new BehaviorSubject(this.mockProducts);
  }
}
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

class MockPromotionService {
  mockPromotion: Promotion
  mockTimeState: TimeState
  mockObservablePromotion: BehaviorSubject<TimeState>
  constructor() {
    this.mockPromotion = new Promotion();
    this.mockPromotion.id = "promotionId"
    this.mockPromotion.discount = 20;

    this.mockPromotion.untilTimestamp = 2147483648;
    this.mockTimeState = new TimeState();
    this.mockTimeState.total = 20000;
    this.mockTimeState.days = 20;
    this.mockTimeState.hours = 20;
    this.mockTimeState.minutes = 20;
    this.mockTimeState.seconds = 20;
    this.mockTimeState.isActive = true;
    this.mockTimeState.promotion = this.mockPromotion;
    this.mockObservablePromotion = new BehaviorSubject(this.mockTimeState);
  }

  
  getPromotionsObservable(): BehaviorSubject<Array<Promotion>> {
    return new BehaviorSubject([]);
  }
  getPromotionById(promotionId: string): Promotion | null {
    return this.mockPromotion;
  }
  getObservablePromotion(promotionId: string): BehaviorSubject<TimeState> {
    return this.mockObservablePromotion;
}
}

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  let mockMatDialog: MockMatDialog;
  let mockProductsService: MockProductsService;
  let mockBasketService: MockBasketService;
  let mockPromotionService: MockPromotionService;

  beforeEach(async(() => {
    mockMatDialog = new MockMatDialog();
    mockBasketService = new MockBasketService();
    mockProductsService = new MockProductsService(mockBasketService.mockProducts);
    mockPromotionService = new MockPromotionService();

    TestBed.configureTestingModule({
      imports: [ MatButtonModule, MatCardModule ],
      declarations: [ ProductComponent ]
    })
    .overrideComponent(ProductComponent, {
      set: {
        providers: [
          { provide: MatDialog, useValue: mockMatDialog}, 
          { provide: ProductsService, useValue: mockProductsService },
          { provide: BasketService, useValue: mockBasketService},
          { provide: PromotionService, useValue: mockPromotionService} ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    component.product = mockBasketService.mockProduct
  });

  it('should create', () => {
    let spyBasket = spyOn(mockBasketService, 'getbasketProductsObservable').and.callThrough();
    let spyProductService = spyOn(mockProductsService, 'getAllProductsObservable').and.callThrough();
    let spyPromotionService = spyOn(mockPromotionService, 'getPromotionsObservable').and.callThrough();
    let spyCheckPromotion = spyOn(component, 'checkPromotion').and.callThrough();
    fixture.detectChanges();

    expect(spyBasket.calls.any()).toBe(true);
    expect(spyProductService.calls.any()).toBe(true);
    expect(spyPromotionService.calls.any()).toBe(true);
    expect(spyCheckPromotion.calls.any()).toBe(true);

    expect(component).toBeTruthy();
  });

  it('Create with null product', () => {
    let spyBasket = spyOn(mockBasketService, 'getbasketProductsObservable').and.callThrough();
    let spyProductService = spyOn(mockProductsService, 'getAllProductsObservable').and.callThrough();
    let spyPromotionService = spyOn(mockPromotionService, 'getPromotionsObservable').and.callThrough();
    let spyCheckPromotion = spyOn(component, 'checkPromotion').and.callThrough();
    mockProductsService.mockProducts = [];
    fixture.detectChanges();

    expect(spyBasket.calls.any()).toBe(true);
    expect(spyProductService.calls.any()).toBe(true);
    expect(spyPromotionService.calls.any()).toBe(true);
    expect(spyCheckPromotion.calls.any()).toBe(true);

    expect(component).toBeTruthy();
  });

  it('Can manage basket', () => {
    mockBasketService.mockProduct.count = 20;
    mockBasketService.mockCount = 30;
    fixture.detectChanges();
    expect(component.isCanRemove).toEqual(true);
    expect(component.isCanAdd).toEqual(true);
  });

  it('Can`t manage basket', () => {
    mockBasketService.mockProduct.count = 0;
    mockBasketService.mockCount = 0;
    fixture.detectChanges();
    expect(component.isCanRemove).toEqual(false);
    expect(component.isCanAdd).toEqual(false);
  });

  it('Set Promotion All true', () => {
    let spyGetPromotionByID = spyOn(mockPromotionService, 'getPromotionById').and.callThrough();
    let spyGetObserveblePromotion = spyOn(mockPromotionService, 'getObservablePromotion').and.callThrough();
    
    fixture.detectChanges();
    expect(spyGetPromotionByID.calls.any()).toBe(true);
    expect(component.promotion).toBeTruthy();
    expect(spyGetObserveblePromotion.calls.any()).toBe(true);
    expect(component.isExistPromotion).toEqual(true);
    
    expect(component.newPromotionPrice).toEqual(8);
    expect(component.promotionTimeText).toEqual('day(s): 20  20:20:20');
  });

  it('Set Promotion Promotion ID nil', () => {
    let spyGetPromotionByID = spyOn(mockPromotionService, 'getPromotionById').and.callThrough();
    let spyGetObserveblePromotion = spyOn(mockPromotionService, 'getObservablePromotion').and.callThrough();
    component.product.promotionId = null;

    fixture.detectChanges();

    expect(component.product.promotionId).toBeNull();
    expect(spyGetPromotionByID.calls.any()).toBe(false);
    expect(component.promotion).toBeNull();
    expect(spyGetObserveblePromotion.calls.any()).toBe(false);
    expect(component.isExistPromotion).toEqual(false);
    expect(component.newPromotionPrice).toEqual(0);
    expect(component.promotionTimeText).toEqual('');
  });

  it('Set Promotion change in observer', () => {
    let spyGetPromotionByID = spyOn(mockPromotionService, 'getPromotionById').and.callThrough();
    let spyGetObserveblePromotion = spyOn(mockPromotionService, 'getObservablePromotion').and.callThrough();
    
    fixture.detectChanges();
    expect(spyGetPromotionByID.calls.any()).toBe(true);
    expect(component.promotion).toBeTruthy();
    expect(spyGetObserveblePromotion.calls.any()).toBe(true);
    expect(component.isExistPromotion).toEqual(true);
    
    expect(component.newPromotionPrice).toEqual(8);
    expect(component.promotionTimeText).toEqual('day(s): 20  20:20:20');

    component.promotion = null;
    mockPromotionService.mockTimeState.isActive = false;
    mockPromotionService.mockObservablePromotion.next(mockPromotionService.mockTimeState);
    expect(component.isExistPromotion).toEqual(false);
    expect(component.promotionTimeText).toEqual('');
  });

  it('Time Branches', () => {
    fixture.detectChanges();
    
    mockPromotionService.mockObservablePromotion.next(mockPromotionService.mockTimeState);
    expect(component.promotionTimeText).toEqual('day(s): 20  20:20:20');

    mockPromotionService.mockTimeState.days = 0;
    mockPromotionService.mockObservablePromotion.next(mockPromotionService.mockTimeState);
    expect(component.promotionTimeText).toEqual(' 20:20:20');
    
    mockPromotionService.mockTimeState.hours = 0;
    mockPromotionService.mockObservablePromotion.next(mockPromotionService.mockTimeState);
    expect(component.promotionTimeText).toEqual('20:20');

    mockPromotionService.mockTimeState.minutes = 0;
    mockPromotionService.mockObservablePromotion.next(mockPromotionService.mockTimeState);
    expect(component.promotionTimeText).toEqual('20');

    mockPromotionService.mockTimeState.seconds = 0;
    mockPromotionService.mockObservablePromotion.next(mockPromotionService.mockTimeState);
    expect(component.promotionTimeText).toEqual('');
  });

  it('Add One Product', () => {
    let event = new Event('click');
    let spyEvent = spyOn(event, 'stopPropagation').and.callFake(() => {});
    let spyBasket = spyOn(mockBasketService, 'addOne').and.callFake((product: Product) => {
      expect(product).toEqual(mockBasketService.mockProduct);
    });
    
    fixture.detectChanges();
    expect(spyEvent.calls.any()).toBe(false);
    expect(spyBasket.calls.any()).toBe(false);

    component.addOneProduct(event);

    expect(spyEvent.calls.any()).toBe(true);
    expect(spyBasket.calls.any()).toBe(true);
  });

  it('Remove One Product', () => {
    let event = new Event('click');
    let spyEvent = spyOn(event, 'stopPropagation').and.callFake(() => {});
    let spyBasket = spyOn(mockBasketService, 'removeOne').and.callFake((product: Product, isDelete: boolean) => {
      expect(product).toEqual(mockBasketService.mockProduct);
      expect(isDelete).toEqual(true);
    });
    
    fixture.detectChanges();
    expect(spyEvent.calls.any()).toBe(false);
    expect(spyBasket.calls.any()).toBe(false);

    component.removeOneProduct(event);

    expect(spyEvent.calls.any()).toBe(true);
    expect(spyBasket.calls.any()).toBe(true);
  });

  it('Open Product Detail', () => {
    let event = new Event('click');
    let spyBasket = spyOn(mockMatDialog, 'open').and
    .callFake((componentName, detail: { width: string, height: string, data: Product} ) => {
      expect(detail.data).toEqual(mockBasketService.mockProduct);
      expect(detail.width).toEqual('1000px');
      expect(detail.height).toEqual('650px');
      expect(componentName).toEqual(ProductDetailComponent);
    });
    
    fixture.detectChanges();
    
    expect(spyBasket.calls.any()).toBe(false);
    component.openProductDetail(event);

    
    expect(spyBasket.calls.any()).toBe(true);
  });

});
