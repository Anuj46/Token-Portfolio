import axios from "axios";

const API_BASE = "https://api.coingecko.com/api/v3";
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

const instance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-cg-api-key": API_KEY,
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("CoinGecko Error:", error?.response || error);
    return Promise.reject(error);
  }
);

const responseBody = (response) => response.data;

const requests = {
  get: (url, params) => instance.get(url, { params }).then(responseBody),
};

export const coingecko = {

  search: (query) => requests.get(`/search`, { query }),

  trending: () => requests.get("/search/trending"),

  markets: ({
    ids = null,
    vs_currency = "usd",
    order = "market_cap_desc",
    page = 1,
    per_page = 200,
    offset = null,
    sparkline = true,
  } = {}) => {
    if (offset !== null) {
      page = Math.floor(offset / per_page) + 1;
    }

    const params = { vs_currency, order, per_page, page, sparkline };

    if (ids) params.ids = ids;

    return requests.get("/coins/markets", params);
  },
};
