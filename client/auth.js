import { request } from "./index";

export const registerFunc = async (data) => await request("POST", "auth/register", data);

export const loginFunc = async (data) => await request("POST", "auth/login", data);
