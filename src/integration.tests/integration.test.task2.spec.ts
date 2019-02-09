/**
Task 2

Goal:
     Verify the filtering with sorting

Process description:
     Create integration test for modeling filtering with sorting case. 
     Should modulate all filter case with changed sorting type:
        -	Price low to top
        -	Price top to low
        -	Name ascending
        -	Name descending

Completion Criteria:
     Result of each filter with each sorting type should be in correct range and order of products. 

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
import { Ng5SliderModule } from 'ng5-slider';

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

@Component({
    selector: 'app-product',
    template: ''
  })
  class MockProductComponent {
    @Input() product: Product;
  }

describe('Integration Test 2 - Verify the filtering with sorting', () => {
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

    it('Price low to top', () => {
        service = TestBed.get(ProductsService);
        expect(service).toBeTruthy();
        
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        let event = { value: "Price Low to top" }
        componentProducts.sortingChanged(event)
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

    });

    it('Price Top to Low', () => {
        service = TestBed.get(ProductsService);
        expect(service).toBeTruthy();
        
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        let event = { value: "Price Top to Low" }
        componentProducts.sortingChanged(event)
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct3, mockFireDatabase.mockProduct2, mockFireDatabase.mockProduct1]);
    });

    it('Name Ascending', () => {
        service = TestBed.get(ProductsService);
        expect(service).toBeTruthy();
        
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);


        let event = { value: "Name Ascending" }
        componentProducts.sortingChanged(event)
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

    });

    it('Name Descending', () => {
        service = TestBed.get(ProductsService);
        expect(service).toBeTruthy();
        
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual(mockFireDatabase.mockProducts);

        let event = { value: "Name Descending" }
        componentProducts.sortingChanged(event)
        expect(componentProducts.presentedProducts.length).toEqual(3);
        expect(componentProducts.presentedProducts).toEqual([mockFireDatabase.mockProduct3, mockFireDatabase.mockProduct2, mockFireDatabase.mockProduct1]);
    });

  });
