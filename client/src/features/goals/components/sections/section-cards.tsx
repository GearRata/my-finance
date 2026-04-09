import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
interface TypeGoal {
  total_saved: number;
  total_target: number;
}

interface SectionCardsProps {
  data: TypeGoal;
}

export function SectionCards({ data }: SectionCardsProps) {
  const total_saved = data?.total_saved || 0;
  const total_target = data?.total_target || 0;
  const progess =
    total_target > 0 ? Math.round((total_saved / total_target) * 100) : 0;
  return (
    <div className="grid  grid-cols-1 gap-4 lg:grid-cols-4 lg:grid-rows-2">
      <Card className="@container/card  lg:row-span-2 lg:col-span-3">
        <CardHeader>
          <CardDescription className="uppercase">
            total goals progress
          </CardDescription>
          <CardTitle className="text-7xl font-semibold tabular-nums @[768px]/card:text-8xl py-4">
            {progess}%
          </CardTitle>
          <Progress trackClassName="h-5" className="py-3" value={progess} />
          <CardAction></CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="uppercase">Total saved</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            {formatCurrency(total_saved)}
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="uppercase">Total Target</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
            {formatCurrency(total_target)}
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
