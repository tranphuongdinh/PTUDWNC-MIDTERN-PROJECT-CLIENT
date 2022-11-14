import { request } from "./index";

export const registerFunc = async (data) => request("POST", "/register", data);

export const loginFunc = async (data) => request("POST", "/login", data);
