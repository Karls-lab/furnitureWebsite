import { Badge } from "@/components/ui/badge";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from './firebase.ts';
import { collection, getDocs, where, query } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import { notify } from "./utils/toast.jsx";


const Store = () => {
  const navigate = useNavigate();
  const [furnitureData, setFurnitureData] = useState([]);
  const [user] = useAuthState(auth);
  const storage = getStorage();
    
  useEffect(() => {
    if (user) {
      try {
        getData();
      } catch {
        console.log("Error fetching data");
      }
    } 
  }, [user]);


  // Fetch table data from Firestore
  const getData = async () => {
    try {
        const snapShot = await getDocs(collection(db, 'furniture'));
        const data = snapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFurnitureData(data);
        localStorage.setItem('cachedData', JSON.stringify(data));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  // Add item to cart via local storage
  const addItemToCart = (item) => {
    console.log("Adding item to cart", item);
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    let updatedCart;

    // Check if the item already exists in the cart
    const existingItemIndex = existingCart.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      // If the item already exists, update the quantity
      updatedCart = existingCart.map((cartItem, index) => {
        if (index === existingItemIndex) {
          return { ...cartItem, amount: cartItem.amount + 1 }; 
        }
        return cartItem;
      });
    } else { // If the item does not exist, add it to the cart with initial amount of 1
      updatedCart = [...existingCart, { ...item, amount: 1 }];
    } // Save the updated cart to local storage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };


  return (
  <div className="w-full py-10 lg:py-30 text-white">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex gap-2 flex-col items-start">
          <div>
            <Badge>Our Store</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
              Browse our Selections!
            </h2>
            <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
              Please browse our selection of products. We have a wide variety
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {furnitureData.map((item) => (
            <div 
              key={item.id} 
              onClick={() => addItemToCart(item)} 
              className="flex flex-col gap-2 hover:bg-gray-800 p-2 
                rounded-lg bg-highlight justify-center">
                <div className="flex bg-muted rounded-md aspect-video mb-2 align-middle m-auto"
                  style={{ height: "300px", width: "300px"}}>
                  <img src={item.image} alt={item.name} 
                    className="object-cover rounded-md m-auto" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl tracking-tight mt-50">{item.name}</h3>
                  <p className="text-muted-foreground text-base">{item.description}</p>
                  <p className="text-lg font-bold mt-2">${item.price}</p>
                </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  </div>
  );
};


export default Store;
