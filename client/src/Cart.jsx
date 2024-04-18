import { Badge } from "@/components/ui/badge";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from './firebase.ts';
import { collection, getDocs, where, query } from "firebase/firestore";
import { doc, setDoc, Timestamp } from "firebase/firestore"; 


const Cart = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);
  const [user] = useAuthState(auth);

  
  useEffect(() => {
    if (user) {
      try {
        getData();
      } catch {
        console.log("Error fetching data");
      }
    } 
  }, [user]);


  // Fetch shopping cart data from localstorage
  const getData = async () => {
      try {
          setCartData(JSON.parse(localStorage.getItem('cart')));
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

  const deleteCart = () => {
      localStorage.removeItem('cart');
      setCartData([]);
  }

  const deleteCartItem = (item) => {
    const confirmDelete = window.confirm(`Are you sure you want to Delete ${item.name}?`);
    if (!confirmDelete) return;
    const updatedCart = cartData.filter((cartItem) => cartItem.id !== item.id);
    setCartData(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  const incrementCartItem = (item) => {
    const updatedCart = cartData.map((cartItem) => {
      if (cartItem.id === item.id) {
        return { ...cartItem, amount: cartItem.amount + 1 };
      }
      return cartItem;
    });
    setCartData(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  const decrementCartItem = (item) => {
    if (item.amount === 1) {
      deleteCartItem(item);
      return;
    }
    const updatedCart = cartData.map((cartItem) => {
      if (cartItem.id === item.id) {
        return { ...cartItem, amount: cartItem.amount - 1 };
      }
      return cartItem;
    }
    ).filter((cartItem) => cartItem.amount > 0);
    setCartData(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }


  const calcTotal = () => {
    return cartData.reduce((acc, item) => acc + item.amount * item.price, 0);
  }


  const addOrders = async () => {
    try {
      const ordersRef = collection(db, 'orders');
      const docData = {
        user: user.email,
        orders: cartData,
        total: calcTotal(),
      };
      await setDoc(doc(ordersRef), docData);
      console.log('Order added successfully');
      localStorage.removeItem('cart');
      setCartData([]);
      navigate('/orders');
    } catch (error) {
      console.error('Error adding order:', error);
    }
  }


  // Render no items in Cart
  if (!cartData) {
    return (
      <div className="max-w-4xl text-white mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <p>No items in your cart</p>
      </div>
    );
  }
 
  // Render Cart
  return (
  <div className="w-full py-10 lg:py-30 text-white">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex gap-2 flex-col items-start">
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
              Your Shopping Cart
            </h2>
            <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
              Modify and Finalize your purchase
            </p>
          </div>


        </div>

        <div className="flex flex-wrap gap-2 max-w-screen-md">
          {cartData.map((item) => (
            <div 
              key={item.id} 
              onClick={() => addItemToCart(item)} 
              className="flex gap-3 w-full p-2 border-b-2">
                <h3 className="text-xl tracking-tight">{item.name}</h3>
                <p className="text-muted-foreground text-base">
                  {item.description}
                </p>
                <div className="ml-auto flex items-center">
                  <span className="mx-4">${item.price}</span>
                  <button onClick={() => decrementCartItem(item)} className="px-3 py-1 bg-red-500 text-white rounded-md">-</button>
                  <span className="mx-2">{item.amount}</span>
                  <button onClick={() => incrementCartItem(item)} className="px-3 py-1 bg-green-500 text-white rounded-md">+</button>
                </div>
                          
            </div>
          ))}

          <div className="flex justify-center items-center gap-5">
            <button 
              onClick={deleteCart} 
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
              >Clear Cart
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
              onClick={() => addOrders()}
              >Checkout
            </button>
            <h3 className="mt-4">Total: {calcTotal()}</h3>
          </div>

        </div>
      </div>
    </div>
  </div>
  );
};


export default Cart;

