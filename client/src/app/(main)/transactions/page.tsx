"use client";

import { useState, useEffect, useCallback } from "react";
import { SectionHeader } from "@/features/transactions/components/sections/section-header";
import { SectionCards } from "@/features/transactions/components/sections/section-cards";
import { SectionCategories } from "@/features/transactions/components/sections/section-categories";
import { DataTable } from "@/features/transactions/components/table/data-table";
import { SectionPagination } from "@/features/transactions/components/sections/section-pagination";
import { getColumns } from "@/features/transactions/components/table/colums";

import {
  fetchSummaryCashFlow,
  fetchTransactions,
  fetchAccounts,
  fetchCatogories,
} from "@/features/transactions/services/transaction.services";

import type {
  Total,
  Transaction,
  Pagination,
  Accounts,
  Categories,
} from "@/features/transactions/types/transaction.types";

export default function TransactionPage() {
  const [summary, setSummary] = useState<Total>({ number: 0 });
  const [account, setAccount] = useState<Accounts[]>([]);
  const [type, setType] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [refresh, setRefresh] = useState<number>(0);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [categoryList, setCategoryList] = useState<Categories[]>([]);
  const [categoryId, setCategoryId] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [summary, transaction, account, categories] = await Promise.all([
          fetchSummaryCashFlow(),
          fetchTransactions({ type, categoryId, page, search, limit: 10 }),
          fetchAccounts(),
          fetchCatogories(),
        ]);

        setSummary(summary.data);
        setAccount(account.data);
        setTransactions(transaction.data);
        setPagination(transaction.pagination);
        setCategoryList(categories.data);
      } catch (error) {
        console.error(" ดึงข้อมูลพลาด:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [type, categoryId, page, search, refresh]);

  const handleRefresh = useCallback(() => {
    setRefresh((prev) => prev + 1);
  }, []);

  const handleSearch = useCallback((keyword: string) => {
    setSearch(keyword);
    setPage(1);
  }, []);

  const handleTypeChange = useCallback((newType: string) => {
    setType(newType);
    setPage(1);
  }, []);

  const handleCategoryIdChange = useCallback((newCategoryId: string) => {
    setCategoryId(newCategoryId);
    setPage(1);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 ">
      <SectionHeader
        categoryList={categoryList}
        accountList={account}
        onRefresh={handleRefresh}
      />
      <SectionCards data={summary} loading={isLoading} />
      <SectionCategories
        type={type}
        onTypeChange={handleTypeChange}
        categoryId={categoryId}
        onSearch={handleSearch}
        onCategoryIdChange={handleCategoryIdChange}
        categoryList={categoryList}
      />
      <DataTable
        columns={getColumns({
          categoryList,
          account,
          onRefresh: handleRefresh,
        })}
        data={transactions}
        loading={isLoading}
      />
      <SectionPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
