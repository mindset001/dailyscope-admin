import ApiClient from "@/utils/api";
import { log } from "console";

export const createArticle = async (formData: FormData) => {
  const response = await ApiClient.post("/articles", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


export const getArticles = async () => {
  const response = await ApiClient.get("/articles");
  console.log("Articles fetched successfully:", response.data); // ✅ Now runs before return
  return response.data;
};

export const updateArticleAction = async (id: string, actionTag: string) => {
  const response = await ApiClient.patch(`/articles/${id}/action`, { actionTag });
  console.log("Action updated successfully:", response.data);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await ApiClient.get("/users")

  console.log("Users fetched successfully:", response.data); // ✅ Now runs before return
  return response.data;
};


export const suspendUser = async (userId: string) => {
  const res = await ApiClient.put(`/users/${userId}/suspend`);
  if (!res) throw new Error('Failed to suspend user');
  return res;
};

export const unsuspendUser = async (userId: string) => {
  const res = await ApiClient.put(`/users/${userId}/unsuspend`);
  if (!res) throw new Error('Failed to unsuspend user');
  return res;
};