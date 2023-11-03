import axios from "axios";

export default function api(baseURL) {
  const commonConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  return axios.create({ baseURL, ...commonConfig });
}
