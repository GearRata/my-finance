"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "transaction_date",
    header: "Date",
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    accessorKey: "categories.name",
    header: "Category",
  },
  {
    accessorKey: "categories.type",
    header: "Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];
