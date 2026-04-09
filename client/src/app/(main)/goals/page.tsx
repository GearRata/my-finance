"use client";

import { useState, useEffect } from "react";

import { SectionCards } from "@/features/goals/components/sections/section-cards";
import { SectionMain } from "@/features/goals/components/sections/section-main";
import {
  fetchTotal,
  fetchGoals,
} from "@/features/goals/services/goal.services";

import type { Total, Goals } from "@/features/goals/types/goals.types";

export default function GoalPage() {
  const [total, setTotal] = useState<Total>({
    total_saved: 0,
    total_target: 0,
  });
  const [goal, setGoal] = useState<Goals[]>([]);
  const [refresh, setRefresh] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const [total, goals] = await Promise.all([fetchTotal(), fetchGoals()]);
      setTotal(total.data);
      setGoal(goals.data);
    } catch (error) {
      console.error("ดึงข้อมูลพลาด:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 ">
      <h1>Goals</h1>
      <SectionCards data={total} />
      <SectionMain goal={goal} />
    </div>
  );
}
