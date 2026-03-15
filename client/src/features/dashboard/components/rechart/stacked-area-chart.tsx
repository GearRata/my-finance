"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  { month: "มกราคม", income: 10000, expense: 5000 },
  { month: "กุมภาพันธ์", income: 25000, expense: 6000 }, // รวม income จาก 5000 + 100
  { month: "มีนาคม", income: 15000, expense: 9000 },
];

const chartColorConfig = {
  income: {
    label: "รายรับ",
    color: "var(--chart-1)",
  },
  expense: {
    label: "รายจ่าย",
    color: "var(--chart-5)",
  },
};

const AreaChartExample = ({ isAnimationActive = true }) => (
  <Card>
    <CardHeader>
      <CardTitle>แนวโน้มรายรับรายจ่าย</CardTitle>
    </CardHeader>
    <CardContent className="flex-1 pb-0">
      <div className="h-[400px] w-full min-w-[300px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 320, height: 200 }}
        >
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-5)"
                  stopOpacity={0.8}
                />
                <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" />
            <YAxis width="auto" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="income"
              stroke="var(--chart-1)"
              fillOpacity={1}
              fill="url(#colorIncome)"
              isAnimationActive={isAnimationActive}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="var(--chart-5)"
              fillOpacity={1}
              fill="url(#colorExpense)"
              isAnimationActive={isAnimationActive}
            />
            {/* <RechartsDevtools /> */}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export default AreaChartExample;
