"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createTransaction } from "../../services/transaction.services";
import { toast } from "sonner";

type Categories = {
  id: number;
  name: string;
  type: string;
};

type Account = {
  account_id: number;
  account_name: string;
};

interface SectionTypeProps {
  categoryList: Categories[];
  accountList: Account;
  onRefresh?: () => void;
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function SectionHeader({
  categoryList,
  accountList,
  onRefresh,
}: SectionTypeProps) {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState<string>("");
  const [categoryId, setCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const date = new Date(value);
    try {
      const payload = {
        account_id: Number(accountList.account_id),
        amount: Number(amount),
        category_id: Number(categoryId),
        note: note,
        transaction_date: date?.toISOString(),
      };

      await createTransaction(payload);
      toast.success("Data has been recorded successfully", {
        position: "top-center",
      });

      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
      });
      console.log(error);
    }
  };

  const filteredCategories = categoryList.filter((cat) => cat.type === type);

  return (
    <div className="text-5xl py-2">
      <div className="flex items-center justify-between ">
        <h1>Transacitions</h1>
        <Dialog>
          <DialogTrigger
            render={
              <Button variant="outline" className="text-xl py-5">
                + Add Transaction
              </Button>
            }
          />

          <DialogContent className="sm:max-w-sm">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Record your new income or expenses.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup className="py-6">
                {/* Type */}
                <Field>
                  <Label htmlFor="name-1">Type</Label>
                  <Select
                    value={type}
                    onValueChange={(value) => {
                      if (value) {
                        setType(value);
                        setCategory("");
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {type === "income" && "Income"}
                        {type === "expense" && "Expense"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectGroup>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {/* Amount */}
                <Field>
                  <Label htmlFor="username-1">Amount</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Field>
                {/* Categories */}
                <Field>
                  <Label htmlFor="name-1">Category</Label>
                  <Select
                    value={categoryId}
                    onValueChange={(value) => value && setCategory(value)}
                  >
                    <SelectTrigger className="w-full ">
                      <SelectValue placeholder="Select Category">
                        {
                          categoryList.find((c) => String(c.id) === categoryId)
                            ?.name
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectGroup>
                        {filteredCategories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <Label htmlFor="username-1">Description</Label>
                  <Input
                    type="text"
                    placeholder="Add note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="date-required">Date</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="date-required"
                      value={value}
                      placeholder=""
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setValue(e.target.value);
                        if (isValidDate(date)) {
                          setDate(date);
                          setMonth(date);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setOpen(true);
                        }
                      }}
                    />
                    <InputGroupAddon align="inline-end">
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger
                          render={
                            <InputGroupButton
                              id="date-picker"
                              variant="ghost"
                              size="icon-xs"
                              aria-label="Select date"
                            >
                              <CalendarIcon />
                              <span className="sr-only">Select date</span>
                            </InputGroupButton>
                          }
                        />
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="end"
                          alignOffset={-8}
                          sideOffset={10}
                        >
                          <Calendar
                            mode="single"
                            selected={date}
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={(date) => {
                              setDate(date);
                              setValue(formatDate(date));
                              setOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
