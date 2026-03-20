export type Transactions = {
  id: number;
  amount: number;
  note: string;
}[];

export type Goals = {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
}[];

export type Total = {
  total_income: number;
  total_expense: number;
  balance: number;
};

export type TrendType = {
  year: string;
  month: string;
  income: number;
  expense: number;
};

export type PieType = {
  name: string;
  value: number;
};

export type Analytics = {
  trend: TrendType[];
  pie: PieType[];
};
