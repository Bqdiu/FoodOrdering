import { PropsWithChildren, createContext, useContext, useState } from "react";
import { CardItem, Product } from "../types";
import { randomUUID } from "expo-crypto";

type CartType = {
    items : CardItem[],
    addItem: (product: Product, size: CardItem['size']) => void;
    updateQuantity: (itemID: string, amount: -1 | 1) => void;
}

const CartContext = createContext<CartType>({
    items: [],
    addItem: () => {},
    updateQuantity: () => {}
});

const CartProvider = ({children} : PropsWithChildren) => {
    
    const [items, setItems] = useState<CardItem[]>([]);

    const addItem = (product: Product, size: CardItem['size']) => {
        // if already in cart, increment quantity
        const existingItem = items.find(item => item.product === product && item.size === size);
        if(existingItem){
            updateQuantity(existingItem.id, 1);
            return;
        } 
        
        const newCartItem: CardItem = {
            id: randomUUID(), // generate random id
            product,
            product_id: product.id,
            size,
            quantity: 1
        }
        setItems([newCartItem, ...items]);
    }

    // updateQuantity
    const updateQuantity = (itemID: string, amount: -1 | 1) => {
        setItems(items.map((item) =>
            item.id !== itemID ? item : { ...item, quantity: item.quantity + amount }
        ).filter((item) => item.quantity > 0));
    };

    return (
      <CartContext.Provider value={{items, addItem, updateQuantity }}>
        {children}
      </CartContext.Provider>  
    );
}

export default CartProvider;

export const useCart = () => useContext(CartContext);