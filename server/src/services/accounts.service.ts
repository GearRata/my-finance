import * as AccountModel from "../models/accounts.model.js";

export const listAccounts = async (user_id: number | string) => {
  return await AccountModel.getAccountsByUserId(user_id);
};

export const createAccount = async (
  name: string,
  balance: number | string,
  user_id: number | string,
) => {
  return await AccountModel.createAccount(name, balance, user_id);
};

export const updateAccount = async (
  id: string | string[],
  name: string,
  balance: number | string,
  user_id: number | string,
) => {
  const account = await AccountModel.updateAccount(id, name, balance, user_id);
  if (!account) {
    throw new Error("Account not found");
  }
  return account;
};

export const removeAccount = async (id: string | string[]) => {
  const account = await AccountModel.deleteAccount(id);
  if (!account) {
    throw new Error("Account not found");
  }
  return account;
};
