/**
Task 1

Goal:	
     Verify the filtering of fetched products

Process description:	
     Create integration test for modeling filtering case. Such as:
     -	Filter by product category
     -	Filter by “filter text”
     -	Filter by products count range
     -	Filter by product price range

Completion Criteria:	
     Result of each filter should be in correct filter range and constraints.

*/

import { async, TestBed } from '@angular/core/testing';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { MainShopComponentComponent } from 'src/app/main-shop-component/main-shop-component.component';
import { FiltersComponent } from 'src/app/filters/filters.component';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Product } from 'src/models/product.model';
import { MatSidenavModule, MatToolbarModule, MatFormFieldModule, MatSelectModule, MatGridListModule, MatPaginatorModule, MatInputModule, MatSortModule, MatButtonModule, MatListModule, MatExpansionPanelActionRow } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from 'src/services/product.service';
import { ProductsComponent } from 'src/app/products/products.component';
import { Ng5SliderModule, LabelType } from 'ng5-slider';

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

    // valueChanges(events?: ChildEvent[]): Observable<T[]>;
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

@Component({
    selector: 'app-product',
    template: ''
  })
  class MockProductComponent {
    @Input() product: Product;
  }

describe('Integration Test 1 - Verify the filtering of fetched products', () => {
    let service: ProductsService;
    let mockFireDatabase: MockAngularFireDatabase; 

    let componentMainShop: MainShopComponentComponent;
    let componentFilter: FiltersComponent;
    let componentProducts: ProductsComponent;

    beforeEach(async(() => {
        mockFireDatabase = new MockAngularFireDatabase(); 

        TestBed.configureTestingModule({
            imports: [ MatSidenavModule, MatToolbarModule, MatButtonModule, MatListModule,
                BrowserAnimationsModule, MatFormFieldModule, FormsModule, MatSelectModule, MatGridListModule, 
                MatPaginatorModule, ReactiveFormsModule, MatInputModule, MatSortModule, Ng5SliderModule],
            providers: [ 
                ProductsService, ChangeDetectorRef,
                { provide: AngularFireDatabase, useValue: mockFireDatabase }
            ],
            declarations: [ MockProductComponent, MainShopComponentComponent, FiltersComponent, ProductsComponent]
        })
        .compileComponents();
    }));
  
    beforeEach(() => {
        let mainShopFixture = TestBed.createComponent(MainShopComponentComponent);
        componentMainShop = mainShopFixture.componentInstance;
        mainShopFixture.detectChanges();

        let filterFixture = TestBed.createComponent(FiltersComponent);
        componentFilter = filterFixture.componentInstance;
        filterFixture.detectChanges();

        let productsFixture = TestBed.createComponent(ProductsComponent);
        componentProducts = productsFixture.componentInstance;
        productsFixture.detectChanges();
    });
  
    it('should create', () => {
        service = TestBed.get(ProductsService);
        expect(service).toBeTruthy();
        expect(componentMainShop).toBeTruthy();
        expect(componentFilter).toBeTruthy();
        expect(componentProducts).toBeTruthy();
    });

    it('should be correct start values', () => {
        service = TestBed.get(ProductsService);
        
        expect(componentFilter.categories.get('Smartphones')).toEqual(true);
        expect(componentFilter.categories.get('Laptops')).toEqual(true);
        expect(componentFilter.categories.get('Monitors')).toEqual(true);
        expect(componentFilter.categories.get('Accessories')).toEqual(true);
        expect(componentFilter.maxCount).toEqual(40);
        expect(componentFilter.minCount).toEqual(20);
        expect(componentFilter.maxPrice).toEqual(50);
        expect(componentFilter.minPrice).toEqual(30);

        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);
        
        expect(service.getAllProductsObservable().value).toEqual(mockFireDatabase.mockProducts);
    });

    it('Filter by product category', () => {
        service = TestBed.get(ProductsService);
        expect(service).toBeTruthy();
        
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        componentFilter.changeCategory('Smartphones', false);
        expect(componentProducts.presentedProducts.length).toEqual(2);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct2, mockFireDatabase.mockProduct3]);

        componentFilter.changeCategory('Laptops', false);
        expect(componentProducts.presentedProducts.length).toEqual(1);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct3]);

        componentFilter.changeCategory('Monitors', false);
        expect(componentProducts.presentedProducts.length).toEqual(0);
        expect(componentProducts.presentedProducts).toEqual([]);

        componentFilter.changeCategory('Monitors', true);
        expect(componentProducts.presentedProducts.length).toEqual(1);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct3]);

        componentFilter.changeCategory('Smartphones', true);
        expect(componentProducts.presentedProducts.length).toEqual(2);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct1, mockFireDatabase.mockProduct3]);

        componentFilter.changeCategory('Laptops', true);
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        componentFilter.changeCategory('Accessories', false);
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        componentFilter.changeCategory('Accessories', true);
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);
    });

    it('Filter by “filter text”', () => {
        service = TestBed.get(ProductsService);
        expect(service).toBeTruthy();
        
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        componentProducts.applyFilter(".id2")
        expect(componentProducts.presentedProducts.length).toEqual(1);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct2]);
        
        componentProducts.applyFilter(".id1")
        expect(componentProducts.presentedProducts.length).toEqual(1);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct1]);

        componentProducts.applyFilter(".id3")
        expect(componentProducts.presentedProducts.length).toEqual(1);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct3]);

        componentProducts.applyFilter(".id")
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        componentProducts.applyFilter("")
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);
    });

    it('Filter by products count range', () => {
        service = TestBed.get(ProductsService);
        expect(service).toBeTruthy();
        
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        // set minimum level 20 30 40
        
        componentFilter.optionsCount.translate(20, LabelType.Low);
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        componentFilter.optionsCount.translate(25, LabelType.Low);
        expect(componentProducts.presentedProducts.length).toEqual(2);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct2, mockFireDatabase.mockProduct3]);

        componentFilter.optionsCount.translate(30, LabelType.Low);
        expect(componentProducts.presentedProducts.length).toEqual(2);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct2, mockFireDatabase.mockProduct3]);

        componentFilter.optionsCount.translate(35, LabelType.Low);
        expect(componentProducts.presentedProducts.length).toEqual(1);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct3]);

        componentFilter.optionsCount.translate(20, LabelType.Low);
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        componentFilter.optionsCount.translate(40, LabelType.High);
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        componentFilter.optionsCount.translate(39, LabelType.High);
        expect(componentProducts.presentedProducts.length).toEqual(2);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct1, mockFireDatabase.mockProduct2]);

        componentFilter.optionsCount.translate(30, LabelType.High);
        expect(componentProducts.presentedProducts.length).toEqual(2);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct1, mockFireDatabase.mockProduct2]);

        componentFilter.optionsCount.translate(29, LabelType.High);
        expect(componentProducts.presentedProducts.length).toEqual(1);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct1]);

        componentFilter.optionsCount.translate(20, LabelType.High);
        expect(componentProducts.presentedProducts.length).toEqual(1);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct1]);

    });

    it('Filter by product price range', () => {
        service = TestBed.get(ProductsService);
        expect(service).toBeTruthy();
        
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        // set minimum level 30 40 50
        
        componentFilter.optionsPrice.translate(30, LabelType.Low);
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        componentFilter.optionsPrice.translate(35, LabelType.Low);
        expect(componentProducts.presentedProducts.length).toEqual(2);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct2, mockFireDatabase.mockProduct3]);

        componentFilter.optionsPrice.translate(40, LabelType.Low);
        expect(componentProducts.presentedProducts.length).toEqual(2);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct2, mockFireDatabase.mockProduct3]);

        componentFilter.optionsPrice.translate(45, LabelType.Low);
        expect(componentProducts.presentedProducts.length).toEqual(1);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct3]);

        componentFilter.optionsPrice.translate(30, LabelType.Low);
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        componentFilter.optionsPrice.translate(50, LabelType.High);
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        componentFilter.optionsPrice.translate(49, LabelType.High);
        expect(componentProducts.presentedProducts.length).toEqual(2);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct1, mockFireDatabase.mockProduct2]);

        componentFilter.optionsPrice.translate(40, LabelType.High);
        expect(componentProducts.presentedProducts.length).toEqual(2);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct1, mockFireDatabase.mockProduct2]);

        componentFilter.optionsPrice.translate(39, LabelType.High);
        expect(componentProducts.presentedProducts.length).toEqual(1);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct1]);

        componentFilter.optionsPrice.translate(30, LabelType.High);
        expect(componentProducts.presentedProducts.length).toEqual(1);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct1]);

    });

  });