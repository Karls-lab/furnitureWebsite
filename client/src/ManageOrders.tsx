import React, { useState, useEffect } from 'react';
import { collection, deleteDoc, getDocs, query, doc, updateDoc } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { Order, orderColumns } from './types/order.tsx'; // Define your Order type here
import '../app/style.css';
import { DataTable } from "./types/dataTable";

const ManageOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [user] = useAuthState(auth);
  const [customClaims, setCustomClaims] = useState<any>(null);


  useEffect(() => {
      if (user) {
          user.getIdTokenResult()
          .then((idTokenResult) => {
              setCustomClaims(idTokenResult.claims);
          })
          .catch((error) => {
              console.error("Error getting custom claims:", error);
          });
      }
  }, [user]);


  useEffect(() => {
      if (user) {
        try {
          getData();
        } catch {
          console.log("Error fetching data");
        }
      } 
    }, [user]);

  // Fetch orders data from Firestore
  const getData = async () => {
      try {
          const q = query(collection(db, 'orders'));
          const snapShot = await getDocs(q);
          const data = snapShot.docs.map(doc => ({ ...doc.data() })) as Order[]; // Omitting 'id' field
          console.log('Data:', data);
          setOrders(data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

  
    // Update order status in Firestore
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    console.log()
      try {
        await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
        getData(); // Refresh order data after updating
      } catch (error) {
          console.error('Error updating order status:', error);
      }
  };

  const deleteOrder = async (orderId: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to Delete ${orderId}?`);
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      getData(); // Refresh order data after deleting
    } catch (error) {
        console.error('Error deleting order:', error);
    }
  }

  // Render no orders
  if (orders.length === 0) {
    return (
      <div className="max-w-4xl text-white mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Manage Orders</h1>
        <p>No Orders</p>
        <p>{orders.length}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable 
        columns={orderColumns} 
        data={orders} 
        userRole={customClaims.role} 
        onStatusChange={updateOrderStatus} 
        onDelete={deleteOrder}
      />

    </div>

  );
};

export default ManageOrders;
