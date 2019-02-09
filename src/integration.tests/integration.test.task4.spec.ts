/**
Task 4

Goal:
     Verify the basket managing from product list controller and detail card info

Process description:
     Create integration test for modeling case with Adding, Removing products from basket from product list and detail product info card. 
     Should be tested any available case for basket:
     
        -	Add first product to the empty basket
        -	Remove one product from basket with one product
        -	Add product multiple times
        -	Remove one product type from basket


Completion Criteria:
     Manipulation with product have to have correct influence on basket “Thumbnail” info and basket in generally. 
     Removing last type of product from basket should delete this product from basket. 
     Product count should be updated and presented in actual state in product list and product detail card.

*/

import { async, TestBed } from '@angular/core/testing';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { MainShopComponentComponent } from 'src/app/main-shop-component/main-shop-component.component';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Product } from 'src/models/product.model';
import { MatSidenavModule, MatToolbarModule, MatFormFieldModule, MatSelectModule, MatGridListModule, MatPaginatorModule, MatInputModule, MatSortModule, MatButtonModule, MatListModule, MatExpansionPanelActionRow, MatBadgeModule, MatCardModule, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from 'src/services/product.service';
import { ProductsComponent } from 'src/app/products/products.component';
import { Ng5SliderModule, LabelType } from 'ng5-slider';
import { AppComponent } from 'src/app/app.component';
import { BasketService } from 'src/services/basketService';
import { PromotionService } from 'src/services/promotion.service';
import { Promotion } from 'src/models/promotion.model';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductComponent } from 'src/app/product/product.component';
import { ProductDetailComponent } from 'src/app/product-detail/product-detail.component';

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

@Component({
    selector: 'app-filters',
    template: ''
})
class MockFiltersComponent {
}

