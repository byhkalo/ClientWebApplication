import { Injectable, OnInit } from '@angular/core';
import { ProductsService } from './product.service';
import { Product } from 'src/models/product.model';
import { BehaviorSubject } from 'rxjs';
import { PromotionService } from './promotion.service';

@Injectable({ providedIn: 'root' })
export class BasketService {

    private basketProducts: Map<String, Product> = new Map();
    private basketProductsObservable = new BehaviorSubject(Array.from(this.basketProducts.values()));

    private productsCount: number = 0;
    private productsCountObservable = new BehaviorSubject(0);

    private productsSum: number = 0;
    private productsSumObservable = new BehaviorSubject(0);

    private allProducts: Array<Product> = [];
    private priceForProduct: Map<String, number> = new Map();

    constructor(private productsService: ProductsService, private promotionsService: PromotionService) {
        this.productsService.getAllProductsObservable().subscribe( allProducts => {
            this.allProducts = allProducts;
        });
        this.promotionsService.getPromotionsObservable().subscribe(promotions => {
            console.log('Start to Recalculate Prices');
            this.recalculatePrices();
        });
    }
    getBasketProducts(): Array<Product> {
        return Array.from(this.basketProducts.values());
    }
    getbasketProductsObservable(): BehaviorSubject<Array<Product>> {
        return this.basketProductsObservable;
    }
    getProductsCountObservable(): BehaviorSubject<number> {
        return this.productsCountObservable;
    }
    getProductsSum(): number {
        return this.productsSum;
    }
    getProductsSumObservable(): BehaviorSubject<number> {
        return this.productsSumObservable;
    }

    countOfProduct(product: Product): number {
        if (!this.basketProducts.has(product.id)) { return 0 }
        return this.basketProducts.get(product.id).count;
    }

    getPriceForProduct(product: Product): number {
        if (this.priceForProduct.has(product.id)) {
            return this.priceForProduct.get(product.id)
        } else {
            return product.price;
        }
    }

    addOne(product: Product) {
        if (this.basketProducts.has(product.id) == false) {
            let newBasketProduct = { id: product.id,
                name: product.name,
                description: product.description,
                category: product.category,
                count: 0,
                price: product.price,
                imageUrl: product.imageUrl,
                promotionId: product.promotionId };
            this.basketProducts.set(newBasketProduct.id, newBasketProduct);
        }
        if (product.count > 0) {
            this.basketProducts.get(product.id).count += 1
            product.count -= 1
            this.recalculateBasket()
        }
    }
    removeOne(product: Product, withDelete: Boolean) {
        if (this.basketProducts.has(product.id)) {
            this.basketProducts.get(product.id).count -= 1
            product.count += 1    
            if ((this.basketProducts.get(product.id).count == 0) && (withDelete == true)) {
                this.basketProducts.delete(product.id);
            }
        }
        this.recalculateBasket()
    }

    addOneFromBasket(product: Product) {
        var originalProductIndex = this.allProducts.findIndex(element => {
            return element.id == product.id
        });
        if (this.allProducts[originalProductIndex].count > 0) {
            product.count += 1;
            this.allProducts[originalProductIndex].count -= 1;
        }
        this.recalculateBasket()
    }
    removeOneFromBasket(product: Product) {
        if (product.count > 0) {
            product.count -= 1
            var originalProductIndex = this.allProducts.findIndex(element => {
                return element.id == product.id
            });
            this.allProducts[originalProductIndex].count += 1
        }
        this.recalculateBasket()
    }
    deleteFormBasket(product: Product) {
        if (this.basketProducts.has(product.id)) {
            let tempProduct = this.basketProducts.get(product.id);
            let originalProduct = this.allProducts.find(element => {
                return element.id == product.id;
            });
            originalProduct.count += tempProduct.count;
            tempProduct.count = 0;
            this.basketProducts.delete(product.id);
        }
        this.recalculateBasket()
    }
    buyProducts() {
        let productsToBuy = this.allProducts.filter(element => {
            return this.basketProducts.has(element.id);
        })
        productsToBuy.forEach(element => {
            let countToLeft = element.count;
            this.deleteFormBasket(element);
            this.productsService.buyProduct(element, countToLeft);
        });
    }
    private recalculateBasket() {
        var totalCount = 0;
        var totalSum = 0;
        let products = Array.from(this.basketProducts.values());
        products.forEach(product => {
            totalCount += product.count;
            let productPrice = this.priceForProduct.get(product.id);
            totalSum += (product.count * productPrice);           
        });
        this.productsCount = totalCount;
        this.productsSum = totalSum;
        this.productsCountObservable.next(this.productsCount);
        this.productsSumObservable.next(this.productsSum);
        this.basketProductsObservable.next(products);
    }
    private recalculatePrices() {
        this.priceForProduct.clear
        this.allProducts.forEach(product => {
            if (product.promotionId != null) {
                console.log('try to get promotion')
                let promotion = this.promotionsService.getPromotionById(product.promotionId);
                console.log('promotion gotten')
                if (promotion != null) {
                    console.log('promotionExist')
                    this.priceForProduct.set(product.id, product.price*(1-(promotion.discount/100)))
                } else {
                    console.log('promotion notExist')
                    this.priceForProduct.set(product.id, product.price)
                }
            } else {
                this.priceForProduct.set(product.id, product.price)
            }
        });
        this.recalculateBasket();
    }
}