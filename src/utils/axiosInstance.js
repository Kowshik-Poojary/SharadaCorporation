import axios from "axios";
import { BaseUrl } from "../../constant";

const axiosInstance = axios.create({
  baseURL: BaseUrl,
});

export default axiosInstance;
