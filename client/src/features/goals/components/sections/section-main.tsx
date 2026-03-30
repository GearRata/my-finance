import { useState } from "react";
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

import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

export function SectionMain() {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));

  const [files, setFiles] = useState<File[]>([]);
  return (
    <section className="grid grid-cols-3 h-1/2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>เป้าหมายการออม</CardTitle>
          <CardDescription>ความคืบหน้าเป้าหมายหลัก</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <Empty className="border border-dashed border-2 ">
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
