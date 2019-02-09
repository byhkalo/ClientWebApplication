import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderService } from "./order.service";
import { AngularFireDatabase, PathReference, QueryFn, AngularFireList, AngularFireDatabaseModule } from '@angular/fire/database';
import { BasketService } from './basketService';
import { Order } from 'src/models/order.model';
import { DatabaseQuery } from '@angular/fire/database/interfaces';
import { Product } from 'src/models/product.model';
import { ProductsService } from './product.service';
import { BehaviorSubject } from 'rxjs';
import { SortType } from 'src/models/sortType';
import { MockResourceLoader } from '@angular/compiler/testing';

class MockAngularFireList {
    mockProduct1: Product;
    mockProduct2: Product;
    mockProducts: Product[];
    mockValueChanges: BehaviorSubject<Product[]>;

    constructor(private product1: Product, private product2: Product) {
        this.mockProduct1 = product1;
        this.mockProduct2 = product2;
        this.mockProducts = [this.mockProduct1, this.mockProduct2];
        this.mockValueChanges = new BehaviorSubject(this.mockProducts);
    }

    // valueChanges(events?: ChildEvent[]): Observable<T[]>;
    valueChanges(): BehaviorSubject<Product[]> {
        return this.mockValueChanges;
    }

    update(productId: string, newProduct: Product) {
        expect(productId).toEqual('mockProduct.id');
        expect(newProduct).toEqual(this.mockProduct1);
    }
}

class MockAngularFireDatabase {
    mockAngularFireList: MockAngularFireList;
    mockProduct1: Product;
    mockProduct2: Product;
    mockProducts: Product[];
    constructor() {
        this.mockProduct1 = new Product();
        this.mockProduct1.id = "mockProduct.id";
        this.mockProduct1.name = "mockProduct.name";
        this.mockProduct1.description = "description";
        this.mockProduct1.category = "Smartphones";
        this.mockProduct1.count = 20;
        this.mockProduct1.price = 20;
        this.mockProduct1.imageUrl = "imageUrl";
        this.mockProduct1.promotionId = "ads"

        this.mockProduct2 = new Product();
        this.mockProduct2.id = "mockProduct.id2";
        this.mockProduct2.name = "mockProduct.name2";
        this.mockProduct2.description = "description2";
        this.mockProduct2.category = "Smartphones";
        this.mockProduct2.count = 30;
        this.mockProduct2.price = 40;
        this.mockProduct2.imageUrl = "imageUrl2";
        this.mockProduct2.promotionId = "ads2";
        
        this.mockProducts = [this.mockProduct1, this.mockProduct2];

        this.mockAngularFireList = new MockAngularFireList(this.mockProduct1, this.mockProduct2);
    }
    list(pathtoCheck: string): MockAngularFireList {
        expect(pathtoCheck).toEqual('products');
        return this.mockAngularFireList;
    }
    createPushId(): string {
        return 'mockProduct.id';
    }
}

