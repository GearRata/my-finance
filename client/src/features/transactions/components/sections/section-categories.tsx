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

type Categories = {
  id: number;
  name: string;
};
interface SectionTypeProps {
  type: string;
  onTypeChange: (type: string) => void;
  category: string;
  onSearch: (keyword: string) => void;
  onCategoryChange: (category: string) => void;
  categoryList: Categories[];
}

export function SectionCategories({
  type,
  onTypeChange,
  category,
  onSearch,
  onCategoryChange,
  categoryList,
}: SectionTypeProps) {
  return (
    <Card>
      <CardContent className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
        <section className="col-span-2 pb-4 lg:pb-0">
          <div className="flex items-center justify-center">
            <IconFilter size={32} />
            <ButtonGroup className="w-full pl-4">
              <Button variant="outline" className="pointer-events-none">
                <IconSearch />
              </Button>
              <Input
                placeholder="Search..."
                onChange={(e) => onSearch(e.target.value)}
              />
            </ButtonGroup>
          </div>
        </section>
        <section className="grid grid-cols-2 gap-4">
          <Select
            value={type}
            onValueChange={(value) => value && onTypeChange(value)}
          >
            <SelectTrigger className="w-full ">
              <SelectValue>
                {type === "all" && "All Type"}
                {type === "income" && "Income"}
                {type === "expense" && "Expense"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectGroup>
                <SelectItem value="all">All Type</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={category}
            onValueChange={(value) => value && onCategoryChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {category === "all"
                  ? "All Categories"
                  : categoryList.find((c) => String(c.id) === category)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectGroup>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryList.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </section>
      </CardContent>
    </Card>
  );
}
