import { PropsWithChildren, createContext, useContext, useState } from "react";
import { CardItem, Tables } from "../types";
import { randomUUID } from "expo-crypto";
import { useInsertOrder } from "../api/orders";
import { useRouter } from "expo-router";
import { useAuth } from "./AuthProvider";
import { useInsertOrderItems } from "../api/order_items";
import { initialisePaymentSheet, openPaymentSheet } from "../lib/stripe";
type Product = Tables<'products'>

type CartType = {
    items: CardItem[],
    addItem: (product: Product, size: CardItem['size']) => void;
    updateQuantity: (itemID: string, amount: -1 | 1) => void;
    total: number;
    checkout: () => void;
}

const CartContext = createContext<CartType>({
    items: [],
    addItem: () => { },
    updateQuantity: () => { },
    total: 0,
    checkout: () => { }
});

const CartProvider = ({ children }: PropsWithChildren) => {

    const [items, setItems] = useState<CardItem[]>([]);
    const { mutate: insertOrder } = useInsertOrder();
    const { mutate: insertOrderItems } = useInsertOrderItems();
    const clearCart = () => {
        setItems([]);
    }
    const router = useRouter();

    const addItem = (product: Product, size: CardItem['size']) => {
        // if already in cart, increment quantity
        const existingItem = items.find(item => item.product === product && item.size === size);
        if (existingItem) {
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

    const total = items.reduce((sum, item) => (sum += item.product.price * item.quantity), 0);
    const { session } = useAuth();
    const userID = session?.user.id;
    const checkout = async () => {
        // convert to integer cause stripe use pennies or cent
        await initialisePaymentSheet(Math.floor(total * 100));
        const payed = await openPaymentSheet();
        if(!payed){
            return;
        }
        insertOrder(
            { total, user_id: userID ?? '' },
            {
                onSuccess: saveOrderItems
            });
    }

    const saveOrderItems = (order: Tables<'orders'>) => {
        const orderItems = items.map(cartItem => ({
            order_id: order.id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            size: cartItem.size
        }));
        insertOrderItems(
            orderItems,
            {
                onSuccess: () => {
                    clearCart();
                    router.back();
                }
            })
    }
    return (
        <CartContext.Provider value={{ items, addItem, updateQuantity, total, checkout }}>
            {children}
        </CartContext.Provider>
    );

}

export default CartProvider;

export const useCart = () => useContext(CartContext);