const API = "https://ptudwnc-btcn04-server.vercel.app/api";

export const request = async (method, url, data = {}) => {
  const response = await fetch(API + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();
  return res;
};
