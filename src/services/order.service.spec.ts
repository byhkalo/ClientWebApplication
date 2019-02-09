import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderService } from "./order.service";
import { AngularFireDatabase, PathReference, QueryFn, AngularFireList, AngularFireDatabaseModule } from '@angular/fire/database';
import { BasketService } from './basketService';
import { Order } from 'src/models/order.model';
import { DatabaseQuery } from '@angular/fire/database/interfaces';
import { Product } from 'src/models/product.model';

class MockAngularFireList {
    mockProduct: Product;
    mockOrder: Order;
    constructor(private product: Product) {
        this.mockProduct = product;

        this.mockOrder = new Order();
        this.mockOrder.id = "newOrderId"
        this.mockOrder.clientFirstName = 'clientFirstName';
        this.mockOrder.clientLastName = 'clientLastName';
        this.mockOrder.email = 'email';
        this.mockOrder.telephone = 'telephone';
        this.mockOrder.addres = 'addres';
        this.mockOrder.city = 'City';
        this.mockOrder.state = 'state';
        this.mockOrder.postalCode = 'postalCode';
        this.mockOrder.shipingType = 'shipingType';
        this.mockOrder.category = 'Unmanaged';
        this.mockOrder.products = [this.mockProduct];
        this.mockOrder.completness = [false];
        this.mockOrder.totalSum = 50;
    }

    update(newOrderId: string, newOrder: Order) {
        expect(newOrderId).toEqual('newOrderId');
        expect(newOrder).toEqual(this.mockOrder);
    }
}
class MockAngularFireDatabase {
    mockAngularFireList: MockAngularFireList
    mockProduct: Product
    constructor() {
        this.mockProduct = new Product();
        this.mockProduct.id = "mockProduct.id";
        this.mockProduct.name = "mockProduct.name";
        this.mockProduct.description = "description";
        this.mockProduct.category = "category";
        this.mockProduct.count = 20;
        this.mockProduct.price = 20;
        this.mockProduct.imageUrl = "imageUrl";
        this.mockProduct.promotionId = "ads"

        this.mockAngularFireList = new MockAngularFireList(this.mockProduct)
    }
    list(pathtoCheck: string): MockAngularFireList {
        expect(pathtoCheck).toEqual('orders/unmanaged');
        return this.mockAngularFireList;
    }
    createPushId(): string {
        return 'newOrderId';
    }
}

class MockBasketService {
    mockProducts: Product[]
    constructor(private products: Product[]) {
        this.mockProducts = products;
    }
    getBasketProducts(): Product[] {
        return this.mockProducts;
    }
    getPriceForProduct(product: Product): number {
        return 20;
    }

    getProductsSum(): number {
        return 50;
    }

    buyProducts() {
    }
}

describe('OrderService', () => {
    let service: OrderService;
    let fixture: ComponentFixture<OrderService>;
    let mockFireDatabase: MockAngularFireDatabase; 
    let mockBasketService: MockBasketService;


    beforeEach(async(() => {
        mockFireDatabase = new MockAngularFireDatabase(); 
        mockBasketService = new MockBasketService([mockFireDatabase.mockProduct]);
        
      TestBed.configureTestingModule({
        // imports: [ ],
        providers: [ 
            OrderService, 
            { provide: AngularFireDatabase, useValue: mockFireDatabase },
            { provide: BasketService, useValue: mockBasketService }  
        ]
      })
    }));
  
    beforeEach(() => {
        service = TestBed.get(OrderService);
    });
  
    it('should create', () => {
      expect(service).toBeTruthy();
    });
  
    it('should Order', () => {
        let spyOnBasketBuy = spyOn(mockBasketService, 'buyProducts').and.callThrough();
        let spyOnOrderUpdate = spyOn(mockFireDatabase.mockAngularFireList, 'update').and.callThrough();
        service.createOrder('clientFirstName', 'clientLastName', 'email', 'telephone', 
            'addres', 'City', 'state', 'postalCode', 'shipingType')
        expect(spyOnBasketBuy.calls.any()).toBe(true);
        expect(spyOnOrderUpdate.calls.any()).toBe(true);
    });

  });
  