import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "./firebase";
import { v4 as uuidv4 } from 'uuid';
import { collection, doc, setDoc, DocumentData, addDoc } from "firebase/firestore"; 
// @ts-ignore
import { notify } from "./utils/toast";
import { Order } from "./types/order";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  // @ts-ignore
} from "@/components/ui/table"

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  amount: number;
  image: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState<CartItem[]>([]);
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


  const getData = async () => {
    try {
      const data = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const deleteCart = () => {
    localStorage.removeItem('cart');
    setCartData([]);
  }


  const deleteCartItem = (item: CartItem) => {
    const confirmDelete = window.confirm(`Are you sure you want to Delete ${item.name}?`);
    if (!confirmDelete) return;
    const updatedCart = cartData.filter((cartItem) => cartItem.id !== item.id);
    setCartData(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }


  const incrementCartItem = (item: CartItem) => {
    const updatedCart = cartData.map((cartItem) => {
      if (cartItem.id === item.id) {
        return { ...cartItem, amount: cartItem.amount + 1 };
      }
      return cartItem;
    });
    setCartData(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }


  const decrementCartItem = (item: CartItem) => {
    if (item.amount === 1) {
      deleteCartItem(item);
      return;
    }
    const updatedCart = cartData.map((cartItem) => {
      if (cartItem.id === item.id) {
        return { ...cartItem, amount: cartItem.amount - 1 };
      }
      return cartItem;
    }).filter((cartItem) => cartItem.amount > 0);
    setCartData(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }


  const calcTotal = () => {
    return cartData.reduce((acc, item) => acc + item.amount * item.price, 0);
  }


  const addOrders = async () => {
    try {
      const data: Order = {
        id: '',
        customer_id: user?.uid ?? '',
        user_email: user?.email ?? '',
        items: cartData,
        date: new Date().toISOString(),
        status: 'Pending',
        total: calcTotal(),
      };

      // create a reference and assign the id field to the document
      const ordersRef = doc(collection(db, "orders"));
      // const ordersRef = collection(db, 'orders');
      console.log(`order id: ${ordersRef.id}`)
      data.id = ordersRef.id;
      await setDoc(ordersRef, data);

      console.log('Order added successfully');
      localStorage.removeItem('cart');
      setCartData([]);
      notify('Order added successfully', 'success');
      navigate('/my_orders');
    } catch (error) {
      console.error('Error adding order:', error);
    }
  }

  if (!cartData.length) {
    return (
      <div className="max-w-4xl text-white mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <p>No items in your cart</p>
      </div>
    );
  }

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

          <Table className="text-md">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              {/* Loop over Cart data items */}
              {cartData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <img src={item.image} alt={item.name} className="h-13" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-3">
                      <button
                        onClick={() => decrementCartItem(item)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                      > -
                      </button>
                      <span className="py-2">{item.amount}</span>
                      <button
                        onClick={() => incrementCartItem(item)}
                        className="px-4 py-2 bg-green-500 text-white rounded-md"
                      > +
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>${item.price}</span>
                  </TableCell>
                </TableRow>
              ))}

              {/* Display Total and checkout/delete button */}
              <TableRow>
                <TableCell colSpan={4} className="text-right">Total</TableCell>
                <TableCell>${calcTotal()}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell colSpan={5} className="flex gap-5 text-right">
                  <button
                    onClick={() => addOrders()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                  >Checkout
                  </button>
                  <button
                    onClick={deleteCart}
                    className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
                    >Clear Cart
                  </button>
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>

       </div>
      </div>
    </div>
  );
};

export default Cart;
