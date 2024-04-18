// This file will contain a list of customer orders. 
// Orders will be sorted by status, with 'pending' orders at the top of the list.
// 'Editors' (Matt Milne) will be able to confirm orders and mark them as 'completed'.

import React, { useState, useEffect } from 'react';
import { collection, getDocs, where, query } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from './firebase.ts';
import { useNavigate } from 'react-router-dom';
import '../app/style.css';

const Orders = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [user] = useAuthState(auth);

    // Get data from local storage if available
    useEffect(() => {
        console.log(`user: ${user}`);
        const cachedData = localStorage.getItem('cachedData');
        if (cachedData) {
            setData(JSON.parse(cachedData));
        } else {
            getData();
        }
    }, [user]);


    // Fetch table data from Firestore
    const getData = async () => {
        try {
            const snapShot = await getDocs(collection(db, 'furniture'));
            const data = snapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(data);
            console.log(`DATA returned: ${data}`);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
}

export default Orders;
