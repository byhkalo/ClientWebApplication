import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BasketService } from 'src/services/basketService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ClientWebApplication';

  productsCount = 0
  productsSum = 0
  constructor(private router: Router, private basket: BasketService) {}

  ngOnInit() {
    this.basket.getProductsCountObservable().subscribe(productsCount => {
      this.productsCount = productsCount;
    });
    this.basket.getProductsSumObservable().subscribe(productsSum => {
      this.productsSum = productsSum;
    });
  }

  openBasket() {
    this.router.navigate(['/basket']);
  }

}
