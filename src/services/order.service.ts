import { Injectable } from "@angular/core";
import { BasketService } from "./basketService";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Order } from "src/models/order.model";


@Injectable({providedIn: "root"})
export class OrderService {

    private ordersQuery: AngularFireList<Order>

    constructor(private fireDatabase: AngularFireDatabase, private basketService: BasketService) {
        this.ordersQuery = fireDatabase.list<Order>('orders/unmanaged')
    }

    createOrder(firstName: string, lastName: string, email: string, telephone: string, 
        addres: string, city: string, state: string, postalCode: string, shipingType: string) {
        let products = this.basketService.getBasketProducts()
        products.forEach(element => { 
            element.price = this.basketService.getPriceForProduct(element);
        })
        var completness: Array<boolean> = products.map(el => {
            return false;
        });
        let totalSum = this.basketService.getProductsSum()

        var newOrder = new Order();
        newOrder.id = this.fireDatabase.createPushId();
        newOrder.clientFirstName = firstName;
        newOrder.clientLastName = lastName;
        newOrder.email = email;
        newOrder.telephone = telephone;
        newOrder.addres = addres;
        newOrder.city = city;
        newOrder.state = state;
        newOrder.postalCode = postalCode;
        newOrder.shipingType = shipingType;
        newOrder.category = "Unmanaged";
        newOrder.products = products;
        newOrder.completness = completness;
        newOrder.totalSum = totalSum;
        this.ordersQuery.update(newOrder.id, newOrder);
        this.basketService.buyProducts()
    }
}