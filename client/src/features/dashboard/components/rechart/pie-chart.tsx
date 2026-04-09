"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  PieSectorDataItem,
  Tooltip,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

import type { PieType } from "../../types/dashboard.types";

interface PieTypeProps {
  pieData: PieType[];
  isAnimationActive?: boolean;
  loading: boolean;
}
const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const renderActiveShape = (props: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  const sin = Math.sin(-RADIAN * (midAngle ?? 0));
  const cos = Math.cos(-RADIAN * (midAngle ?? 0));
  const sx = (cx as number) + ((outerRadius as number) + 10) * cos;
  const sy = (cy as number) + ((outerRadius as number) + 10) * sin;
  const mx = (cx as number) + ((outerRadius as number) + 30) * cos;
  const my = (cy as number) + ((outerRadius as number) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        className="text-lg font-medium"
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius as number) + 6}
        outerRadius={(outerRadius as number) + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="currentColor"
        className="text-sm"
      >
        {`฿${value?.toLocaleString()}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="var(--muted-foreground)"
        className="text-xs"
      >{`(Rate ${((percent ?? 1) * 100).toFixed(2)}%)`}</text>
    </g>
  );
};

export default function ShapePieChart({
  pieData,
  isAnimationActive = true,
  loading,
}: PieTypeProps) {
  return loading ? (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl">Expense Breakdown</CardTitle>
        <CardDescription>By Category (Current Month)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[400px] w-full min-w-[300px]">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl">Expense Breakdown</CardTitle>
        <CardDescription>By Category (Current Month)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[400px] w-full min-w-[300px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
            initialDimension={{ width: 320, height: 200 }}
          >
            <PieChart>
              <Pie
                activeShape={renderActiveShape}
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="70%"
                dataKey="value"
                isAnimationActive={isAnimationActive}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={() => null} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
