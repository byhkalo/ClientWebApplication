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
import { PromotionService } from './promotion.service';
import { Promotion } from 'src/models/promotion.model';


class MockAngularFireList {
    mockPromotion1: Promotion;
    mockPromotion2: Promotion;
    mockPromotions: Promotion[];
    mockValueChanges: BehaviorSubject<Promotion[]>;

    constructor(private promotion1: Promotion, private promotion2: Promotion) {
        this.mockPromotion1 = promotion1;
        this.mockPromotion2 = promotion2;
        this.mockPromotions = [this.mockPromotion1, this.mockPromotion2];
        this.mockValueChanges = new BehaviorSubject(this.mockPromotions);
    }

    // valueChanges(events?: ChildEvent[]): Observable<T[]>;
    valueChanges(): BehaviorSubject<Promotion[]> {
        return this.mockValueChanges;
    }
}

class MockAngularFireDatabase {
    mockAngularFireList: MockAngularFireList;
    mockPromotion1: Promotion;
    mockPromotion2: Promotion;
    mockPromotions: Promotion[];
    constructor() {
        this.mockPromotion1 = new Promotion();
        this.mockPromotion1.id = "mockProduct.id1";
        this.mockPromotion1.discount = 10;
        this.mockPromotion1.untilTimestamp = 2147483648;

        this.mockPromotion2 = new Promotion();
        this.mockPromotion2.id = "mockProduct.id2";
        this.mockPromotion2.discount = 20;
        this.mockPromotion2.untilTimestamp = 2147483648;
        
        this.mockPromotions = [this.mockPromotion1, this.mockPromotion2];

        this.mockAngularFireList = new MockAngularFireList(this.mockPromotion1, this.mockPromotion2);
    }
    list(pathtoCheck: string): MockAngularFireList {
        expect(pathtoCheck).toEqual('promotions');
        return this.mockAngularFireList;
    }
}

describe('PromotionService', () => {
    let service: PromotionService;
    let fixture: ComponentFixture<PromotionService>;
    let mockFireDatabase: MockAngularFireDatabase; 

    beforeEach(async(() => {
        mockFireDatabase = new MockAngularFireDatabase(); 
        
      TestBed.configureTestingModule({
        // imports: [ ],
        providers: [ 
            PromotionService, 
            { provide: AngularFireDatabase, useValue: mockFireDatabase }
        ]
      })
    }));
  
    beforeEach(() => {
        
    });
  
    it('should create', () => {
        let spyOnFirebaseList = spyOn(mockFireDatabase.mockAngularFireList, 'valueChanges').and.callThrough();
        service = TestBed.get(PromotionService);
        expect(service).toBeTruthy(); 
        expect(spyOnFirebaseList.calls.any()).toBe(true);
        expect(service.getPromotionsObservable().value).toEqual(mockFireDatabase.mockPromotions);
    });

    it('should return promotion', () => {
        mockFireDatabase.mockAngularFireList.mockPromotion2.untilTimestamp = 123123;
        service = TestBed.get(PromotionService);
        
        expect(service.getPromotionById("asddsa")).toEqual(null);
        expect(service.getPromotionById(mockFireDatabase.mockPromotion1.id)).toEqual(mockFireDatabase.mockPromotion1);
        expect(service.getPromotionById(mockFireDatabase.mockPromotion2.id)).toEqual(null);

        expect(service.isExistPromotion("asddsa")).toEqual(false);
        expect(service.isExistPromotion(mockFireDatabase.mockPromotion1.id)).toEqual(true);
        expect(service.isExistPromotion(mockFireDatabase.mockPromotion2.id)).toEqual(false);
    });

    it('should update promotions', () => {
        
        service = TestBed.get(PromotionService);
        let iteration = 0
        service.getPromotionsObservable().subscribe(promotions => {
            if (iteration == 0) {
                expect(promotions).toEqual(mockFireDatabase.mockAngularFireList.mockPromotions);
            } else if (iteration == 1) {
                expect(promotions).toEqual([mockFireDatabase.mockPromotion1]);
            } else if (iteration == 2) {
                expect(promotions).toEqual([mockFireDatabase.mockPromotion2]);
            }
            iteration ++;
        })
        
        mockFireDatabase.mockAngularFireList.mockValueChanges.next([mockFireDatabase.mockPromotion1]);
        expect(service.getPromotionsObservable().value).toEqual([mockFireDatabase.mockPromotion1]);
        mockFireDatabase.mockAngularFireList.mockValueChanges.next([mockFireDatabase.mockPromotion2]);
        expect(service.getPromotionsObservable().value).toEqual([mockFireDatabase.mockPromotion2]);
    });

    it('should return observable Promotion', () => {
        mockFireDatabase.mockAngularFireList.mockPromotion2.untilTimestamp = 123123;

        service = TestBed.get(PromotionService);
        
        let promotionBehaviourSubject1 = service.getObservablePromotion(mockFireDatabase.mockPromotion1.id)
        expect(promotionBehaviourSubject1.value.promotion).toEqual(mockFireDatabase.mockPromotion1)
        expect(promotionBehaviourSubject1.value.total).toEqual(0);
        expect(promotionBehaviourSubject1.value.isActive).toEqual(false);

        let promotionBehaviourSubject2 = service.getObservablePromotion(mockFireDatabase.mockPromotion2.id)
        expect(promotionBehaviourSubject2.value.promotion).toEqual(mockFireDatabase.mockPromotion2)
        expect(promotionBehaviourSubject2.value.total).toEqual(0);
        expect(promotionBehaviourSubject2.value.isActive).toEqual(false);
    });

  });