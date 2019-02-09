/**
Task 5

Goal:
     Verify the basket managing from Basket

Process description:
     Create integration test for modeling case with Adding, Removing, 
     Deleting products from basket from Basket screen:
     Should be tested any available case for basket:
     
        -	Add additional product to the basket
        -	Remove all products (one type) from the basket
        -	Remove all products from the basket
        -	Delete one product from the basket
        -	Delete all products from the basket


Completion Criteria:
     Manipulation with product have to have correct influence on basket “Thumbnail” info and basket 
     in generally and products count in product list component and in product detail info card. 
     Removing last type of product from basket should not delete this product from basket. 
     Product count should be updated and presented in actual state in product list and product detail card.

*/

import { async, TestBed } from '@angular/core/testing';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/models/product.model';
import { MatSidenavModule, MatToolbarModule, MatFormFieldModule, MatSelectModule, MatGridListModule, MatPaginatorModule, MatInputModule, MatSortModule, MatButtonModule, MatListModule, MatExpansionPanelActionRow, MatBadgeModule, MatCardModule, MatDialogModule, MAT_DIALOG_DATA, MatDialog, MatTableModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from 'src/services/product.service';
import { Ng5SliderModule } from 'ng5-slider';
import { AppComponent } from 'src/app/app.component';
import { BasketService } from 'src/services/basketService';
import { PromotionService } from 'src/services/promotion.service';
import { Promotion } from 'src/models/promotion.model';
import { RouterTestingModule } from '@angular/router/testing';
import { BasketComponent } from 'src/app/basket/basket.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';

class MockAngularFireList {
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
}

class MockAngularFireDatabase {
    mockAngularFireList: MockAngularFireList;
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

        this.mockAngularFireList = new MockAngularFireList(this.mockProduct1, this.mockProduct2, this.mockProduct3);
    }
    list(pathtoCheck: string): MockAngularFireList {
        expect(pathtoCheck).toEqual('products');
        return this.mockAngularFireList;
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

describe('Integration Test 5 - Verify the basket managing from Basket', () => {
    let productsService: ProductsService;
    let basketService: BasketService;

    let mockFireDatabase: MockAngularFireDatabase;
    let mockPromotionService: MockPromotionService;
    let mockRouter: MockRouter;
    let mockMatDialog: MockMatDialog;

    let componentApp: AppComponent;
    let componentBasket: BasketComponent;

    beforeEach(async(() => {
        mockFireDatabase = new MockAngularFireDatabase(); 
        mockPromotionService = new MockPromotionService();
        mockRouter = new MockRouter();
        mockMatDialog = new MockMatDialog();

        TestBed.configureTestingModule({
            imports: [ MatSidenavModule, MatToolbarModule, MatButtonModule, MatListModule,
                BrowserAnimationsModule, MatFormFieldModule, FormsModule, MatSelectModule, MatGridListModule, 
                MatPaginatorModule, ReactiveFormsModule, MatInputModule, MatSortModule, Ng5SliderModule,
                MatBadgeModule, RouterTestingModule, MatCardModule, MatDialogModule, MatTableModule],
            providers: [ 
                ProductsService, BasketService, PromotionService, BreakpointObserver,
                { provide: AngularFireDatabase, useValue: mockFireDatabase },
                { provide: PromotionService, useValue: mockPromotionService },
                { provide: Router, useValue: mockRouter }, 
                { provide: MatDialog, useValue: mockMatDialog }, 
                { provide: MAT_DIALOG_DATA, useValue: mockFireDatabase.mockProduct1 },
            ],
            declarations: [ AppComponent, BasketComponent ]
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
        
    });
  
    it('should create', () => {
        productsService = TestBed.get(ProductsService);
        expect(productsService).toBeTruthy();
        expect(componentApp).toBeTruthy();
        expect(componentBasket).toBeTruthy();
    });

    it('should be correct start values', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);
        
        expect(componentApp.productsSum).toEqual(0);
        expect(componentApp.productsCount).toEqual(0);
        
        expect(componentBasket.dataSource.data).toEqual(basketService.getBasketProducts());

        expect(productsService.getAllProductsObservable().value).toEqual(mockFireDatabase.mockProducts);
        expect(basketService.getBasketProducts()).toEqual([]);
    });

    it('Add additional product to the basket', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);

        basketService.addOne(mockFireDatabase.mockProduct1);
        expect(basketService.getProductsCountObservable().value).toEqual(1);
        expect(basketService.getProductsSum()).toEqual(30);

        let products = componentBasket.dataSource.data
        expect(products.length).toEqual(1);
        expect(products[0].id).toEqual(mockFireDatabase.mockProduct1.id);
        
        componentBasket.addOneToBasket(products[0]);

        expect(componentBasket.totalCount).toEqual(2);
        expect(componentBasket.totalSum).toEqual(60);
        expect(componentApp.productsCount).toEqual(2);
        expect(componentApp.productsSum).toEqual(60);

        // ------------------------------------------
        // ------------------------------------------

        basketService.addOne(mockFireDatabase.mockProduct2);
        expect(basketService.getProductsCountObservable().value).toEqual(3);
        expect(basketService.getProductsSum()).toEqual(100);
        products = componentBasket.dataSource.data
        expect(products.length).toEqual(2);
        expect(products[1].id).toEqual(mockFireDatabase.mockProduct2.id);

        expect(componentBasket.totalCount).toEqual(3);
        expect(componentBasket.totalSum).toEqual(100);
        expect(componentApp.productsCount).toEqual(3);
        expect(componentApp.productsSum).toEqual(100);

        componentBasket.addOneToBasket(products[1]);

        expect(componentBasket.totalCount).toEqual(4);
        expect(componentBasket.totalSum).toEqual(140);
        expect(componentApp.productsCount).toEqual(4);
        expect(componentApp.productsSum).toEqual(140);

        componentBasket.addOneToBasket(products[1]);
        componentBasket.addOneToBasket(products[1]);
        componentBasket.addOneToBasket(products[1]);

        expect(componentBasket.totalCount).toEqual(7);
        expect(componentBasket.totalSum).toEqual(260);
        expect(componentBasket.dataSource.data.length).toEqual(2);
        expect(componentApp.productsCount).toEqual(7);
        expect(componentApp.productsSum).toEqual(260);
    });

    it('Remove all products (one type) from the basket', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);

        basketService.addOne(mockFireDatabase.mockProduct1);
        basketService.addOne(mockFireDatabase.mockProduct1);
        basketService.addOne(mockFireDatabase.mockProduct1);

        basketService.addOne(mockFireDatabase.mockProduct2);
        basketService.addOne(mockFireDatabase.mockProduct2);
        basketService.addOne(mockFireDatabase.mockProduct2);
        basketService.addOne(mockFireDatabase.mockProduct2);

        expect(basketService.getProductsCountObservable().value).toEqual(7);
        expect(basketService.getProductsSum()).toEqual(250);
        expect(componentApp.productsCount).toEqual(7);
        expect(componentApp.productsSum).toEqual(250);

        let products = componentBasket.dataSource.data
        expect(products.length).toEqual(2);
        expect(products[0].id).toEqual(mockFireDatabase.mockProduct1.id);
        expect(products[1].id).toEqual(mockFireDatabase.mockProduct2.id);
        
        componentBasket.removeOneFromBasket(products[1]);
        componentBasket.removeOneFromBasket(products[1]);

        expect(componentBasket.totalCount).toEqual(5);
        expect(componentBasket.totalSum).toEqual(170);
        expect(componentApp.productsCount).toEqual(5);
        expect(componentApp.productsSum).toEqual(170);

        componentBasket.removeOneFromBasket(products[1]);
        componentBasket.removeOneFromBasket(products[1]);
        expect(componentBasket.totalCount).toEqual(3);
        expect(componentBasket.totalSum).toEqual(90);
        expect(componentBasket.dataSource.data.length).toEqual(2);
        expect(componentBasket.dataSource.data[0].id).toEqual(mockFireDatabase.mockProduct1.id);
        expect(componentBasket.dataSource.data[1].id).toEqual(mockFireDatabase.mockProduct2.id);
        expect(componentBasket.dataSource.data[1].count).toEqual(0);
        expect(componentApp.productsCount).toEqual(3);
        expect(componentApp.productsSum).toEqual(90);
    });

    it('Remove all products from the basket', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);

        basketService.addOne(mockFireDatabase.mockProduct1);
        basketService.addOne(mockFireDatabase.mockProduct1);
        basketService.addOne(mockFireDatabase.mockProduct1);

        basketService.addOne(mockFireDatabase.mockProduct2);
        basketService.addOne(mockFireDatabase.mockProduct2);
        basketService.addOne(mockFireDatabase.mockProduct2);
        basketService.addOne(mockFireDatabase.mockProduct2);

        expect(basketService.getProductsCountObservable().value).toEqual(7);
        expect(basketService.getProductsSum()).toEqual(250);
        expect(componentApp.productsCount).toEqual(7);
        expect(componentApp.productsSum).toEqual(250);

        let products = componentBasket.dataSource.data
        expect(products.length).toEqual(2);
        expect(products[0].id).toEqual(mockFireDatabase.mockProduct1.id);
        expect(products[1].id).toEqual(mockFireDatabase.mockProduct2.id);
        
        componentBasket.removeOneFromBasket(products[1]);
        componentBasket.removeOneFromBasket(products[1]);
        componentBasket.removeOneFromBasket(products[1]);
        componentBasket.removeOneFromBasket(products[1]);

        expect(componentBasket.totalCount).toEqual(3);
        expect(componentBasket.totalSum).toEqual(90);
        expect(componentBasket.dataSource.data.length).toEqual(2);
        expect(componentBasket.dataSource.data[0].id).toEqual(mockFireDatabase.mockProduct1.id);
        expect(componentBasket.dataSource.data[1].id).toEqual(mockFireDatabase.mockProduct2.id);
        expect(componentBasket.dataSource.data[1].count).toEqual(0);
        expect(componentApp.productsCount).toEqual(3);
        expect(componentApp.productsSum).toEqual(90);

        componentBasket.removeOneFromBasket(products[0]);
        componentBasket.removeOneFromBasket(products[0]);
        componentBasket.removeOneFromBasket(products[0]);
        
        expect(componentBasket.totalCount).toEqual(0);
        expect(componentBasket.totalSum).toEqual(0);
        expect(componentBasket.dataSource.data.length).toEqual(2);
        expect(componentBasket.dataSource.data[0].id).toEqual(mockFireDatabase.mockProduct1.id);
        expect(componentBasket.dataSource.data[0].count).toEqual(0);
        expect(componentBasket.dataSource.data[1].id).toEqual(mockFireDatabase.mockProduct2.id);
        expect(componentBasket.dataSource.data[1].count).toEqual(0);
        expect(componentApp.productsCount).toEqual(0);
        expect(componentApp.productsSum).toEqual(0);
    });


    it('Delete one product from the basket', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);

        basketService.addOne(mockFireDatabase.mockProduct1);
        basketService.addOne(mockFireDatabase.mockProduct1);
        basketService.addOne(mockFireDatabase.mockProduct1);

        basketService.addOne(mockFireDatabase.mockProduct2);
        basketService.addOne(mockFireDatabase.mockProduct2);
        basketService.addOne(mockFireDatabase.mockProduct2);
        basketService.addOne(mockFireDatabase.mockProduct2);

        expect(basketService.getProductsCountObservable().value).toEqual(7);
        expect(basketService.getProductsSum()).toEqual(250);
        expect(componentApp.productsCount).toEqual(7);
        expect(componentApp.productsSum).toEqual(250);

        let products = componentBasket.dataSource.data
        expect(products.length).toEqual(2);
        expect(products[0].id).toEqual(mockFireDatabase.mockProduct1.id);
        expect(products[1].id).toEqual(mockFireDatabase.mockProduct2.id);
        
        componentBasket.deleteFromBasket(products[1]);

        expect(componentBasket.totalCount).toEqual(3);
        expect(componentBasket.totalSum).toEqual(90);
        expect(componentBasket.dataSource.data.length).toEqual(1);
        expect(componentBasket.dataSource.data[0].id).toEqual(mockFireDatabase.mockProduct1.id);
        expect(componentBasket.dataSource.data[0].count).toEqual(3);
        expect(componentApp.productsCount).toEqual(3);
        expect(componentApp.productsSum).toEqual(90);
    });

    it('Delete all products from the basket', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);

        basketService.addOne(mockFireDatabase.mockProduct1);
        basketService.addOne(mockFireDatabase.mockProduct1);
        basketService.addOne(mockFireDatabase.mockProduct1);

        basketService.addOne(mockFireDatabase.mockProduct2);
        basketService.addOne(mockFireDatabase.mockProduct2);
        basketService.addOne(mockFireDatabase.mockProduct2);
        basketService.addOne(mockFireDatabase.mockProduct2);

        expect(basketService.getProductsCountObservable().value).toEqual(7);
        expect(basketService.getProductsSum()).toEqual(250);
        expect(componentApp.productsCount).toEqual(7);
        expect(componentApp.productsSum).toEqual(250);

        let products = componentBasket.dataSource.data
        expect(products.length).toEqual(2);
        expect(products[0].id).toEqual(mockFireDatabase.mockProduct1.id);
        expect(products[1].id).toEqual(mockFireDatabase.mockProduct2.id);
        
        componentBasket.deleteFromBasket(products[0]);
        componentBasket.deleteFromBasket(products[1]);

        expect(componentBasket.totalCount).toEqual(0);
        expect(componentBasket.totalSum).toEqual(0);
        expect(componentBasket.dataSource.data.length).toEqual(0);
        expect(componentApp.productsCount).toEqual(0);
        expect(componentApp.productsSum).toEqual(0);
    });

  });
