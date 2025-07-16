// src/utils/api.ts
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;


import axios from 'axios';

const ApiClient = axios.create({
  baseURL: baseURL,
});

export default ApiClient;
