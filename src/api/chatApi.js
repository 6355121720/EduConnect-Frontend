import apiClient from "./apiClient";

export const getChat = async (receiver) => {
  const res = await apiClient.get("/chat/get-private?with="+receiver);
  return res;
}