import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { SortType } from '../models/sortType';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class ProductsService {
    // Sorting Type Properties
    public allSortingTypes: Array<SortType> = [
        { title: 'Price Low to top', matSortable: { id: 'price', start: 'asc', disableClear: false } },
        { title: 'Price Top to Low', matSortable: { id: 'price', start: 'desc', disableClear: false } }, 
        { title: 'Name Ascending', matSortable: { id: 'name', start: 'asc', disableClear: false } }, 
        { title: 'Name Descending', matSortable: { id: 'name', start: 'desc', disableClear: false } } 
    ];
    public selectedSortingType: SortType = { title: 'Price Low to top', matSortable: { id: 'price', start: 'asc', disableClear: false } };
    allSortingTypesObservable = new BehaviorSubject(this.allSortingTypes);
    selectedSortingTypeObservable = new BehaviorSubject(this.selectedSortingType);
    // Catagoties Type Properties
    private allCategories: Map<String, boolean> = new Map();
    allCategoriesObservable = new BehaviorSubject(this.allCategories);
    // Count Range Properties
    private selectedCountRange: { minValue: number, maxValue: number } | null = null;
    selectCountRangeObservable = new BehaviorSubject(this.selectedCountRange);
    // Price Range Properties
    private selectedPriceRange: { minValue: number, maxValue: number } | null = null;
    selectPriceRangeObservable = new BehaviorSubject(this.selectedPriceRange);
    // Products All/Sorting Properties
    private allProducts: Array<Product> = [];
    private sortedProducts: Array<Product> = this.allProducts;
    allProductsObservable = new BehaviorSubject(this.allProducts);
    sortedProductsObservable = new BehaviorSubject(this.sortedProducts);

    private allProductsQuery: AngularFireList<Product> 
    constructor(fireDatabase: AngularFireDatabase) { 
        this.allProductsQuery = fireDatabase.list<Product>('products')
        this.allProductsQuery.valueChanges().subscribe(databaseProducts => {
            this.allProducts = databaseProducts;
            this.allProductsObservable.next(databaseProducts);
            if (this.selectedPriceRange == null) {
                this.selectedPriceRange = {'maxValue' : this.maxPrice(), 'minValue' :  this.minPrice()}
                this.selectPriceRangeObservable.next(this.selectedPriceRange)
            }
            if (this.selectedCountRange == null) {
                this.selectedCountRange = {'maxValue' : this.maxCount(), 'minValue' :  this.minCount()};
                this.selectCountRangeObservable.next(this.selectedCountRange)
            }
            this.sortFilterProducts();
        });
        this.allCategories.set('Smartphones', true);
        this.allCategories.set('Laptops', true);
        this.allCategories.set('Monitors', true);
        this.allCategories.set('Accessories', true);
    }
    // Categories
    getAllCategories(): BehaviorSubject<Map<String, boolean>> {
        return this.allCategoriesObservable;
    }
    selectCategory(category: String): void {
        this.allCategories.set(category, true);
        this.allCategoriesObservable.next(this.allCategories)
        this.sortFilterProducts();
    }
    deselectCategory(category: String): void {
        this.allCategories.set(category, false);
        this.allCategoriesObservable.next(this.allCategories)
        this.sortFilterProducts();
    }
    // Count Range
    maxCount(): number {
        if (this.allProducts.length <= 0) { return 0 }
        var maxCount = this.allProducts[0].count
        this.allProducts.forEach(element => {
            if (maxCount < element.count) { maxCount = element.count; }
        });
        return maxCount;
    }
    minCount(): number {
        if (this.allProducts.length <= 0) { return 0 }
        var minCount = this.allProducts[0].count
        this.allProducts.forEach(element => {
            if (minCount > element.count) { minCount = element.count; }
        });
        return minCount;
    }
    getSelectedCountRangeObservable(): BehaviorSubject<{minValue: number, maxValue: number}> {
        return this.selectCountRangeObservable;
    }
    setCountRange(minCount: number, maxCount: number) {
        if (this.selectedCountRange == null) { return }
        this.selectedCountRange.maxValue = maxCount;
        this.selectedCountRange.minValue = minCount;
        this.selectCountRangeObservable.next(this.selectedCountRange);
        this.sortFilterProducts();
    }
    // Price Range
    maxPrice(): number {
        if (this.allProducts.length <= 0) { return 0 }
        var maxPrice = this.allProducts[0].price;
        this.allProducts.forEach(element => {
            if (maxPrice < element.price) { maxPrice = element.price; }
        });
        return maxPrice;
    }
    minPrice(): number {
        if (this.allProducts.length <= 0) { return 0 }
        var minPrice = this.allProducts[0].price;
        this.allProducts.forEach(element => {
            if (minPrice > element.price) { minPrice = element.price; }
        });
        return minPrice;
    }
    getSelectedPriceRangeObservable(): BehaviorSubject<{minValue: number, maxValue: number}> {
        return this.selectPriceRangeObservable;
    }
    setPriceRange(minPrice: number, maxPrice: number) {
        if (this.selectedPriceRange == null) { return }
        this.selectedPriceRange.maxValue = maxPrice;
        this.selectedPriceRange.minValue = minPrice;
        this.selectPriceRangeObservable.next(this.selectedPriceRange);
        this.sortFilterProducts();
    }
    // Products
    getAllProductsObservable(): BehaviorSubject<Product[]> {
        return this.allProductsObservable;
    }
    getSortedFilteredProducts(): BehaviorSubject<Product[]> {
        return this.sortedProductsObservable;
    }
    private sortFilterProducts() {
        this.sortedProducts = this.allProducts.filter((element, index, array) => {
            // Check Category
            if (this.allCategories.has(element.category)) {
                // We have this category
                if (this.allCategories.get(element.category) == false) {
                    // Category disabled
                    return false;    
                }
            } else {
                // We don't have this category
                return false;
            }
            //Check Count
            if (this.selectedCountRange != null) {
                if (!(element.count >= this.selectedCountRange.minValue 
                    && element.count <= this.selectedCountRange.maxValue)) {
                    return false;
                }
            }
            //Check Price
            if (this.selectedPriceRange != null) {
                if (!(element.price >= this.selectedPriceRange.minValue 
                    && element.price <=this.selectedPriceRange.maxValue)) {
                    return false;
                }
            }
            return true;
        });
        this.sortedProductsObservable.next(this.sortedProducts);
    }
    buyProduct(product: Product, countLeft: number) {
        var updateProd: Product = product;
        updateProd.count = countLeft;
        this.allProductsQuery.update(updateProd.id, updateProd)
    }
}