import { request } from "./index";

export const createPresentation = async (data) => request("POST", "/presentation/create", data);

export const updatePresentation = async (data) => request("PUT", "/presentation/update", data);

export const deletePresentation = async (id) => request("DELETE", "/presentation/delete", { id });

export const getPresentationDetail = async (id) => request("GET", `/presentation/detail/${id}`);

export const getPresentationByIds = async (ids) => request("POST", "/presentation/list", { ids });

export const addCollaborator = async (data) => request("POST", "/presentation/collaboration/add", data);

export const removeFromPresentation = async (data) => request("PUT", "/presentation/collaboration/remove", data);
