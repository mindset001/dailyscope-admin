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