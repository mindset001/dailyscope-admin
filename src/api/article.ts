import ApiClient from "@/utils/api";
import { log } from "console";

export const createArticles = async (formData: FormData) => {
  try {
    // Debug token before request
    const token = localStorage.getItem('adminToken');
    console.log('Current token:', token ? '****' + token.slice(-4) : 'NO TOKEN');
    
    // Important: Set proper headers for file upload
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    };
    
    const response = await ApiClient.post('/admin/articles', formData, config);
    
    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Upload error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    throw new Error(error.response?.data?.message || 'Failed to create article');
  }
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