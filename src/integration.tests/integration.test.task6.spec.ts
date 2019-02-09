/**
Task 6

Goal:
     Verify the ordering products functionality from the Basket

Process description:
     Create integration test for ordering the products. 
     Simulated cases:
        -	Order empty basket
        -	Order basket with products
        -	Order with empty shipping information
        -	Order with complete shipping information and type

Completion Criteria:
     Creating of order should be protected from incorrect shipping info and empty basket. 
     After completing the order, products count should be updated, all product should be deleted from the basket.

*/

import { async, TestBed } from '@angular/core/testing';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/models/product.model';
import { MatSidenavModule, MatToolbarModule, MatFormFieldModule, MatSelectModule, MatGridListModule, MatPaginatorModule, MatInputModule, MatSortModule, MatButtonModule, MatListModule, MatExpansionPanelActionRow, MatBadgeModule, MatCardModule, MatDialogModule, MAT_DIALOG_DATA, MatDialog, MatTableModule, MatDialogRef, MatRadioModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ProductsService } from 'src/services/product.service';
import { Ng5SliderModule, LabelType } from 'ng5-slider';
import { AppComponent } from 'src/app/app.component';
import { BasketService } from 'src/services/basketService';
import { PromotionService } from 'src/services/promotion.service';
import { Promotion } from 'src/models/promotion.model';
import { RouterTestingModule } from '@angular/router/testing';
import { BasketComponent } from 'src/app/basket/basket.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { OrderService } from 'src/services/order.service';
import { Order } from 'src/models/order.model';
import { OrderFormComponent } from 'src/app/order-form/order-form.component';

class MockProductsAngularFireList {
    mockProduct1: Product;
    mockProduct2: Product;
    mockProduct3: Product;
    mockProducts: Product[];
    mockValueChanges: BehaviorSubject<Product[]>;   
    constructor(private promotion1: Product, private promotion2: Product, private promotion3: Product) {
        this.mockProduct1 = promotion1;
        this.mockProduct2 = promotion2;
        this.mockProduct3 = promotion3;
        this.mockProducts = [this.mockProduct1, this.mockProduct2, this.mockProduct3];
        this.mockValueChanges = new BehaviorSubject(this.mockProducts);
    }

    valueChanges(): BehaviorSubject<Product[]> {
        return this.mockValueChanges;
    }

    update(productId: string, product: Product) {
        expect(productId).toEqual(this.mockProduct1.id);
        this.mockProduct1.count = 19;
        expect(product).toEqual(this.mockProduct1);
    }
}

class MockOrdersAngularFireList {
    mockProduct: Product;
    mockOrder: Order;
    constructor(private product: Product) {
        this.mockProduct = product;

        this.mockOrder = new Order();
        this.mockOrder.id = "newOrderId"
        this.mockOrder.clientFirstName = 'clientFirstName';
        this.mockOrder.clientLastName = 'clientLastName';
        this.mockOrder.email = 'emailtest@mail.com';
        this.mockOrder.telephone = '90233432166';
        this.mockOrder.addres = 'addressdfs sfd dsf';
        this.mockOrder.city = 'City';
        this.mockOrder.state = 'state';
        this.mockOrder.postalCode = '12345';
        this.mockOrder.shipingType = 'shipingType';
        this.mockOrder.category = 'Unmanaged';
        this.mockOrder.products = [this.mockProduct];
        this.mockOrder.completness = [false];
        this.mockOrder.totalSum = 30;
    }

    update(newOrderId: string, newOrder: Order) {
        expect(newOrderId).toEqual('newOrderId');
        expect(newOrder).toEqual(this.mockOrder);
    }
}
class MockAngularFireDatabase {
    mockProductsAngularFireList: MockProductsAngularFireList;
    mockOrdersAngularFireList: MockOrdersAngularFireList;
    mockProduct1: Product;
    mockProduct2: Product;
    mockProduct3: Product;
    mockProducts: Product[];
    constructor() {
        this.mockProduct1 = new Product();
        this.mockProduct1.id = "mockProduct.id1";
        this.mockProduct1.name = "mockProduct.name";
        this.mockProduct1.description = "description";
        this.mockProduct1.category = "Smartphones";
        this.mockProduct1.count = 20;
        this.mockProduct1.price = 30;
        this.mockProduct1.imageUrl = "imageUrl";
        this.mockProduct1.promotionId = "ads"

        this.mockProduct2 = new Product();
        this.mockProduct2.id = "mockProduct.id2";
        this.mockProduct2.name = "mockProduct.name2";
        this.mockProduct2.description = "description2";
        this.mockProduct2.category = "Laptops";
        this.mockProduct2.count = 30;
        this.mockProduct2.price = 40;
        this.mockProduct2.imageUrl = "imageUrl2";
        this.mockProduct2.promotionId = "ads2";
        
        this.mockProduct3 = new Product();
        this.mockProduct3.id = "mockProduct.id3";
        this.mockProduct3.name = "mockProduct.name3";
        this.mockProduct3.description = "description3";
        this.mockProduct3.category = "Monitors";
        this.mockProduct3.count = 40;
        this.mockProduct3.price = 50;
        this.mockProduct3.imageUrl = "imageUrl3";
        this.mockProduct3.promotionId = "ads3";
        
        this.mockProducts = [this.mockProduct1, this.mockProduct2, this.mockProduct3];

        this.mockProductsAngularFireList = new MockProductsAngularFireList(this.mockProduct1, this.mockProduct2, this.mockProduct3);
        this.mockOrdersAngularFireList = new MockOrdersAngularFireList(this.mockProduct1)
    }

