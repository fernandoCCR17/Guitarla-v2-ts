import { useEffect, useMemo, useState } from "react";
import { db } from "../data/db";
import type { CartItem, Guitar } from "../types";

export function useCart(){
    const initialCart = (): CartItem[] => {
        const localStorageCart = localStorage.getItem("cart");

        return localStorageCart ? JSON.parse(localStorageCart) : [];
    }

    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart);
    const MIN_ITEMS = 1

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart])

    function addToCart(item: Guitar){
        const itemExists = cart.findIndex(guitar => guitar.id === item.id);
        if(itemExists >= 0){
            if(cart[itemExists].quantity >= 5) return
            const updatedCart = [...cart];
            updatedCart[itemExists].quantity++;
            setCart(updatedCart);
        }else{
            const newItem : CartItem = {...item, quantity : 1}
            setCart([...cart, newItem]);
        }

    }

    function removeFromCart(idGuitar: Guitar['id']){
        const newCart = cart.filter(item => item.id != idGuitar);
        setCart(newCart);
    }

    function incrementQuantity(idGuitar: Guitar['id']){
        const itemIndex = cart.findIndex(guitar => guitar.id === idGuitar);
        const updatedCart = [...cart];
        updatedCart[itemIndex].quantity++;
        setCart(updatedCart);
    }

    function decrementQuantity(idGuitar: Guitar['id']){
        const itemIndex = cart.findIndex(guitar => guitar.id === idGuitar);
        const updatedCart = [...cart];

        if(updatedCart[itemIndex].quantity <= MIN_ITEMS) return
        updatedCart[itemIndex].quantity--;
        setCart(updatedCart);
    }

    function cleanCart(){
        setCart([]);
    }

    //State Derivado
    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((acc, current) => acc + (current.quantity * current.price), 0), [cart]);


    return {
        cart,
        data,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        cleanCart,
        isEmpty,
        cartTotal
    }
}