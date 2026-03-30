"use client";

import { useState, useEffect } from "react";

import { SectionCards } from "@/features/goals/components/sections/section-cards";
import { SectionMain } from "@/features/goals/components/sections/section-main";
import { fetchTotal } from "@/features/goals/services/goal.services";

interface Goal {
  total_saved: number;
  total_target: number;
}

export default function GoalPage() {
  const [goal, setGoal] = useState<Goal>({
    total_saved: 0,
    total_target: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goals] = await Promise.all([fetchTotal()]);
        setGoal(goals.data);
      } catch (error) {
        console.error("ดึงข้อมูลพลาด:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  console.log(goal);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 ">
      <h1>Goals</h1>
      <SectionCards data={goal} />
      <SectionMain />
    </div>
  );
}
