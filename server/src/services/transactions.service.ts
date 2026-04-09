import * as TransactionModel from "../models/transactions.model.js";

export const getTransaction = async (user_id: number, limit: number) => {
  return await TransactionModel.getRecentTransactions(user_id, limit);
};

export const paginationTransactions = async (
  userId: number,
  type: string,
  category: string,
  page: number,
  search: string,
  limit: number,
) => {
  const offset = (page - 1) * limit;
  const conditions: string[] = ["deleted_at IS NULL", "t.user_id = $1"];
  const params: (number | string)[] = [userId];

  if (type !== "all") {
    conditions.push(`c.type = $${params.length + 1}`);
    params.push(type);
  }

  if (category !== "all") {
    conditions.push(`c.id = $${params.length + 1}`);
    params.push(category);
  }

  if (search) {
    conditions.push(`t.note ILIKE $${params.length + 1}`);
    params.push(`%${search}%`);
  }

  const whereClause = conditions.join(" AND ");
  const data = await TransactionModel.filterTransactions(whereClause, params);
  const totalItems = parseInt(data[0].total);
  const totalPages = Math.ceil(totalItems / limit);

  const result = await TransactionModel.paginationTransaction(whereClause, [
    ...params,
    limit,
    offset,
  ]);
  return { result, page, totalPages, totalItems, limit };
};

export const createTransactions = async (
  user_id: number,
  amount: number,
  note: string,
  account_id: number,
  category_id: number,
  transaction_date: string,
) => {
  const account = await TransactionModel.findAccountById(account_id, user_id);
  if (!account) throw new Error("Account Not Found");
  const category = await TransactionModel.findCategoryById(category_id);
  if (!category) throw new Error("Category Not Found");
  if (category[0].type !== "income" && category[0].type !== "expense") {
    throw new Error("Invalid category type");
  }
  const amountNumber = amount;
  if (amountNumber <= 0) {
    throw new Error("Amount must be greater than 0");
  }
  const transaction = await TransactionModel.insertTransaction(
    amountNumber,
    note,
    user_id,
    account_id,
    category_id,
    transaction_date,
  );
  const cal = category[0].type === "income" ? amountNumber : -amountNumber;
  const updatedAccount = await TransactionModel.updateAccountBalance(
    cal,
    account_id,
    user_id,
  );
  return { transaction, account: updatedAccount };
};

export const updateTransactions = async (
  user_id: number,
  amount: number,
  note: string,
  account_id: number,
  category_id: number,
  transaction_date: string,
  id: number,
) => {
  const account = await TransactionModel.findAccountById(account_id, user_id);
  if (!account) throw new Error("Account Not Found");
  const category = await TransactionModel.findCategoryById(category_id);
  if (!category) throw new Error("Category Not Found");
  if (category[0].type !== "income" && category[0].type !== "expense") {
    throw new Error("Invalid category type");
  }
  const amountNumber = amount;
  if (amountNumber <= 0) {
    throw new Error("Amount must be greater than 0");
  }
  const transaction = await TransactionModel.updateTransaction(
    amountNumber,
    note,
    user_id,
    account_id,
    category_id,
    transaction_date,
    id,
  );
  const cal = category[0].type === "income" ? amountNumber : -amountNumber;
  const updatedAccount = await TransactionModel.updateAccountBalance(
    cal,
    account_id,
    user_id,
  );
  return { transaction, account: updatedAccount };
};

export const deleteTransaction = async (id: number, user_id: number) => {
  const transaction = await TransactionModel.deleteTransaction(id, user_id);
  if (!transaction) {
    throw new Error("The Id to delete was not found");
  }
  return transaction;
};

export const listBy = async (sort: string, order: string, limit: number) => {
  const list = await TransactionModel.listBy(sort, order, limit);
  return list;
};

export const searchFilter = async (
  name?: string,
  category?: number[],
  amount?: number[],
) => {
  let results: (string | number)[] = [];
  if (name) {
    results = await TransactionModel.handleName(name);
  }
  if (category) {
    results = await TransactionModel.handleCategory(category);
  }
  if (amount) {
    results = await TransactionModel.handleAmount(amount);
  }

  return results;
};

export const summaryTransactions = async (user_id: number) => {
  const data = await TransactionModel.summaryTransactions(user_id);
  const changType = data.map((data) => ({
    account_id: data.account_id,
    account_name: data.account_name,
    balance: Number(data.balance),
    total_income: Number(data.total_income),
    total_expense: Number(data.total_expense),
    number_of_transaction: Number(data.number_of_transaction),
  }));

  return changType[0];
};

export const analyticeTransactions = async (user_id: number) => {
  const trendReuslt = await TransactionModel.trendData(user_id);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const trend = trendReuslt.map((data) => {
    const [year, month] = data.month.split("-");
    return {
      year: year,
      month: months[parseInt(month) - 1],
      income: Number(data.income),
      expense: Number(data.expense),
    };
  });

  const pieResult = await TransactionModel.pieData(user_id);
  const pie = pieResult.map((row) => {
    return {
      name: row.name || "ไม่ระบุ",
      value: Number(row.value),
    };
  });

  return { trend, pie };
};
