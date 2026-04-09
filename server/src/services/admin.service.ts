import * as AdminModel from "../models/admin.model.js";

export const listUsers = async () => {
  return await AdminModel.getAllUsers();
};

export const changeStatus = async (id: number | string, enabled: boolean) => {
  await AdminModel.updateUserStatus(id, enabled);
};

export const changeRole = async (id: number | string, role: string) => {
  await AdminModel.updateUserRole(id, role);
};
