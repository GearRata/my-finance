export type Transaction = {
  type: string;
  categoryId: string;
  page: number;
  search: string;
  limit: number;
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

export type Accounts = {
  id: number;
  name: string;
  balance: number;
  user_id: number;
};

export type Categories = {
  id: number;
  name: string;
  type: string;
};

export type Total = {
  number: number;
};

export type CreateTransaction = {
  account_id: number;
  amount: number;
  category_id: number;
  note: string;
  transaction_date: string;
};

export type UpdateTransaction = {
  account_id: number;
  amount: number;
  category_id: number;
  note: string;
  transaction_date: string | undefined;
};
