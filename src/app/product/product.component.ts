import { Component, OnInit, Input } from '@angular/core';

import { Product } from '../../models/product.model';
import { from, BehaviorSubject } from 'rxjs';
import { BasketService } from 'src/services/basketService';
import { MatDialog } from '@angular/material';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { PromotionService } from 'src/services/promotion.service';
import { Promotion } from 'src/models/promotion.model';
import { ProductsService } from 'src/services/product.service';
import { TimeState } from 'src/models/time.state.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {

  basketProducts: Array<Product>;
  @Input() product: Product;
  isCanAdd: boolean = false
  isCanRemove: boolean = false

  promotion: Promotion | null = null
  isExistPromotion: boolean = false
  newPromotionPrice: number = 0
  promotionTimeText: string = ''
  observableTimeHandler: BehaviorSubject<TimeState> | null = null
  emoji: string = '🐶'
  emojies = ['😉', '🤩', '🥳', '👻', '🎃', '🧠', '👨🏻‍🚀', '🧛🏻‍♂️', '💅🏻', '👑', '🎩']

  constructor(public dialog: MatDialog, 
    private productService: ProductsService,
    private basketService: BasketService, 
    private promotionService: PromotionService) { }

  ngOnInit() {
    let randomNumber: number = Math.round(((Math.random()*100000)%10))
    this.emoji = this.emojies[randomNumber];
    this.isCanAdd = this.product.count>0
    this.basketService.getbasketProductsObservable().subscribe( basketProducts => {
      this.basketProducts = basketProducts;
      this.isCanRemove = this.basketService.countOfProduct(this.product) > 0;
      this.isCanAdd = this.product.count > 0;
    })
    this.productService.getAllProductsObservable().subscribe(products => {
      let myProduct = products.find(element => { return element.id == this.product.id })
      if (myProduct != null) {
        this.product = myProduct;
        this.checkPromotion()
      }
    });
    this.promotionService.getPromotionsObservable().subscribe(promotions => {
      this.checkPromotion()
    });
  }
  
  checkPromotion() {
    if (this.product.promotionId != null) {
      this.promotion = this.promotionService.getPromotionById(this.product.promotionId);
    }
    if (this.promotion != null) {
      this.observableTimeHandler = this.promotionService.getObservablePromotion(this.promotion.id)
      this.observableTimeHandler.subscribe(timeState => {
        this.isExistPromotion = timeState.isActive;
        if (this.promotion != null) { 
          this.newPromotionPrice = this.product.price * (1-(this.promotion.discount/100))
          this.promotionTimeText = (timeState.days > 0 ? 'day(s): ' + timeState.days + ' ' : '') +
          ((timeState.days > 0 || timeState.hours > 0) ? ' ' + timeState.hours + ':' : '') +
          ((timeState.hours > 0 || timeState.minutes > 0) ? '' + timeState.minutes + ':' : '') +
          ((timeState.minutes > 0 || timeState.seconds > 0) ? '' + timeState.seconds + '' : '')  
        } else {
          this.promotionTimeText = ''
        }
      });
    }
    
  }

  addOneProduct(event: Event) {
    event.stopPropagation()
    this.basketService.addOne(this.product);
  }

  removeOneProduct(event: Event) {
    event.stopPropagation()
    this.basketService.removeOne(this.product, true);
  }

  openProductDetail(event) {
    const dialogRef = this.dialog.open(ProductDetailComponent, 
      { 
        width: '1000px', 
        height: '650px',
        data: this.product
      });
  }
}
