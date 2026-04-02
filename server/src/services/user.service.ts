import * as UserModel from "../models/user.model.js";

export const addBudget = async (
  month: string,
  user_id: number | string,
  budgetItems: any[],
) => {
  const newBudget = await UserModel.insertBudget(month, user_id);

  if (budgetItems && budgetItems.length > 0) {
    await Promise.all(
      budgetItems.map((item: any) =>
        UserModel.insertBudgetItem(
          newBudget.id,
          item.category_id,
          item.amount,
          item.note,
        ),
      ),
    );
  }

  return newBudget;
};

export const getUserDraftBudgets = async (user_id: number | string) => {
  return await UserModel.getDraftBudgets(user_id);
};

export const emptyUserBudget = async (
  id: number | string,
  user_id: number | string,
) => {
  const deletedRows = await UserModel.deleteBudget(id, user_id);
  if (deletedRows.length === 0) {
    throw new Error("Budget not found");
  }
  return deletedRows;
};

export const confirmUserBudget = async (
  id: number | string,
  user_id: number | string,
) => {
  const updatedRows = await UserModel.confirmBudgetStatus(id, user_id);
  if (updatedRows.length === 0) {
    throw new Error("Budget not found or already confirmed");
  }
  return updatedRows[0];
};

export const getUserBudgetHistory = async (user_id: number | string) => {
  return await UserModel.getConfirmedBudgets(user_id);
};
