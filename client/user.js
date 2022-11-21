import { request } from "./index";

export const getUserInfo = async () => request("GET", "/user/current-user");