    list(pathtoCheck: string): any {
        if (pathtoCheck == "products") {
            expect(pathtoCheck).toEqual('products');
            return this.mockProductsAngularFireList;
        } else if (pathtoCheck == "orders/unmanaged") {
            expect(pathtoCheck).toEqual('orders/unmanaged');
            return this.mockOrdersAngularFireList;
        }
    }

    createPushId(): string {
        return 'newOrderId';
    }
}

class MockPromotionService {
    mockPromotionsObservable: BehaviorSubject<Array<Promotion>>
    mockPromotion1: Promotion
    mockPromotion2: Promotion
    mockPromotions: Promotion[]

    constructor() {
        this.mockPromotion1 = new Promotion();
        this.mockPromotion1.id = "promotionId1";
        this.mockPromotion1.discount = 20;
        this.mockPromotion1.untilTimestamp = 2147483648;

        this.mockPromotion2 = new Promotion();
        this.mockPromotion2.id = "mockPromotion2.id";
        this.mockPromotion2.discount = 10;
        this.mockPromotion2.untilTimestamp = 2147483648;

        this.mockPromotions = [this.mockPromotion1, this.mockPromotion2];
        this.mockPromotionsObservable = new BehaviorSubject(this.mockPromotions);
    }

    getPromotionsObservable(): BehaviorSubject<Array<Promotion>> {
        return this.mockPromotionsObservable;
    }
    getPromotionById(promotionId: string): Promotion | null {
        if (promotionId == 'promotionId1') {
            return this.mockPromotion1;
        } else if (promotionId == 'mockPromotion2.id') {
            return this.mockPromotion2;
        } else {
            return null;
        }
    }
}

export class MockRouter {
    navigate() { }
}

export class MockMatDialog {
    open() { }
}

class MockMatDialogRef {
    close() {}
}

