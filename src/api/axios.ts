import axios from "axios";

const api = axios.create({
  baseURL: "https://infinion-test-int-test.azurewebsites.net", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;