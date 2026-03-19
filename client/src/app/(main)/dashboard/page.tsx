"use client";

import { useState, useEffect } from "react";
import {
  fetchTransactions,
  fetchGoals,
  fetchDashboardSummary,
  fetchDashboardAnalytics,
} from "@/features/dashboard/services/dashboard.services";
import type { Transactions } from "@/features/dashboard/types/dashboard.types";
import { SectionCards } from "@/features/dashboard/components/cards/section-cards";
import StackedAreaChart from "@/features/dashboard/components/rechart/stacked-area-chart";
import ShapePieChart from "@/features/dashboard/components/rechart/pie-chart";
import { TableTranscation } from "@/features/dashboard/components/table/transactions-table";
import SectionGoal from "@/features/dashboard/components/table/section-goal";

export default function page() {
  const [transaction, setTransaction] = useState<Transactions>([]);
  const [goal, setGoal] = useState<any>([]);
  const [total, setTotal] = useState<any>([]);
  const [analytics, setAnalytics] = useState<any>({ trend: [], pie: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [total, analytics, transactions, goals] = await Promise.all([
          fetchDashboardSummary(),
          fetchDashboardAnalytics(),
          fetchTransactions(5),
          fetchGoals(5),
        ]);

        setTransaction(
          Array.isArray(transactions) ? transactions.slice(0, 5) : [],
        );
        setGoal(Array.isArray(goals) ? goals.slice(0, 3) : []);
        setTotal(total.data);
        setAnalytics(analytics.data);
      } catch (error) {
        console.error("❌ ดึงข้อมูลพลาด:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 ">
      <div className="text-6xl pb-4">
        <h1>Overview</h1>
      </div>
      <SectionCards data={total} />
      <div className="grid gap-4 lg:grid-cols-2">
        <StackedAreaChart trendData={analytics.trend} />
        <ShapePieChart pieData={analytics.pie} />
        <TableTranscation data={transaction} />
        <SectionGoal data={goal} />
      </div>
    </div>
  );
}
