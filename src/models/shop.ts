import { Product } from './product';

export class Shop {
    shopId: string;
    name: string;
    city: string;
    address: string;
    specifications: Array<string>;
    website: string;
    products: Array<string>;
}