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

// รูปแบบสกุลเงิน
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(value);
};

export function SectionCards({ data = {} }: any) {
  const totalIncome = data.totalIncome || 0;
  const totalExpense = data.totalExpense || 0;
  const balance = data.balance || 0;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0.0";

  return (
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
