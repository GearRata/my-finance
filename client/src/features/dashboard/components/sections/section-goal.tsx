import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { Goals } from "../../types/dashboard.types";
import { formatCurrency } from "@/lib/utils";

interface GoalProps {
  data: Goals;
  loading: boolean;
}

export default function SectionGoal({ data, loading }: GoalProps) {
  return loading ? (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Savings Goal</CardTitle>
        <CardDescription>Main Goal Progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Field key={i} className="w-full space-y-2">
              <Skeleton className="h-14 w-full" />
            </Field>
          ))}
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Savings Goal</CardTitle>
        <CardDescription>Main Goal Progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((items) => {
            const progress = (items.current_amount / items.target_amount) * 100;
            return (
              <Field key={items.id} className="w-full space-y-1">
                <FieldLabel htmlFor="label-top" className="text-lg">
                  <span>{items.name}</span>
                  <span className="ml-auto">{Math.round(progress)}%</span>
                </FieldLabel>
                <Progress
                  value={progress}
                  id="progress-bar"
                  trackClassName="h-3"
                />
                <FieldLabel
                  htmlFor="lable-bottom"
                  className="text-md text-muted-foreground"
                >
                  <span>{formatCurrency(items.current_amount)}</span>
                  <span className="ml-auto">
                    {formatCurrency(items.target_amount)}
                  </span>
                </FieldLabel>
              </Field>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
