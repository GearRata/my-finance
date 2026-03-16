import React from "react";
import { SectionCards } from "@/features/transactions/components/cards/section-cards";
import { Button } from "@/components/ui/button";
export default function page() {
  return (
    <div>
      <div className="flex flex-1 flex-col gap-4 p-4 ">
        <div className="text-6xl pb-4">
          <div className="flex">
            <h1>Transacitions</h1>
            <Button>Add Trainsactions</Button>
          </div>
        </div>
        <SectionCards />
      </div>
    </div>
  );
}
