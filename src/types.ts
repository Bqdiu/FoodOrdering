export type Product = {
    id : number;
    image : string | null;
    name : string;
    price : number;
};

export type PizzaSize = 'S' | 'M' | 'L' | 'XL';

export type CardItem = {
    id : string;
    product : Product;
    product_id : number;
    size : PizzaSize;
    quantity : number;
};