"use client";

import { useState, useEffect } from "react";
import { SectionHeader } from "@/features/transactions/components/sections/section-header";
import { SectionCards } from "@/features/transactions/components/sections/section-cards";
import { SectionCategories } from "@/features/transactions/components/sections/section-categories";
import { DataTable } from "@/features/transactions/components/table/data-table";
import { SectionPagination } from "@/features/transactions/components/sections/section-pagination";
import { columns } from "@/features/transactions/components/table/colums";

import {
  fetchCount,
  fetchTotalCashFlow,
  fetchTransactions,
} from "@/features/transactions/services/transaction.services";

export default function page() {
  const [count, setCount] = useState<any>({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  });
  const [total, setTotal] = useState<any>({ number: 0 });
  const [transactions, setTransactions] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [total, count, transaction] = await Promise.all([
          fetchTotalCashFlow(),
          fetchCount(),
          fetchTransactions(10),
        ]);
        setTotal(total.data);
        setCount(count.data);
        setTransactions(transaction.data);
      } catch (error) {
        console.error("❌ ดึงข้อมูลพลาด:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex flex-1 flex-col gap-4 p-4 ">
        <SectionHeader />
        <SectionCards data={total} count={count} loading={isLoading} />
        <SectionCategories />
        <DataTable columns={columns} data={transactions} />
        <SectionPagination />
      </div>
    </div>
  );
}
