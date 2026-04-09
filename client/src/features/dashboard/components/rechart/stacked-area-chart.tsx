"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TrendType } from "../../types/dashboard.types";

interface TrendProps {
  trendData: TrendType[];
  isAnimationActive?: boolean;
  loading: boolean;
}

const CustomTooltip = ({ active, payload, label }: TooltipContentProps) => {
  const isVisible = active && payload && payload.length;
  return (
    <div
      className="custom-tooltip"
      style={{
        backgroundColor: "white",
        color: "#000",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      }}
    >
      {isVisible && (
        <>
          <p className="label" style={{ fontWeight: "bold" }}>{`${label} `}</p>
          <p className="desc">{`${payload[0].name} : ${payload[0].value}`}</p>
          <p className="desc">{`${payload[1].name} : ${payload[1].value}`}</p>
        </>
      )}
    </div>
  );
};

const AreaChartExample = ({
  trendData,
  isAnimationActive = true,
  loading,
}: TrendProps) =>
  loading ? (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Income & Expense Trend</CardTitle>
        <CardDescription>Overview of cash flow</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[400px] w-full min-w-[300px]">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Income & Expense Trend</CardTitle>
        <CardDescription>Overview of cash flow</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[400px] w-full min-w-[300px]">
          {trendData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
              initialDimension={{ width: 320, height: 200 }}
            >
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-5)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-5)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" />
                <YAxis
                  width={60}
                  tickFormatter={(value) =>
                    Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(value)
                  }
                />
                <Tooltip content={CustomTooltip} />
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
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No transaction data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

export default AreaChartExample;
