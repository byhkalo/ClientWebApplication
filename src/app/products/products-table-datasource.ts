import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Product } from 'src/models/product.model';

const imageUrl = 'https://store.storeimages.cdn-apple.com/4667/as-images.apple.com/is/image/AppleInc/aos/published/images/i/ph/iphone7/rosegold/iphone7-rosegold-select-2016?wid=470&hei=556&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1472430205982'
// TODO: replace this with real data from your application


export class ProductsTableDS extends MatTableDataSource<Product> {
  constructor(data: Product[], paginator: MatPaginator, sort: MatSort) {
    let source: Product[] = [];
    if (data != null) {
      source = data;
    }
    super(source)
    this.sort = sort;
    this.paginator = paginator;
  }
}