describe('Integration Test 4 - Verify the basket managing from product list controller and detail card info', () => {
    let productsService: ProductsService;
    let basketService: BasketService;
    let mockFireDatabase: MockAngularFireDatabase;
    let mockPromotionService: MockPromotionService;

    let componentApp: AppComponent;
    let componentMainShop: MainShopComponentComponent;
    let componentProducts: ProductsComponent;
    let componentProduct: ProductComponent;
    let componentProductDetail: ProductDetailComponent;

    beforeEach(async(() => {
        mockFireDatabase = new MockAngularFireDatabase(); 
        mockPromotionService = new MockPromotionService();

        TestBed.configureTestingModule({
            imports: [ MatSidenavModule, MatToolbarModule, MatButtonModule, MatListModule,
                BrowserAnimationsModule, MatFormFieldModule, FormsModule, MatSelectModule, MatGridListModule, 
                MatPaginatorModule, ReactiveFormsModule, MatInputModule, MatSortModule, Ng5SliderModule,
                MatBadgeModule, RouterTestingModule, MatCardModule, MatDialogModule],
            providers: [ 
                ProductsService, BasketService, PromotionService, ChangeDetectorRef,
                { provide: AngularFireDatabase, useValue: mockFireDatabase },
                { provide: PromotionService, useValue: mockPromotionService },
                { provide: MAT_DIALOG_DATA, useValue: mockFireDatabase.mockProduct1 },
            ],
            declarations: [ ProductComponent, MockFiltersComponent, AppComponent, 
                MainShopComponentComponent, ProductsComponent, ProductDetailComponent]
        })
        .compileComponents();
    }));
  
    beforeEach(() => {
        let appFixture = TestBed.createComponent(AppComponent);
        componentApp = appFixture.componentInstance;
        componentApp.ngOnInit();
        appFixture.detectChanges;

        let mainShopFixture = TestBed.createComponent(MainShopComponentComponent);
        componentMainShop = mainShopFixture.componentInstance;
        mainShopFixture.detectChanges();

        let productsFixture = TestBed.createComponent(ProductsComponent);
        componentProducts = productsFixture.componentInstance;
        productsFixture.detectChanges();

        let productFixture = TestBed.createComponent(ProductComponent);
        componentProduct = productFixture.componentInstance;
        componentProduct.product = mockFireDatabase.mockProduct1;
        componentProduct.ngOnInit();

        let productDetailFixture = TestBed.createComponent(ProductDetailComponent);
        componentProductDetail = productDetailFixture.componentInstance;
        componentProductDetail.product = mockFireDatabase.mockProduct1;
        componentProductDetail.ngOnInit();
        
    });
  
    it('should create', () => {
        productsService = TestBed.get(ProductsService);
        expect(productsService).toBeTruthy();
        expect(componentMainShop).toBeTruthy();
        expect(componentApp).toBeTruthy();
        expect(componentProducts).toBeTruthy();
        expect(componentProduct).toBeTruthy();
        expect(componentProduct.product).toBeTruthy();
        expect(componentProductDetail).toBeTruthy();
        expect(componentProductDetail.product).toBeTruthy();
    });

    it('should be correct start values', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);
        
        expect(componentApp.productsSum).toEqual(0);
        expect(componentApp.productsCount).toEqual(0);
        
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        expect(componentProduct.product.count).toEqual(20);

        expect(componentProductDetail.product.count).toEqual(20);

        expect(productsService.getAllProductsObservable().value).toEqual(mockFireDatabase.mockProducts);
        expect(basketService.getBasketProducts()).toEqual([]);
    });

    it('Add first product to the empty basket', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);

        expect(productsService.getAllProductsObservable().value).toEqual(mockFireDatabase.mockProducts);
        expect(basketService.getBasketProducts()).toEqual([]);
        
        expect(componentProductDetail.isCanAdd).toEqual(true);
        componentProductDetail.addOneProduct()

        expect(componentProductDetail.product.count).toEqual(19);
        expect(componentApp.productsSum).toEqual(30);
        expect(componentApp.productsCount).toEqual(1);
        expect(basketService.getBasketProducts().length).toEqual(1);
        expect(basketService.getProductsSum()).toEqual(30);
    });

    it('Remove one product from basket with one product', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);

        expect(productsService.getAllProductsObservable().value).toEqual(mockFireDatabase.mockProducts);
        expect(basketService.getBasketProducts()).toEqual([]);
        
        expect(componentProductDetail.isCanAdd).toEqual(true);
        componentProductDetail.addOneProduct();
        
        expect(componentProductDetail.product.count).toEqual(19);
        expect(componentApp.productsSum).toEqual(30);
        expect(componentApp.productsCount).toEqual(1);
        expect(basketService.getBasketProducts().length).toEqual(1);
        expect(basketService.getProductsSum()).toEqual(30);

        componentProductDetail.removeOneProduct();

        expect(componentProductDetail.product.count).toEqual(20);
        expect(componentApp.productsSum).toEqual(0);
        expect(componentApp.productsCount).toEqual(0);
        expect(basketService.getBasketProducts().length).toEqual(0);
        expect(basketService.getProductsSum()).toEqual(0);
    });

    it('Add product multiple times', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);

        expect(productsService.getAllProductsObservable().value).toEqual(mockFireDatabase.mockProducts);
        expect(basketService.getBasketProducts()).toEqual([]);
        
        expect(componentProductDetail.isCanAdd).toEqual(true);
        componentProductDetail.addOneProduct();
        
        expect(componentProductDetail.product.count).toEqual(19);
        expect(componentApp.productsSum).toEqual(30);
        expect(componentApp.productsCount).toEqual(1);
        expect(basketService.getBasketProducts().length).toEqual(1);
        expect(basketService.getProductsSum()).toEqual(30);

        componentProductDetail.addOneProduct();
        componentProductDetail.addOneProduct();
        componentProductDetail.addOneProduct();
        componentProductDetail.addOneProduct();

        expect(componentProductDetail.product.count).toEqual(15);
        expect(componentApp.productsSum).toEqual(150);
        expect(componentApp.productsCount).toEqual(5);
        expect(basketService.getProductsCountObservable().value).toEqual(5);
        expect(basketService.getProductsSum()).toEqual(150);
    });

    it('Remove one product type from basket', () => {
        productsService = TestBed.get(ProductsService);
        basketService = TestBed.get(BasketService);

        expect(productsService.getAllProductsObservable().value).toEqual(mockFireDatabase.mockProducts);
        expect(basketService.getBasketProducts()).toEqual([]);
        
        expect(componentProductDetail.isCanAdd).toEqual(true);
        
        componentProductDetail.addOneProduct();
        componentProductDetail.addOneProduct();
        componentProductDetail.addOneProduct();
        componentProductDetail.addOneProduct();
        componentProductDetail.addOneProduct();

        expect(componentProductDetail.product.count).toEqual(15);
        expect(componentApp.productsSum).toEqual(150);
        expect(componentApp.productsCount).toEqual(5);
        expect(basketService.getProductsCountObservable().value).toEqual(5);
        expect(basketService.getProductsSum()).toEqual(150);

        componentProductDetail.removeOneProduct();

        expect(componentProductDetail.product.count).toEqual(16);
        expect(componentApp.productsSum).toEqual(120);
        expect(componentApp.productsCount).toEqual(4);
        expect(basketService.getProductsCountObservable().value).toEqual(4);
        expect(basketService.getProductsSum()).toEqual(120);
    });

  });
