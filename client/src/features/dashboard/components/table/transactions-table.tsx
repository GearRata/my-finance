import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Transactions } from "@/features/dashboard/types/dashboard.types";

interface TransactionProps {
  data: Transactions;
}
export function TableTranscation({ data }: TransactionProps) {
  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-2xl">Recent List</CardTitle>
        <CardDescription className="text-xl">
          5 Recent Transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full min-w-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-lg">List</TableHead>
                <TableHead className="text-right text-lg">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((items) => (
                <TableRow key={items.id}>
                  <TableCell className="font-medium text-lg">
                    {items.note}
                  </TableCell>
                  <TableCell className="text-right text-lg">
                    {items.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
