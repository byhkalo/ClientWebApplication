import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { Product } from 'src/models/product.model';
import { MatFormFieldModule, MatSelectModule, MatGridListModule, MatPaginatorModule, MatInputModule, MatSortModule, Sort, MatSortable } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { ProductsService } from 'src/services/product.service';
import { BehaviorSubject } from 'rxjs';
import { SortType } from 'src/models/sortType';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsTableDS } from './products-table-datasource';

class MockProductsService {
  mockProduct: Product;
  mockProducts: Array<Product>;
  mockCount = 10;
  mockSortedProductsObservable: BehaviorSubject<Array<Product>>;
  constructor() {
    this.mockProduct = new Product();
    this.mockProduct.id = "mockProduct.id";
    this.mockProduct.name = "name";
    this.mockProduct.description = "this.mockProduct.description";
    this.mockProduct.category = "category";
    this.mockProduct.count = 20;
    this.mockProduct.price = 10;
    this.mockProduct.imageUrl = "imageUrl";
    this.mockProduct.promotionId = "promotionId";
    this.mockProducts = [this.mockProduct];
    this.mockSortedProductsObservable =  new BehaviorSubject(this.mockProducts);
  }
  getSortedFilteredProducts(): BehaviorSubject<Array<Product>> {
    return this.mockSortedProductsObservable;
  }
  public selectedSortingType: SortType = { title: 'Price Low to top', matSortable: { id: 'price', start: 'asc', disableClear: false } };
  public allSortingTypes: Array<SortType> = [
    { title: 'Price Low to top', matSortable: { id: 'price', start: 'asc', disableClear: false } },
    { title: 'Price Top to Low', matSortable: { id: 'price', start: 'desc', disableClear: false } }, 
    { title: 'Name Ascending', matSortable: { id: 'name', start: 'asc', disableClear: false } }, 
    { title: 'Name Descending', matSortable: { id: 'name', start: 'desc', disableClear: false } } 
  ];
}

@Component({
  selector: 'app-product',
  template: ''
})
class MockProductComponent {
  @Input() product: Product;
}

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  let mockProductsService: MockProductsService

  beforeEach(async(() => {
    mockProductsService = new MockProductsService();

    TestBed.configureTestingModule({
      imports: [ MatFormFieldModule, FormsModule, MatSelectModule, MatGridListModule, MatPaginatorModule, 
        ReactiveFormsModule, MatInputModule, BrowserAnimationsModule, MatSortModule],
      declarations: [ MockProductComponent, ProductsComponent ]
    })
    .overrideComponent(ProductsComponent, {
      set: {
        providers: [ { provide: ProductsService, useValue: mockProductsService } ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;  
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();

    expect(component.dataSource).toBeTruthy();
    expect(component.presentedProducts).toEqual(mockProductsService.mockProducts);
    expect(component.sortingTitle).toEqual('Price Low to top');
  });

  it('subscribe service', () => {
    let spyOnService = spyOn(mockProductsService, 'getSortedFilteredProducts').and.callThrough();
    fixture.detectChanges();
    expect(spyOnService.calls.any()).toBe(true);
    expect(component.dataSource.data).toEqual(mockProductsService.mockProducts);
    expect(component.presentedProducts).toEqual(mockProductsService.mockProducts);
  });

  it('subscribe on data source', () => {
    fixture.detectChanges();
    
    let behObj = component.dataSource.connect();
    behObj.next([]);
    expect(component.presentedProducts).toEqual([]);

    behObj.next(mockProductsService.mockProducts);
    expect(component.presentedProducts).toEqual(mockProductsService.mockProducts);

  });

  it('subscribe on sort change', () => {
    fixture.detectChanges();

    let sort: Sort = { active: 'active', direction: 'asc' }
    component.sort.sortChange.emit(sort)
    expect(component.lastSort).toEqual(sort);
  });

  it('Sorting Changed', () => {
    fixture.detectChanges();

    let spyOnApply = spyOn(component, 'apply').and.callFake(()=>{});

    let event = { value: mockProductsService.selectedSortingType.title };
    let sortingValue: SortType = { title: 'Name Ascending', matSortable: { id: 'name', start: 'asc', disableClear: false } }
    
    component.sortingChanged(event);
    expect(spyOnApply.calls.any()).toBe(false);

    event.value = sortingValue.title;
    component.sortingChanged(event);
    expect(mockProductsService.selectedSortingType).toEqual(sortingValue);
    expect(component.sortingTitle).toEqual(sortingValue.title);
    expect(spyOnApply.calls.any()).toBe(true);

  });

  it('Apply sorting', () => {
    fixture.detectChanges();

    let empty: MatSortable = { id: '', start: 'asc', disableClear: false };
    let first = true;
    let serviceSortable = mockProductsService.selectedSortingType.matSortable;
    let spySort = spyOn(component.sort, 'sort').and.callFake((matSortable: MatSortable) => {
      if (first) {
        first = false;
        expect(matSortable).toEqual(empty);
      } else {
        expect(matSortable).toEqual(serviceSortable);
      }
    });

    component.apply();
    expect(component.sort.active).toEqual(serviceSortable.id);
    expect(component.sort.direction).toEqual(serviceSortable.start);
  });

  it('Apply Filtering', () => {
    fixture.detectChanges();
    let searchText = " ASd";
    component.applyFilter(searchText);
    expect(component.dataSource.filter).toEqual("asd")
  });

  it('Data Source Init', () => {
    let dataSource = new ProductsTableDS(null, null, null);
    expect(dataSource.data).toEqual([]);
  });

});
