import {
  IconTrendingDown,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { formatCurrency } from "@/lib/utils";

import type { Total } from "../../types/dashboard.types";

interface TotalProps {
  data: Total;
  loading: boolean;
}

export function SectionCards({ data, loading }: TotalProps) {
  const totalIncome = data.total_income;
  const totalExpense = data.total_expense || 0;
  const balance = data.balance || 0;
  const savingsRate =
    totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0.0";

  return loading ? (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 ">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Income</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            <Skeleton className="h-8 w-full" />
          </CardTitle>
          <CardAction>
            <IconTrendingUp size={64} />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Expense</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            <Skeleton className="h-8 w-full" />
          </CardTitle>
          <CardAction>
            <IconTrendingDown size={64} />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Balance</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            <Skeleton className="h-8 w-full" />
          </CardTitle>
          <CardAction>
            <IconWallet size={64} />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Savings Rate</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            <Skeleton className="h-8 w-full" />
          </CardTitle>
          <CardAction>
            <IconTrendingUp />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 ">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Income</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            {formatCurrency(totalIncome)}
          </CardTitle>
          <CardAction>
            <IconTrendingUp size={64} />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Expense</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            {formatCurrency(totalExpense)}
          </CardTitle>
          <CardAction>
            <IconTrendingDown size={64} />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Balance</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            {formatCurrency(balance)}
          </CardTitle>
          <CardAction>
            <IconWallet size={64} />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Savings Rate</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            {savingsRate}%
          </CardTitle>
          <CardAction>
            <IconTrendingUp />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
