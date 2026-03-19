import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";

// รูปแบบสกุลเงิน
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function SectionGoal({ data }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>เป้าหมายการออม</CardTitle>
        <CardDescription>ความคืบหน้าเป้าหมายหลัก</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((items: any) => {
            const progress = (items.current_amount / items.target_amount) * 100;
            return (
              <Field key={items.id} className="w-full space-y-2">
                <FieldLabel htmlFor="label-top">
                  <span>{items.name}</span>
                  <span className="ml-auto">{Math.round(progress)}%</span>
                </FieldLabel>
                <Progress value={progress} id="progress-bar" />
                <FieldLabel
                  htmlFor="lable-bottom"
                  className="text-xs text-muted-foreground"
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
