import { Product } from "./product.model";

export class Order {
    id: string;
    clientFirstName: string;
    clientLastName: string;
    email: string;
    telephone: string;
    addres: string;
    city: string;
    state: string;
    postalCode: string;
    shipingType: string;
    category: string;
    products: Product[];
    completness: boolean[];
    totalSum: number;
}