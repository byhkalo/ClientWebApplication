import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/services/product.service';
import { Options, LabelType } from 'ng5-slider';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  categories: Map<String, boolean>;
  categoriesArray: Array<String>;
  
  maxCount: number = 0;
  minCount: number = 0;
  countRange: {minValue: number, maxValue: number} | null = null

  minPrice: number = 0;
  maxPrice: number = 0;
  priceRange: {minValue: number, maxValue: number} | null = null

  pagination: number;
  paginationTypes: Array<number>;

  optionsCount: Options = {
    floor: this.minCount,
    ceil: this.maxCount,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          this.countRange.minValue = value;
          this.productsService.setCountRange(value, this.countRange.maxValue);
          return '<b>'+ value + '</b>';
        case LabelType.High:
          this.countRange.maxValue = value;
          this.productsService.setCountRange(this.countRange.minValue, value);
          return '<b>'+ value + '</b>';
        default:
          return '' + value;
      }
    },
    getSelectionBarColor: (value: number): string => {
      return '#3f51b5';
    },
    getPointerColor: (value: number): string => {
      return '#3f51b5';
    }
  };
  optionsPrice: Options = {
    floor: this.minPrice,
    ceil: this.maxPrice,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          this.priceRange.minValue = value;
          this.productsService.setPriceRange(value, this.priceRange.maxValue);
          return '<b>'+ value + 'zł</b>';
        case LabelType.High:
          this.priceRange.maxValue = value;
          this.productsService.setPriceRange(this.priceRange.minValue, value);
          return '<b>'+ value + 'zł</b>';
        default:
          return value + 'Zł';
      }
    },
    getSelectionBarColor: (value: number): string => {
      return '#3f51b5';
    },
    getPointerColor: (value: number): string => {
      return '#3f51b5';
    }
  };

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.productsService.getAllCategories().subscribe(allCategories => {
      this.categories = allCategories;
      this.categoriesArray = Array.from(allCategories.keys());
    });
    this.productsService.getSelectedCountRangeObservable().subscribe(countRange => {
      if (countRange != null) {
        this.maxCount = this.productsService.maxCount();
        this.minCount = this.productsService.minCount();
        this.countRange = countRange
        this.optionsCount.floor = this.minCount;
        this.optionsCount.ceil = this.maxCount;
      }
    });
    this.productsService.getSelectedPriceRangeObservable().subscribe(priceRange => {
      if (priceRange != null) {
        this.minPrice = this.productsService.minPrice();
        this.maxPrice = this.productsService.maxPrice();
        this.priceRange = priceRange;
        this.optionsPrice.floor = this.minPrice;
        this.optionsPrice.ceil = this.maxPrice;
      }
    });
  }

  togleCategory(category: string) {
    this.categories.set(category, !this.categories.get(category))
    this.changeCategory(category, this.categories.get(category))
  }

  changeCategory(category: String, value: boolean) {
    if (value) {
      this.productsService.selectCategory(category);
    } else {
      this.productsService.deselectCategory(category);
    }
  }
}
