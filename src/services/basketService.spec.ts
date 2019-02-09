import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderService } from "./order.service";
import { AngularFireDatabase, PathReference, QueryFn, AngularFireList, AngularFireDatabaseModule } from '@angular/fire/database';
import { BasketService } from './basketService';
import { Order } from 'src/models/order.model';
import { DatabaseQuery } from '@angular/fire/database/interfaces';
import { Product } from 'src/models/product.model';
import { ProductsService } from './product.service';
import { PromotionService } from './promotion.service';
import { Promotion } from 'src/models/promotion.model';
import { BehaviorSubject } from 'rxjs';

class MockProductsService {
    mockAllProductsObservable: BehaviorSubject<Product[]>
    mockProduct1: Product;
    mockProduct2: Product;
    mockProduct3: Product;
    mockProducts: Product[];

    constructor() {
        this.mockProduct1 = new Product();
        this.mockProduct1.id = "mockProduct1.id";
        this.mockProduct1.name = "name";
        this.mockProduct1.description = "this.mockProduct1.description";
        this.mockProduct1.category = "category";
        this.mockProduct1.count = 20;
        this.mockProduct1.price = 10;
        this.mockProduct1.imageUrl = "imageUrl";
        this.mockProduct1.promotionId = "promotionId1";

        this.mockProduct2 = new Product();
        this.mockProduct2.id = "mockProduct2.id";
        this.mockProduct2.name = "name";
        this.mockProduct2.description = "this.mockProduct2.description";
        this.mockProduct2.category = "category";
        this.mockProduct2.count = 30;
        this.mockProduct2.price = 20;
        this.mockProduct2.imageUrl = "imageUrl";
        this.mockProduct2.promotionId = "promotionId2";
        
        this.mockProduct3 = new Product();
        this.mockProduct3.id = "mockProduct3.id";
        this.mockProduct3.name = "name";
        this.mockProduct3.description = "this.mockProduct3.description";
        this.mockProduct3.category = "category";
        this.mockProduct3.count = 1;
        this.mockProduct3.price = 50;
        this.mockProduct3.imageUrl = "imageUrl";
        this.mockProduct3.promotionId = null;

        this.mockProducts = [this.mockProduct1, this.mockProduct2, this.mockProduct3];
        this.mockAllProductsObservable = new BehaviorSubject(this.mockProducts);
    }

    getAllProductsObservable(): BehaviorSubject<Product[]> {
        return this.mockAllProductsObservable;
    }
    
