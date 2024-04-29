import { ColumnDef } from "@tanstack/react-table"
import React from "react";

interface Order {
  id: string;
  customer_id: string;
  user_email: string;
  items: any[]; // Assuming an array of items of any type
  date: string;
  status: "Pending" | "Building" | "Done";
  total: number;
}

const initialOrder: Order = {
  id: '',
  customer_id: '',
  user_email: '',
  items: [],
  date: '',
  status: 'Pending',
  total: 0,
};

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "user_email",
    header: "Email",
  },
  {
    accessorKey: "total",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const total = parseFloat(row.getValue("total"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(total)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
]


export { Order };

