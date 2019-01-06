import { Component, OnInit, Inject } from '@angular/core';
import { Product } from 'src/models/product.model';
import { MAT_DIALOG_DATA } from '@angular/material';
import { BasketService } from 'src/services/basketService';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  isCanAdd: boolean = false
  isCanRemove: boolean = false
  product: Product | null
  constructor(@Inject(MAT_DIALOG_DATA) public data: Product, private basketService: BasketService) { 
    this.product = data;
  }

  ngOnInit() {
    this.isCanAdd = this.product.count>0
    this.basketService.getbasketProductsObservable().subscribe( basketProducts => {
      this.isCanRemove = this.basketService.countOfProduct(this.product) > 0;
      this.isCanAdd = this.product.count > 0;
    })
  }

  addOneProduct() {
    this.basketService.addOne(this.product);
  }

  removeOneProduct() {
    this.basketService.removeOne(this.product, true);
  }

  closeProduct() {

  }
}
