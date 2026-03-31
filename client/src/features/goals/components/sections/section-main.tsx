import { useState } from "react";
import Image from "next/image";
import { IconPlus } from "@tabler/icons-react";

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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ImageUploader } from "@/features/goals/components/upload/file-upload";
import { CalendarIcon } from "lucide-react";
import { IconCashBanknotePlus } from "@tabler/icons-react";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CircularProgress } from "@/components/progress-09";
import { formatCurrency } from "@/lib/utils";
import picture from "../../../../../public/assets/images/NIKE.png";

interface TypeGoals {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
}

type GoalsProps = {
  goal: TypeGoals[];
};

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

export function SectionMain({ goal }: GoalsProps) {
  console.log(goal);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));

  const [files, setFiles] = useState<File[]>([]);

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {goal.map((g) => {
        const percent =
          g.target_amount > 0
            ? Math.round((g.current_amount / g.target_amount) * 100)
            : 0;

        const remaining = g.target_amount - g.current_amount;
        return (
          <Card
            key={g.id}
            className="relative overflow-hidden h-[400px] flex flex-col justify-end border-0 shadow-2xl group"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={picture}
                alt="background"
                fill
                className="object-cover object-[50%_125%] transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="absolute inset-0 z-0 bg-linear-to-t from-[rgb(0,0,0)] from-15% via-[rgba(39,39,39,0.8)] via-40% to-transparent" />

            <div className="absolute top-4 right-4 z-20">
              <Dialog>
                <DialogTrigger
                  render={
                    <Button
                      className="group h-12 px-3 gap-0 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 
              shadow-lg transition-all duration-300 rounded-full flex items-center justify-center cursor-pointer"
                    >
                      <IconCashBanknotePlus
                        className="size-6 shrink-0"
                        stroke={2}
                      />

                      <span
                        className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[120px] 
                group-hover:ml-2 group-hover:opacity-100 font-semibold text-sm "
                      >
                        Add Funds
                      </span>
                    </Button>
                  }
                />
                <DialogContent>
                  <form>
                    <DialogHeader>
                      <DialogTitle>Add Fuds</DialogTitle>
                      <DialogDescription>
                        Record your new Goal
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="py-6">
                      {/* Type */}
                      <Field>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          type="text"
                          placeholder=""
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Field>
                    </FieldGroup>
                    <DialogFooter>
                      <DialogClose
                        render={<Button variant="outline">Cancel</Button>}
                      />
                      <Button type="submit">Add</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="relative z-10 text-white w-full">
              <CardContent>
                <div className="flex items-center justify-between ">
                  <div className="w-full ">
                    <h2 className="text-3xl font-bold py-3 drop-shadow-md">
                      {g.name}
                    </h2>
                    <div className="flex justify-between pb-2 text-[18px] font-medium text-slate-300">
                      <p>{formatCurrency(g.current_amount)}</p>
                      <p>{formatCurrency(g.target_amount)}</p>
                    </div>
                    <Progress
                      trackClassName="h-3 "
                      indicatorClassName="bg-linear-to-r from-gray-400 to-zinc-300 "
                      value={percent}
                    />
                    {remaining > 0 && (
                      <div className="relative mt-5 inline-flex items-center gap-2 px-3 py-1.5 ">
                        <div className=" absolute left-0 -mt-[2px] flex flex-col ">
                          <div className="ml-2 -mb-[1px] inline-block overflow-hidden">
                            <div className="h-3 w-3 origin-bottom-left rotate-45 transform border border-ring bg-black"></div>
                          </div>

                          <div className="flex min-w-max flex-col rounded-md border border-ring bg-black px-2 py-1">
                            <span className="font-medium tracking-wide ">
                              Only {formatCurrency(remaining)} to go!
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <CircularProgress
                    labelClassName="text-xl font-bold"
                    renderLabel={(progress) => `${progress}%`}
                    showLabel
                    size={130}
                    strokeWidth={16}
                    value={percent}
                  />
                </div>
              </CardContent>
            </div>
          </Card>
        );
      })}
      <Empty className="border-2 border-dashed ">
        <EmptyHeader>
          <EmptyMedia>
            <Dialog>
              <DialogTrigger
                render={
                  <Button className="py-6 px-4 rounded-full bg-ring text-white">
                    <IconPlus />
                  </Button>
                }
              />
              <DialogContent>
                <form>
                  <DialogHeader>
                    <DialogTitle>Add New Goal</DialogTitle>
                    <DialogDescription>Record your new Goal</DialogDescription>
                  </DialogHeader>
                  <FieldGroup className="py-6">
                    {/* Type */}
                    <Field>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        type="text"
                        placeholder=""
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <Label htmlFor="name">Target Amount</Label>
                        <Input
                          type="number"
                          placeholder=""
                          value={targetAmount}
                          onChange={(e) => setTargetAmount(e.target.value)}
                        />
                      </Field>
                      <Field>
                        <Label htmlFor="name">Current Amount</Label>
                        <Input
                          type="number"
                          placeholder=""
                          value={currentAmount}
                          onChange={(e) => setCurrentAmount(e.target.value)}
                        />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="date-required">Due Date</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id="date-required"
                          value={value}
                          placeholder="MM/DD/YYYY"
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
                    <ImageUploader files={files} onFilesChange={setFiles} />
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
          </EmptyMedia>
          <EmptyTitle>New Goal</EmptyTitle>
          <EmptyDescription>DEFINE YOU FUTURE</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </section>
  );
}