    buyProduct(product: Product, countLeft: number) {}
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

describe('BasketService', () => {
    let service: BasketService;
    let fixture: ComponentFixture<BasketService>;
    
    let mockProductsService: MockProductsService;
    let mockPromotionService: MockPromotionService;


    beforeEach(async(() => {
        mockProductsService = new MockProductsService();
        mockPromotionService = new MockPromotionService();
        
      TestBed.configureTestingModule({
        // imports: [ ],
        providers: [ 
            BasketService, 
            { provide: ProductsService, useValue: mockProductsService },
            { provide: PromotionService, useValue: mockPromotionService },
        ]
      })
    }));
  
    beforeEach(() => {
       
    });
  
    it('should create', () => {
        let spyOnProductSubscribe = spyOn(mockProductsService, 'getAllProductsObservable').and.callThrough();
        let spyOnPromotionsSubscribe = spyOn(mockPromotionService, 'getPromotionsObservable').and.callThrough();

        service = TestBed.get(BasketService);
        expect(service).toBeTruthy();
        expect(spyOnProductSubscribe.calls.any()).toBe(true);
        expect(spyOnPromotionsSubscribe.calls.any()).toBe(true);
    });
  
    it('should Manage Add To Basket', () => {
        service = TestBed.get(BasketService);
        let iteraction = 0;
        service.getbasketProductsObservable().subscribe((products) => {
            if (iteraction == 0) {
                expect(products).toEqual([])
            } else if (iteraction == 1) {
                expect(products.length).toEqual(1);
                expect(products[0].count).toEqual(1);
                expect(products[0].id).toEqual('mockProduct1.id');
            } else if (iteraction == 2) {
                expect(products.length).toEqual(1);
                expect(products[0].count).toEqual(2);
                expect(products[0].id).toEqual('mockProduct1.id');
            } else if (iteraction == 3) {
                expect(products.length).toEqual(2);
                expect(products[0].count).toEqual(2);
                expect(products[0].id).toEqual('mockProduct1.id');
                expect(products[1].count).toEqual(1);
                expect(products[1].id).toEqual('mockProduct3.id');
            } if (iteraction == 4) {
                expect(products.length).toEqual(2);
                expect(products[0].count).toEqual(3);
                expect(products[0].id).toEqual('mockProduct1.id');
                expect(products[1].count).toEqual(1);
                expect(products[1].id).toEqual('mockProduct3.id');
            }
            iteraction ++;
        });

        expect(service.getBasketProducts()).toEqual([]);
        expect(service.getbasketProductsObservable().value).toEqual([]);
        expect(service.getProductsCountObservable().value).toEqual(0);
        expect(service.getProductsSum()).toEqual(0);
        expect(service.getProductsSumObservable().value).toEqual(0);

        expect(service.countOfProduct(mockProductsService.mockProduct1)).toEqual(0);
        expect(service.getPriceForProduct(mockProductsService.mockProduct1)).toEqual(8);
        expect(service.getPriceForProduct(mockProductsService.mockProduct2)).toEqual(20);
        expect(service.getPriceForProduct(mockProductsService.mockProduct3)).toEqual(50);

        expect(mockProductsService.mockProduct1.count).toEqual(20);
        service.addOne(mockProductsService.mockProduct1);
        expect(service.countOfProduct(mockProductsService.mockProduct1)).toEqual(1);
        expect(mockProductsService.mockProduct1.count).toEqual(19);
        expect(service.getProductsSum()).toEqual(8);

        service.addOne(mockProductsService.mockProduct1);
        expect(service.countOfProduct(mockProductsService.mockProduct1)).toEqual(2);
        expect(mockProductsService.mockProduct1.count).toEqual(18);
        expect(service.getProductsSum()).toEqual(16);

        expect(mockProductsService.mockProduct3.count).toEqual(1);
        service.addOne(mockProductsService.mockProduct3);
        expect(service.countOfProduct(mockProductsService.mockProduct3)).toEqual(1);
        expect(mockProductsService.mockProduct3.count).toEqual(0);
        expect(service.getProductsSum()).toEqual(66);

        service.addOne(mockProductsService.mockProduct3);
        expect(service.countOfProduct(mockProductsService.mockProduct3)).toEqual(1);
        expect(mockProductsService.mockProduct3.count).toEqual(0);
        expect(service.getProductsSum()).toEqual(66);

        service.addOneFromBasket(service.getBasketProducts()[0]);
        expect(service.countOfProduct(mockProductsService.mockProduct1)).toEqual(3);
        expect(mockProductsService.mockProduct1.count).toEqual(17);
        expect(service.getProductsSum()).toEqual(74);

    });

    it('should Manage Remove From Basket', () => {
        service = TestBed.get(BasketService);

        service.addOne(mockProductsService.mockProduct1);
        service.addOne(mockProductsService.mockProduct1);
        service.addOne(mockProductsService.mockProduct1);
        service.addOne(mockProductsService.mockProduct1);
        service.addOne(mockProductsService.mockProduct2);
        service.addOne(mockProductsService.mockProduct2);
        service.addOne(mockProductsService.mockProduct2);
        service.addOne(mockProductsService.mockProduct3);
        expect(service.countOfProduct(mockProductsService.mockProduct1)).toEqual(4);
        expect(service.countOfProduct(mockProductsService.mockProduct2)).toEqual(3);
        expect(service.countOfProduct(mockProductsService.mockProduct3)).toEqual(1);
        expect(mockProductsService.mockProduct1.count).toEqual(16);
        expect(mockProductsService.mockProduct2.count).toEqual(27);
        expect(mockProductsService.mockProduct3.count).toEqual(0);
        expect(service.getProductsSum()).toEqual(142);

        let iteraction = 0;
        service.getbasketProductsObservable().subscribe((products) => {
            if (iteraction == 0) { // product 3 - full basket
                expect(products.length).toEqual(3);
                expect(products[0].id).toEqual('mockProduct1.id');
                expect(products[0].count).toEqual(4);
                expect(products[1].id).toEqual('mockProduct2.id');
                expect(products[1].count).toEqual(3);
                expect(products[2].id).toEqual('mockProduct3.id');
                expect(products[2].count).toEqual(1);
            } else if (iteraction == 1) { // product 3 - removed (deleted)
                expect(products.length).toEqual(2);
                expect(products[0].id).toEqual('mockProduct1.id');
                expect(products[0].count).toEqual(4);
                expect(products[1].id).toEqual('mockProduct2.id');
                expect(products[1].count).toEqual(3);
            } else if (iteraction == 2) { // product 1 - removed
                expect(products.length).toEqual(2);
                expect(products[0].id).toEqual('mockProduct1.id');
                expect(products[0].count).toEqual(3);
                expect(products[1].id).toEqual('mockProduct2.id');
                expect(products[1].count).toEqual(3);
            } else if (iteraction == 3) { // product 2 - Deleted
                expect(products.length).toEqual(1);
                expect(products[0].id).toEqual('mockProduct1.id');
                expect(products[0].count).toEqual(3);
            } else if (iteraction == 4) { // product 1 - removed
            } else if (iteraction == 5) { // product 1 - removed
            } else if (iteraction == 6) { // product 1 - removed
                expect(products.length).toEqual(1);
                expect(products[0].id).toEqual('mockProduct1.id');
                expect(products[0].count).toEqual(0);
            } else if (iteraction == 7) { // product 1 - removed
                expect(products.length).toEqual(1);
                expect(products[0].id).toEqual('mockProduct1.id');
                expect(products[0].count).toEqual(0);
            }  else if (iteraction == 8) { // product 1 - delete
                expect(products.length).toEqual(0);
            }

            iteraction ++;
        });
        
        let basketProducts = service.getBasketProducts();
        service.removeOne(mockProductsService.mockProduct3, true);

        service.removeOneFromBasket(basketProducts[0]);

        service.deleteFormBasket(basketProducts[1]);
        service.removeOneFromBasket(basketProducts[0]);
        service.removeOneFromBasket(basketProducts[0]);
        service.removeOneFromBasket(basketProducts[0]);
        service.removeOne(basketProducts[0], false);
        service.deleteFormBasket(basketProducts[0]);
        service.deleteFormBasket(mockProductsService.mockProduct2);
    });

    it('should Buy Product', () => {
        service = TestBed.get(BasketService);

        service.addOne(mockProductsService.mockProduct1);
        expect(service.countOfProduct(mockProductsService.mockProduct1)).toEqual(1);
        expect(mockProductsService.mockProduct1.count).toEqual(19);
        expect(service.getProductsSum()).toEqual(8);

        let spyOnDeleteFromBasket = spyOn(service, 'deleteFormBasket').and.callFake((product) => {
            expect(product).toEqual(mockProductsService.mockProduct1);
        });
        let spyOnProductSevice = spyOn(mockProductsService, 'buyProduct').and
            .callFake((product: Product, countToLeft: number) => {
                expect(product).toEqual(mockProductsService.mockProduct1);
                expect(countToLeft).toEqual(19);
            })

        service.buyProducts();

        expect(spyOnDeleteFromBasket.calls.any()).toBe(true);
        expect(spyOnProductSevice.calls.any()).toBe(true);
    });

  });
  