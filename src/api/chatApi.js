import apiClient from "./apiClient";

export const getChat = async (receiver) => {
  const res = await apiClient.get("/chat/get-private?with="+receiver);
  return res;
}

export const sendPrivateMessage = async (data) => {
  const res = await apiClient.post("/chat/private", data);
  return res;
}

export const getFileUrl = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiClient.post("/chat/fileupload", formData, {
    'Content-Type': "multipart/form-data",
  });
  return res;
}

export const createGroup = async (data) => {
  const res = await apiClient.post("/chat/make-group", data);
  return res;
}

export const getGroup = async (name) => {
  const res = await apiClient.get("/chat/get-group/"+name);
  return res;
}

export const getMessages = async (name) => {
  const res = await apiClient.get("/chat/get-group-messages/"+name);
  return res;
}

export const searchGroup = async (search) => {
  const res = await apiClient.get("/chat/group-search?search="+search);
  return res;
}

export const joinGroup = async (data) => {
  const res = await apiClient.post("/chat/group-join", data);
  return res;
}

export const joinRequest = async (data) => {
  const res = await apiClient.post("/chat/group-request", data);
  return res;
}