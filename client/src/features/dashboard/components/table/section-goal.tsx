import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
}

// Mock data for goals
const topGoals: Goal[] = [
  {
    id: 1,
    name: "ซื้อบ้านในฝัน",
    targetAmount: 5000000,
    currentAmount: 1250000,
    color: "#3b82f6",
  },
  {
    id: 2,
    name: "เงินสำรองฉุกเฉิน",
    targetAmount: 300000,
    currentAmount: 285000,
    color: "#10b981",
  },
  {
    id: 3,
    name: "เที่ยวญี่ปุ่น",
    targetAmount: 100000,
    currentAmount: 45000,
    color: "#f59e0b",
  },
];

// รูปแบบสกุลเงิน
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function SectionGoal() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>เป้าหมายการออม</CardTitle>
        <CardDescription>ความคืบหน้าเป้าหมายหลัก</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {topGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <Field key={goal.id} className="w-full space-y-2">
                <FieldLabel htmlFor="label-top">
                  <span>{goal.name}</span>
                  <span className="ml-auto">{progress}%</span>
                </FieldLabel>
                <Progress value={progress} id="progress-bar" />
                <FieldLabel
                  htmlFor="lable-bottom"
                  className="text-xs text-muted-foreground"
                >
                  <span>{formatCurrency(goal.currentAmount)}</span>
                  <span className="ml-auto">
                    {formatCurrency(goal.targetAmount)}
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
