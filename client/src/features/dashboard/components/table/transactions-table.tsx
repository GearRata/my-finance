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

import { Skeleton } from "@/components/ui/skeleton";
import type { Transactions } from "@/features/dashboard/types/dashboard.types";

interface TransactionProps {
  data: Transactions;
  loading: boolean;
}
export function TableTranscation({ data, loading }: TransactionProps) {
  return loading ? (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl">Recent Transactions</CardTitle>
        <CardDescription>Latest 5 Transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full min-w-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2 text-lg">List</TableHead>
                <TableHead className="text-right text-lg">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl">Recent Transactions</CardTitle>
        <CardDescription>Latest 5 Transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full min-w-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-xl">List</TableHead>
                <TableHead className="text-right text-xl">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((items) => (
                <TableRow key={items.id}>
                  <TableCell className=" text-lg py-5">{items.note}</TableCell>
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
