"use client";

import { useState, useEffect } from "react";
import {
  fetchTransactions,
  fetchGoals,
  fetchTotalCashFlow,
  fetchDashboardAnalytics,
} from "@/features/dashboard/services/dashboard.services";
import type {
  Transactions,
  Goals,
  Total,
  Analytics,
} from "@/features/dashboard/types/dashboard.types";
import { SectionCards } from "@/features/dashboard/components/cards/section-cards";
import StackedAreaChart from "@/features/dashboard/components/rechart/stacked-area-chart";
import ShapePieChart from "@/features/dashboard/components/rechart/pie-chart";
import { TableTranscation } from "@/features/dashboard/components/table/transactions-table";
import SectionGoal from "@/features/dashboard/components/table/section-goal";

export default function page() {
  const [transaction, setTransaction] = useState<Transactions>([]);
  const [goal, setGoal] = useState<Goals>([]);
  const [total, setTotal] = useState<Total>({
    total_income: 0,
    total_expense: 0,
    balance: 0,
  });
  const [analytics, setAnalytics] = useState<Analytics>({ trend: [], pie: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const [total, analytics, transactions, goals] = await Promise.all([
          fetchTotalCashFlow(),
          fetchDashboardAnalytics(),
          fetchTransactions(5),
          fetchGoals(4),
        ]);
        setTransaction(transactions.data);
        setGoal(goals.data);
        setTotal(total.data);
        setAnalytics(analytics.data);
      } catch (error) {
        console.error("❌ ดึงข้อมูลพลาด:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 ">
      <div className="text-5xl py-2">
        <h1>Overview</h1>
      </div>
      <SectionCards data={total} loading={isLoading} />
      <div className="grid gap-4 lg:grid-cols-2">
        <StackedAreaChart trendData={analytics.trend} loading={isLoading} />
        <ShapePieChart pieData={analytics.pie} loading={isLoading} />
        <TableTranscation data={transaction} loading={isLoading} />
        <SectionGoal data={goal} loading={isLoading} />
      </div>
    </div>
  );
}
