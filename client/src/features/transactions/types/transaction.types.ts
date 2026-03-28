export type fetchTransaction = {
  type: string;
  category: string;
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

export type Categories = {
  id: number;
  name: string;
  type: string;
};

export type Count = {
  total_income: number;
  total_expense: number;
  balance: number;
};

export type Total = {
  number: number;
};
