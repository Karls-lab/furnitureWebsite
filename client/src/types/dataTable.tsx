import React from "react";
import '../../app/style.css';
// @ts-ignore
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
// @ts-ignore
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  userRole: string; // Add userRole prop
  onStatusChange: (id: string, newStatus: string) => void;
  onDelete: (id: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  userRole, // Destructure userRole from props
  onStatusChange, // pass this function back to the parent component
  onDelete, // deletes the order
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    console.log(`Order ID: ${orderId}, New Status: ${newStatus}`);
    onStatusChange(orderId, newStatus); // Call the onStatusChange function
  }

  const handleDelete = (orderId: string) => {
    onDelete(orderId);
  }




  return (
    <div>
      <div className="border border-solid border-2 rounded-lg p-4 text-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}

                  {/* Conditional rendering of dropdown menu and update button */}
                  {userRole === "Editor" && (
                      <TableCell className='flex gap-2'>
                            <select
                              className="text-white p-2 rounded-md" // Add background color style here
                              defaultValue={(row.original as { status: string })?.status}
                              onChange={(e) => {
                                if (typeof row.original === 'object' && row.original !== null && 'status' in row.original) {
                                  row.original.status = e.target.value;
                                }
                              }}
                            >
                              <option value="" disabled hidden>
                                Select Status
                              </option>
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Completed">Completed</option>
                            </select>

                          {/* Update button */}
                          <button 
                            onClick={() =>  {
                              console.log(row.original);
                              handleStatusChange(
                              (row.original as { id: string }).id, 
                              (row.original as { status: string }).status
                            )}}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                          > Update
                          </button>
                          
                          {/* Delete Button */}
                          <button 
                            onClick={() =>  {
                              console.log(row.original);
                              handleDelete(
                              (row.original as { id: string }).id
                            )}}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                          > Delete
                          </button>

                      </TableCell>

                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="text-white border-white"
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="text-white border-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
