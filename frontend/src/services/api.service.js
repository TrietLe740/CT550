import axios from "axios";

const commonConfig = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export default function api(baseURL) {
  return axios.create({ baseURL, ...commonConfig });
}
