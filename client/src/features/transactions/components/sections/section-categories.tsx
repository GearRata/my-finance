"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectLabel,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

export function SectionCategories() {
  const [type, setType] = useState("all");
  return (
    <Card>
      <CardContent className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
        <section className="col-span-2 pb-4 lg:pb-0">
          <div className="flex items-center justify-center">
            <IconFilter size={32} />
            <ButtonGroup className="w-full pl-4">
              <Input placeholder="Search..." />
              <Button variant="outline" aria-label="Search">
                <IconSearch />
              </Button>
            </ButtonGroup>
          </div>
        </section>
        <section className="grid grid-cols-2 gap-4">
          <Select value={type}>
            <SelectTrigger className="w-full ">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectGroup>
                <SelectItem value="all">All Type</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectGroup></SelectGroup>
            </SelectContent>
          </Select>
        </section>
      </CardContent>
    </Card>
  );
}
