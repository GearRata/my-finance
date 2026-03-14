import { SectionCards } from "@/features/dashboard/components/cards/section-cards";
import StackedAreaChart from "@/features/dashboard/components/rechart/stacked-area-chart";
import ShapePieChart from "@/features/dashboard/components/rechart/pie-chart";
export default function page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <SectionCards />
      <div className="grid gap-4 lg:grid-cols-2">
        <StackedAreaChart />

        <ShapePieChart />
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
