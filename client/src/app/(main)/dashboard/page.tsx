import { SectionCards } from "@/features/dashboard/components/cards/section-cards";
import StackedAreaChart from "@/features/dashboard/components/rechart/stacked-area-chart";
import ShapePieChart from "@/features/dashboard/components/rechart/pie-chart";
import { TableTranscation } from "@/features/dashboard/components/table/transactions-table";
import SectionGoal from "@/features/dashboard/components/table/section-goal";
export default function page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 ">
      <div className="text-5xl py-2">
        <h1>Overview</h1>
      </div>
      <SectionCards />
      <div className="grid gap-4 lg:grid-cols-2">
        <StackedAreaChart />
        <ShapePieChart />
        <TableTranscation />
        <SectionGoal />
      </div>
    </div>
  );
}
