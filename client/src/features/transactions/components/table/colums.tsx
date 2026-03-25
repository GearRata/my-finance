"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transaction = {
  type: string;
  category: string;
  page: number;
  search: string;
  limit: number;
};

export const columns: ColumnDef<Transaction>[] = [
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
