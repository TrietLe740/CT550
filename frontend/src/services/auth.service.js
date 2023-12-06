import createApiClient from "./api.service";

export default class AuthService {
  baseUrl = "";
  constructor(baseUrl = "http://localhost:3001/auth") {
    this.baseUrl = baseUrl;
    this.api = createApiClient(baseUrl);
  }

  async login(data) {
    return await this.api.post(`/login`, data);
  }

  async adminLogin(data) {
    return await this.api.post(`/adminLogin`, data);
  }

  async signup(data) {
    return await this.api.post(`/signup`, data);
  }

  async get() {
    this.api = createApiClient(this.baseUrl);
    return (await this.api.get("/auth")).data;
  }

  async update(data) {
    return (await this.api.put("/auth/update")).data;
  }
}
