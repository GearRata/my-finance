"use client";

import { ReactElement, useState } from "react";
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
  SelectLabel,
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

export function SectionHeader() {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState();
  const [category, setCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date("2025-06-01"));
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));
  return (
    <div className="text-5xl py-2">
      <div className="flex items-center justify-between ">
        <h1>Transacitions</h1>
        <Dialog>
          <form>
            <DialogTrigger
              render={
                <Button variant="outline" className="text-xl py-5">
                  + Add Transaction
                </Button>
              }
            />
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Record your new income or expenses.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                {/* Type */}
                <Field>
                  <Label htmlFor="name-1">Type</Label>
                  <Select value={type}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                    onChange={(e) => {
                      e.target.value;
                    }}
                  />
                </Field>

                <Field>
                  <Label htmlFor="name-1">Category</Label>
                  <Select>
                    <SelectTrigger className="w-full ">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectGroup>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
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
                <Field className="">
                  <FieldLabel htmlFor="date-required">
                    Subscription Date
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="date-required"
                      value={value}
                      placeholder="June 01, 2025"
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
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </div>
  );
}