describe('Integration Test 6 - Verify the ordering products functionality from the Basket', () => {
    let productsService: ProductsService;
    let basketService: BasketService;

    let mockFireDatabase: MockAngularFireDatabase;
    let mockPromotionService: MockPromotionService;
    let mockRouter: MockRouter;
    let mockMatDialog: MockMatDialog;
    let mockDialogRef: MockMatDialogRef

    let componentApp: AppComponent;
    let componentBasket: BasketComponent;
    let componentOrder: OrderFormComponent;

    beforeEach(async(() => {
        mockFireDatabase = new MockAngularFireDatabase(); 
        mockPromotionService = new MockPromotionService();
        mockRouter = new MockRouter();
        mockMatDialog = new MockMatDialog();
        mockDialogRef = new MockMatDialogRef();

        TestBed.configureTestingModule({
            imports: [ MatSidenavModule, MatToolbarModule, MatButtonModule, MatListModule, MatRadioModule,
                BrowserAnimationsModule, MatFormFieldModule, FormsModule, MatSelectModule, MatGridListModule, 
                MatPaginatorModule, ReactiveFormsModule, MatInputModule, MatSortModule, Ng5SliderModule,
                MatBadgeModule, RouterTestingModule, MatCardModule, MatDialogModule, MatTableModule],
            providers: [ 
                ProductsService, BasketService, PromotionService, BreakpointObserver, FormBuilder, OrderService,
                { provide: AngularFireDatabase, useValue: mockFireDatabase },
                { provide: PromotionService, useValue: mockPromotionService },
                { provide: Router, useValue: mockRouter }, 
                { provide: MatDialog, useValue: mockMatDialog }, 
                { provide: MAT_DIALOG_DATA, useValue: mockFireDatabase.mockProduct1 },
                { provide: MatDialogRef, useValue: mockDialogRef }
            ],
            declarations: [ AppComponent, BasketComponent, OrderFormComponent ]
        })
        .compileComponents();
    }));
  
    beforeEach(() => {
        let appFixture = TestBed.createComponent(AppComponent);
        componentApp = appFixture.componentInstance;
        componentApp.ngOnInit();
        appFixture.detectChanges;

        let basketFixture = TestBed.createComponent(BasketComponent);
        componentBasket = basketFixture.componentInstance;
        basketFixture.detectChanges();

        let orderFixture = TestBed.createComponent(OrderFormComponent);
        componentOrder = orderFixture.componentInstance;
        orderFixture.detectChanges();
    });
  
    it('should create', () => {
        productsService = TestBed.get(ProductsService);
        expect(productsService).toBeTruthy();
        expect(componentApp).toBeTruthy();
        expect(componentBasket).toBeTruthy();
        expect(componentOrder).toBeTruthy();
    });

    it('should be correct start values', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);
        
        expect(componentBasket.dataSource.data).toEqual(basketService.getBasketProducts());

        expect(productsService.getAllProductsObservable().value).toEqual(mockFireDatabase.mockProducts);
        expect(basketService.getBasketProducts()).toEqual([]);
    });

    it('Order empty basket', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);
        
        expect(componentBasket.dataSource.data).toEqual(basketService.getBasketProducts());
        expect(productsService.getAllProductsObservable().value).toEqual(mockFireDatabase.mockProducts);
        expect(basketService.getBasketProducts()).toEqual([]);

        let spyOnOpenOrder = spyOn(mockMatDialog, 'open').and.callThrough();

        expect(componentBasket.totalCount).toEqual(0);
        componentBasket.makeOrder();

        expect(spyOnOpenOrder.calls.any()).toBe(false);
    });
    
    it('Order basket with products', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);
        
        expect(componentBasket.dataSource.data).toEqual(basketService.getBasketProducts());
        expect(componentBasket.totalCount).toEqual(0);
        expect(productsService.getAllProductsObservable().value).toEqual(mockFireDatabase.mockProducts);
        expect(basketService.getBasketProducts()).toEqual([]);
        basketService.addOne(mockFireDatabase.mockProduct1);
        expect(componentBasket.totalCount).toEqual(1);

        let spyOnOpenOrder = spyOn(mockMatDialog, 'open').and.callThrough();

        componentBasket.makeOrder();

        expect(spyOnOpenOrder.calls.any()).toBe(true);
    });

    it('Order with empty shipping information', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);
        basketService.addOne(mockFireDatabase.mockProduct1);
        expect(componentBasket.totalCount).toEqual(1);

        let spyOnQueryUpdate = spyOn(mockFireDatabase.mockOrdersAngularFireList, 'update').and.callThrough();

        let spyOnOpenOrder = spyOn(mockMatDialog, 'open').and.callFake(() => {
            componentOrder.onSubmit();
            expect(spyOnQueryUpdate.calls.any()).toBe(false);
        });
        componentBasket.makeOrder();
        expect(spyOnOpenOrder.calls.any()).toBe(true);
    });

    it('Order with complete shipping information and type', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);
        basketService.addOne(mockFireDatabase.mockProduct1);
        expect(componentBasket.totalCount).toEqual(1);
        expect(basketService.getBasketProducts().length).toEqual(1);
        expect(basketService.getBasketProducts()[0].count).toEqual(1);

        let spyOnQueryUpdate = spyOn(mockFireDatabase.mockOrdersAngularFireList, 'update').and.callThrough();

        let spyOnOpenOrder = spyOn(mockMatDialog, 'open').and.callFake(() => {
            let mockOrder = mockFireDatabase.mockOrdersAngularFireList.mockOrder;
            mockOrder.products[0] = basketService.getBasketProducts()[0];
            expect(basketService.getBasketProducts()[0].count).toEqual(1);
            componentOrder.firstNameValue = mockOrder.clientFirstName;
            componentOrder.lastNameValue = mockOrder.clientLastName;
            componentOrder.emailValue = mockOrder.email;
            componentOrder.telephoneValue = mockOrder.telephone;
            componentOrder.addresValue = mockOrder.addres;
            componentOrder.cityValue = mockOrder.city;
            componentOrder.stateValue = mockOrder.state;
            componentOrder.postalCodeValue = mockOrder.postalCode;
            componentOrder.shipingTypeValue = mockOrder.shipingType;

            componentOrder.addressForm.controls['firstName'].setValue(mockOrder.clientFirstName);
            componentOrder.addressForm.controls['lastName'].setValue(mockOrder.clientLastName);
            componentOrder.addressForm.controls['email'].setValue(mockOrder.email);
            componentOrder.addressForm.controls['phone'].setValue(mockOrder.telephone);
            componentOrder.addressForm.controls['address'].setValue(mockOrder.addres);
            componentOrder.addressForm.controls['city'].setValue(mockOrder.city);
            componentOrder.addressForm.controls['state'].setValue(mockOrder.state);
            componentOrder.addressForm.controls['postalCode'].setValue(mockOrder.postalCode);
            componentOrder.addressForm.controls['shipping'].setValue(mockOrder.shipingType);

            expect(componentOrder.addressForm.controls['firstName'].errors).toBeNull();
            expect(componentOrder.addressForm.controls['lastName'].errors).toBeNull();
            expect(componentOrder.addressForm.controls['email'].errors).toBeNull();
            expect(componentOrder.addressForm.controls['phone'].errors).toBeNull();
            expect(componentOrder.addressForm.controls['address'].errors).toBeNull();
            expect(componentOrder.addressForm.controls['city'].errors).toBeNull();
            expect(componentOrder.addressForm.controls['state'].errors).toBeNull();
            expect(componentOrder.addressForm.controls['postalCode'].errors).toBeNull();
            expect(componentOrder.addressForm.controls['shipping'].errors).toBeNull();

            componentOrder.onSubmit();
            expect(spyOnQueryUpdate.calls.any()).toBe(true);
        });
        componentBasket.makeOrder();
        expect(spyOnOpenOrder.calls.any()).toBe(true);
    });

  });