describe('ProductsService', () => {
    let service: ProductsService;
    let fixture: ComponentFixture<ProductsService>;
    let mockFireDatabase: MockAngularFireDatabase; 

    beforeEach(async(() => {
        mockFireDatabase = new MockAngularFireDatabase(); 
        
      TestBed.configureTestingModule({
        // imports: [ ],
        providers: [ 
            ProductsService, 
            { provide: AngularFireDatabase, useValue: mockFireDatabase }
        ]
      })
    }));
  
    beforeEach(() => {
        
    });
  
    it('should create', () => {
        service = TestBed.get(ProductsService);
        expect(service).toBeTruthy();

        let allCategories = service.allCategoriesObservable.value;

        expect(allCategories.has('Smartphones')).toEqual(true);
        expect(allCategories.has('Laptops')).toEqual(true);
        expect(allCategories.has('Monitors')).toEqual(true);
        expect(allCategories.has('Accessories')).toEqual(true);
        
        expect(allCategories.get('Smartphones')).toEqual(true);
        expect(allCategories.get('Laptops')).toEqual(true);
        expect(allCategories.get('Monitors')).toEqual(true);
        expect(allCategories.get('Accessories')).toEqual(true);

        let preinstalledSort: SortType = { title: 'Price Low to top', matSortable: { id: 'price', start: 'asc', disableClear: false } };
        expect(service.selectedSortingType).toEqual(preinstalledSort); 
    });
    
    it('should create with subscription', () => {
        let spyFirebaseList = spyOn(mockFireDatabase, 'list').and.callThrough();
        let spyOnQuerySubscription = spyOn(mockFireDatabase.mockAngularFireList, 'valueChanges').and.callThrough();

        service = TestBed.get(ProductsService);

        expect(service).toBeTruthy();
        expect(spyFirebaseList.calls.any()).toBe(true);
        expect(spyOnQuerySubscription.calls.any()).toBe(true);
        
        expect(service.allProductsObservable.value).toEqual(mockFireDatabase.mockProducts);
        expect(service.sortedProductsObservable.value).toEqual(mockFireDatabase.mockProducts);
        
        expect(service.selectPriceRangeObservable.value).toEqual({'maxValue' : 40, 'minValue' :  20 });
        
        expect(service.selectCountRangeObservable.value).toEqual({'maxValue' : 30, 'minValue' :  20 });
        
        let newProducts = [mockFireDatabase.mockProduct1];
        mockFireDatabase.mockAngularFireList.mockValueChanges.next(newProducts);
        expect(service.allProductsObservable.value).toEqual(newProducts);
        expect(service.sortedProductsObservable.value).toEqual(newProducts);
        
    });

    it('should manage categories', () => {        
        service = TestBed.get(ProductsService);

        expect(service.getAllCategories()).toEqual(service.allCategoriesObservable);
        expect(service.allCategoriesObservable.value.get('Smartphones')).toEqual(true);
        var iteraction = 0;

        service.allCategoriesObservable.subscribe((categories) => {    
            if (iteraction == 0) {
                iteraction = 1;
                expect(categories.get('Smartphones')).toEqual(true);
            } else if (iteraction == 1) {
                iteraction = 2;
                expect(categories.get('Smartphones')).toEqual(false);
            } else if (iteraction == 2) {
                expect(categories.get('Smartphones')).toEqual(true);
            }
        });

        service.deselectCategory('Smartphones');
        expect(service.allCategoriesObservable.value.get('Smartphones')).toEqual(false);
        expect(service.sortedProductsObservable.value).toEqual([]);
        service.selectCategory('Smartphones');
        expect(service.allCategoriesObservable.value.get('Smartphones')).toEqual(true);
        expect(service.sortedProductsObservable.value).toEqual(mockFireDatabase.mockProducts);
    });

    it('should max min work', () => {        
        service = TestBed.get(ProductsService);

        expect(service.maxCount()).toEqual(30);
        expect(service.minCount()).toEqual(20);
        expect(service.maxPrice()).toEqual(40);
        expect(service.minPrice()).toEqual(20);

        mockFireDatabase.mockAngularFireList.mockValueChanges.next([]);
        expect(service.maxCount()).toEqual(0);
        expect(service.minCount()).toEqual(0);
        expect(service.maxPrice()).toEqual(0);
        expect(service.minPrice()).toEqual(0);


        let products = [mockFireDatabase.mockProduct2, mockFireDatabase.mockProduct1];
        mockFireDatabase.mockAngularFireList.mockValueChanges.next(products);
        expect(service.maxCount()).toEqual(30);
        expect(service.minCount()).toEqual(20);
        expect(service.maxPrice()).toEqual(40);
        expect(service.minPrice()).toEqual(20);
    });

    it('should Count Range Works', () => {        
        service = TestBed.get(ProductsService);

        expect(service.getSelectedCountRangeObservable()).toEqual(service.selectCountRangeObservable);

        let iteraction = 0;
        service.selectCountRangeObservable.subscribe((range) => {
            if (iteraction == 0) {
                iteraction = 1;
                expect(range.maxValue).toEqual(30);
                expect(range.minValue).toEqual(20);
            } else if (iteraction == 1) {
                iteraction = 2;
                expect(range.maxValue).toEqual(100);
                expect(range.minValue).toEqual(0);
            } else if (iteraction == 2) {
                expect(range.maxValue).toEqual(23);
                expect(range.minValue).toEqual(22);
            }
        });

        service.setCountRange(0, 100);
        expect(service.selectCountRangeObservable.value.maxValue).toEqual(100);
        expect(service.selectCountRangeObservable.value.minValue).toEqual(0);
        expect(service.sortedProductsObservable.value).toEqual(mockFireDatabase.mockProducts);

        service.setCountRange(22, 23);
        expect(service.selectCountRangeObservable.value.maxValue).toEqual(23);
        expect(service.selectCountRangeObservable.value.minValue).toEqual(22);
        expect(service.sortedProductsObservable.value).toEqual([]);
    });

    it('should Price Range Works', () => {        
        service = TestBed.get(ProductsService);

        expect(service.getSelectedPriceRangeObservable()).toEqual(service.selectPriceRangeObservable);

        let iteraction = 0;
        service.selectPriceRangeObservable.subscribe((range) => {
            if (iteraction == 0) {
                iteraction = 1;
                expect(range.maxValue).toEqual(40);
                expect(range.minValue).toEqual(20);
            } else if (iteraction == 1) {
                iteraction = 2;
                expect(range.maxValue).toEqual(100);
                expect(range.minValue).toEqual(0);
            } else if (iteraction == 2) {
                expect(range.maxValue).toEqual(23);
                expect(range.minValue).toEqual(22);
            }
        });

        service.setPriceRange(0, 100);
        expect(service.selectPriceRangeObservable.value.maxValue).toEqual(100);
        expect(service.selectPriceRangeObservable.value.minValue).toEqual(0);
        expect(service.sortedProductsObservable.value).toEqual(mockFireDatabase.mockProducts);

        service.setPriceRange(22, 23);
        expect(service.selectPriceRangeObservable.value.maxValue).toEqual(23);
        expect(service.selectPriceRangeObservable.value.minValue).toEqual(22);
        expect(service.sortedProductsObservable.value).toEqual([]);
    });

    it('Get Products Observable', () => {        
        service = TestBed.get(ProductsService);

        service.getAllProductsObservable().subscribe((products)=> {
            expect(products).toEqual(mockFireDatabase.mockProducts);
        });
        service.getSortedFilteredProducts().subscribe((products)=> {
            expect(products).toEqual(mockFireDatabase.mockProducts);
        });
    });

    it('Service Buy Products', () => {        
        service = TestBed.get(ProductsService);

        let spyUpdateOnQuery = spyOn(mockFireDatabase.mockAngularFireList, 'update').and.callThrough();
        mockFireDatabase.mockAngularFireList.mockProduct1.count = 3;

        service.buyProduct(mockFireDatabase.mockProduct1, 3);

        expect(spyUpdateOnQuery.calls.any()).toBe(true);

    });

  });