import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export const getUsers = () => axios.get(`${API_BASE}/users`);
export const addUser = (user) => axios.post(`${API_BASE}/users`, user);
export const getUserAccounts = (id) => axios.get(`${API_BASE}/users/${id}/accounts`);
export const addAccountForUser = (id, account) => axios.post(`${API_BASE}/users/${id}/accounts`, account);
export const deleteUserAccount = (userId, accountId) => axios.delete(`${API_BASE}/users/${userId}/accounts/${accountId}`);