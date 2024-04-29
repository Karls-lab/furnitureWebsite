import React, { useState, useEffect } from 'react';
import { collection, getDocs, where, query } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from './firebase.ts';
import { useNavigate } from 'react-router-dom';
import { DataTable } from "./types/dataTable";
import { orderColumns } from './types/order.tsx'; // Define your Order type here
import '../app/style.css';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"



const UserOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [user] = useAuthState(auth);

    // Get data from local storage if available
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
          const q = query(collection(db, 'orders'), where('customer_id', '==', user.uid)); 
          const snapShot = await getDocs(q);
          const data = snapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          data.forEach(item => console.log(`ID: ${item.id}`));
          setOrders(data);
          console.log(`DATA returned: ${data}`);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


  // Render no orders
  if (orders.length === 0) {
    return (
      <div className="max-w-4xl text-white mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
        <p>No Orders</p>
      </div>
    );
  }
 
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={orderColumns} data={orders} userRole=''/>
    </div>
  );

};

export default UserOrders;
