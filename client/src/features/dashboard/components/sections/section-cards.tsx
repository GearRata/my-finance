import {
  IconTrendingDown,
  IconTrendingUp,
  IconWallet,
  IconCalendarStats,
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
  const totalIncome = data.total_income || 0;
  const totalExpense = data.total_expense || 0;
  const balance = data.balance || 0;
  const currentDay = new Date().getDate();
  const dailyAverage = totalExpense > 0 ? totalExpense / currentDay : 0;

  return loading ? (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 ">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-xl"> Total Income</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            <Skeleton className="h-8 w-full" />
          </CardTitle>
          <CardAction>
            <IconTrendingUp
              size={76}
              style={{ transform: "scale(-1, 1)" }}
              color="lime"
            />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-xl">Total Expense</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            <Skeleton className="h-8 w-full" />
          </CardTitle>
          <CardAction>
            <IconTrendingDown size={76} color="red" />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-xl">Balance</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            <Skeleton className="h-8 w-full" />
          </CardTitle>
          <CardAction>
            <IconWallet size={76} color="yellow" />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-xl">
            Daily Avg Expense
          </CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            <Skeleton className="h-8 w-full" />
          </CardTitle>
          <CardAction>
            <IconCalendarStats size={76} color="indigo" />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 ">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-xl">Total Income</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            {formatCurrency(totalIncome)}
          </CardTitle>
          <CardAction>
            <IconTrendingDown
              size={76}
              style={{ transform: "scale(-1, 1)" }}
              color="lime"
            />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-xl">Total Expense</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            {formatCurrency(totalExpense)}
          </CardTitle>
          <CardAction>
            <IconTrendingUp size={76} color="red" />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-xl">Balance</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            {formatCurrency(balance)}
          </CardTitle>
          <CardAction>
            <IconWallet size={76} color="yellow" />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-xl">
            Daily Avg Expense
          </CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            {formatCurrency(dailyAverage)}
          </CardTitle>
          <CardAction>
            <IconCalendarStats size={76} color="indigo" />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
