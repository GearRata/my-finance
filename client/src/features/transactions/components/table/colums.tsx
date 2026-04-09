"use client";

import { useState } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { CalendarIcon, Delete } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
export type Transaction = {
  type: string;
  categoryId: string;
  page: number;
  search: string;
  limit: number;
};

import {
  updateTransaction,
  deleteTransaction,
} from "../../services/transaction.services";

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

const EditAction = ({
  transaction,
  categoryList,
  accountList,
  onRefresh,
}: {
  transaction: any;
  categoryList: any[];
  accountList: any;
  onRefresh?: () => void;
}) => {
  const [type, setType] = useState(transaction.categories.type);
  const [amount, setAmount] = useState(transaction.amount);
  const [categoryId, setCategoryId] = useState<string>(
    String(transaction.category_id || ""),
  );
  const [note, setNote] = useState(transaction.note);

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    transaction.transaction_date
      ? new Date(transaction.transaction_date)
      : new Date(),
  );
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        amount: Number(amount),
        category_id: Number(categoryId),
        account_id: Number(accountList.account_id),
        note: note,
        transaction_date: date?.toISOString(),
      };

      await updateTransaction({ payload, id: transaction.id });

      if (onRefresh) onRefresh();
    } catch (error) {}
  };

  const filteredCategories = categoryList.filter((cat) => cat.type === type);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="flex  text-gray-400 cursor-pointer hover:text-white"
          >
            <IconEdit size={20} />
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleUpdate}>
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
                    setCategoryId("");
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
                onValueChange={(value) => value && setCategoryId(value)}
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
            <Field className="">
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
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteAction = ({ transaction, onRefresh }: any) => {
  const id = transaction?.id;
  const handleDelete = async () => {
    if (id) {
      await deleteTransaction(id);
      if (onRefresh) onRefresh();
    }
  };
  return (
    <Button
      variant="outline"
      className="flex text-gray-400 cursor-pointer hover:text-red-400"
      onClick={handleDelete}
    >
      <IconTrash size={20} />
    </Button>
  );
};

export const getColumns = ({
  categoryList,
  account,
  onRefresh,
}: any): ColumnDef<Transaction>[] => [
  {
    accessorKey: "transaction_date",
    header: "Date",
    cell: ({ row }) => {
      const rawDate = row.getValue("transaction_date") as string;
      const date = new Date(rawDate);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    accessorKey: "categories.name",
    header: "Category",
  },
  {
    accessorKey: "categories.type",
    header: "Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <div className="flex justify-center gap-2 cursor-pointer">
          <EditAction
            transaction={transaction}
            categoryList={categoryList}
            accountList={account}
            onRefresh={onRefresh}
          />
          <DeleteAction transaction={transaction} onRefresh={onRefresh} />
        </div>
      );
    },
  },
];
