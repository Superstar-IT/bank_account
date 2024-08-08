import axios from "axios";

const apiUrl = "http://localhost:5000/api/v1"; // Need to use env variable

const httpClient = axios.create({
  baseURL: apiUrl,
});

export const getTransactions = async (params) => {
  return await httpClient
    .get("/transactions", { params })
    .then(({ data }) => data);
};

export const saveTransaction = async (transaction) => {
  return await httpClient
    .post("/transactions", transaction)
    .then(({ data }) => data);
};
