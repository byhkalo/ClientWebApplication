import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainShopComponentComponent } from './main-shop-component/main-shop-component.component';
import { BasketComponent } from './basket/basket.component';

const routes: Routes = [
  { path: '', component: MainShopComponentComponent},
  { path: 'basket', component: BasketComponent},
  { path: "**", redirectTo: '', pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
