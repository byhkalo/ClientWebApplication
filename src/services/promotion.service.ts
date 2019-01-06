import { Injectable } from "@angular/core";
import { Promotion } from "src/models/promotion.model";
import { AngularFireDatabase } from "@angular/fire/database";
import { BehaviorSubject } from "rxjs";
import { TimeState } from "src/models/time.state.model";

@Injectable({ providedIn: 'root' })
export class PromotionService {

    private promotions: Map<String, Promotion> = new Map();
    private allPromotions: Array<Promotion> = [];

    private promotionsObservable: BehaviorSubject<Array<Promotion>> = new BehaviorSubject([])
    private promotionTimers: Map<string, NodeJS.Timer> = new Map();
    private promotionTimeHandlers: Map<string, BehaviorSubject<TimeState>> = new Map();

    constructor(fireDatabase: AngularFireDatabase) { 
        fireDatabase.list<Promotion>('promotions').valueChanges().subscribe(promotions => {
            this.allPromotions = promotions;
            console.log('All Promotions = '+ promotions)
            this.updatePromotions();
            this.promotionsObservable.next(promotions);
        });
    }

    updatePromotions() {
        this.promotions.clear
        this.allPromotions.forEach(promotion => {
            this.promotions.set(promotion.id, promotion);
            this.updateTimerForPromotion(promotion)
        });
    }

    updateTimerForPromotion(promotion: Promotion) {
        if (this.promotionTimers.has(promotion.id)){
            clearInterval(this.promotionTimers.get(promotion.id))
            this.promotionTimers.delete(promotion.id)
        }    
        let _this = this
        let timeinterval = setInterval(function(){
            let currentDate = Math.floor(Date.now() /1000);
            var t = promotion.untilTimestamp - currentDate;
            var seconds = Math.floor( (t) % 60 );
            var minutes = Math.floor( (t/60) % 60 );
            var hours = Math.floor( (t/(60*60)) % 24 );
            var days = Math.floor( t/(60*60*24) );
            let timeState: TimeState = { total: t, days: days, hours: hours, 
            minutes: minutes, seconds: seconds , isActive : t>0, promotion: promotion};
            _this.getObservablePromotion(promotion.id).next(timeState)
            console.log('tick ' + t);
            if(timeState.total<0){
                // this.timeinterval = null;
                // this.timeinterval = 
                _this.promotionsObservable.next(_this.allPromotions);
                clearInterval(_this.promotionTimers.get(promotion.id))
                _this.promotionTimers.delete(promotion.id)
            }
        },1000);
        this.promotionTimers.set(promotion.id, timeinterval);
    }

    getPromotionById(promotionId: string): Promotion | null {
        if (this.promotions.has(promotionId)) {
            let promotion = this.promotions.get(promotionId);
            let currentDate = Math.floor(Date.now() /1000);
            if (promotion.untilTimestamp > currentDate) {
                return promotion;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    isExistPromotion(promotionId: string) {
        return this.getPromotionById(promotionId) != null;
    }

    getPromotionsObservable(): BehaviorSubject<Array<Promotion>> {
        return this.promotionsObservable;
    }
    getObservablePromotion(promotionId: string): BehaviorSubject<TimeState> {
        if (!this.promotionTimeHandlers.has(promotionId)) {
            let promotion = this.promotions.get(promotionId)
            let timeState = { total: 0, days: 0, hours: 0, minutes: 0, 
                seconds: 0 , isActive : false, promotion: promotion};
            this.promotionTimeHandlers.set(promotionId, new BehaviorSubject<TimeState>(timeState));
        }
        return this.promotionTimeHandlers.get(promotionId);
    }
}