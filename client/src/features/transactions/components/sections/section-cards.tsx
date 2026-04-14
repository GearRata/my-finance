import {
  IconTrendingDown,
  IconTrendingUp,
  IconReceipt,
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

export function SectionCards({ data, loading }: any) {
  const totalIncome = data?.total_income || 0;
  const totalExpense = data?.total_expense || 0;
  const totalNumber = data?.number_of_transaction || 0;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 ">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Number of Transactions</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            {totalNumber}
          </CardTitle>
          <CardAction>
            <IconReceipt size={64} color="orange" />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Income</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            {formatCurrency(totalIncome)}
          </CardTitle>
          <CardAction>
            <IconTrendingDown
              size={64}
              style={{ transform: "scale(-1, 1)" }}
              color="lime"
            />
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
            <IconTrendingUp size={64} color="red" />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
