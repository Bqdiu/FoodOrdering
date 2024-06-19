import { PropsWithChildren, createContext, useContext, useState } from "react";
import { CardItem, Product } from "../types";

type CartType = {
    items: CardItem[],
    addItem: (product: Product, size: CardItem['size']) => void;
}

const CartContext = createContext<CartType>({
    items: [],
    addItem: () => {}
});

const CartProvider = ({children}: PropsWithChildren) =>{

    const [items, setItems] = useState<CardItem[]>([]);

    const addItem = (product: Product, size: CardItem['size']) =>{
        const newCartItem : CardItem = {
            id: '1',
            product,
            product_id : product.id,
            size,
            quantity: 1
        }
        setItems([newCartItem, ...items]);
    }

    return (
        <CartContext.Provider value={{ items, addItem }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider;

export const useCart = () => useContext(CartContext);