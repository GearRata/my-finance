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
  fetchCatogories,
} from "@/features/transactions/services/transaction.services";

import type {
  Count,
  Total,
  fetchTransaction,
  Pagination,
  Categories,
} from "@/features/transactions/types/transaction.types";

export default function page() {
  const [count, setCount] = useState<Count>({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  });
  const [total, setTotal] = useState<Total>({ number: 0 });
  const [type, setType] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [transactions, setTransactions] = useState<fetchTransaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [categoryList, setCategoryList] = useState<Categories[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [total, count, transaction, categories] = await Promise.all([
          fetchTotalCashFlow(),
          fetchCount(),
          fetchTransactions({ type, category, page, search, limit: 10 }),
          fetchCatogories(),
        ]);

        setTotal(total.data);
        setCount(count.data);
        setTransactions(transaction.data);
        setPagination(transaction.pagination);
        setCategoryList(categories.data);
      } catch (error) {
        console.error("❌ ดึงข้อมูลพลาด:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [type, category, page, search]);

  const handleSearch = (keyword: string) => {
    setSearch(keyword);
    setPage(1);
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    setPage(1);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  };

  return (
    <div>
      <div className="flex flex-1 flex-col gap-4 p-4 ">
        <SectionHeader />
        <SectionCards data={total} count={count} loading={isLoading} />
        <SectionCategories
          type={type}
          onTypeChange={handleTypeChange}
          category={category}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          categoryList={categoryList}
        />
        <DataTable columns={columns} data={transactions} />
        <SectionPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
