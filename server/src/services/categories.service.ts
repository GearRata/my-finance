import * as CategoriesModel from "../models/categories.model.js";

export const listCategories = async () => {
  return await CategoriesModel.getAllCategories();
};

export const createCategory = async (name: string, type: string) => {
  return await CategoriesModel.createCategory(name, type);
};

export const updateCategory = async (
  id: number | string,
  name: string,
  type: string,
) => {
  const updatedCategory = await CategoriesModel.updateCategory(id, name, type);
  if (!updatedCategory) {
    throw new Error("Category not found");
  }
  return updatedCategory;
};

export const removeCategory = async (id: number | string) => {
  const deletedCategory = await CategoriesModel.deleteCategory(id);
  if (!deletedCategory) {
    throw new Error("Category not found");
  }
  return deletedCategory;
};
