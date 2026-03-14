import {
  IconTrendingDown,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 ">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Income</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            $1,250.00
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
            1,234
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
            45,678
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
            4.5%
          </CardTitle>
          <CardAction>
            <IconTrendingUp />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
