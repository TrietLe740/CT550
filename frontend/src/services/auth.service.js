import createApiClient from "./api.service";

export default class AuthService {
  constructor(baseUrl = "http://localhost:3001/auth") {
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
    return (await this.api.get("/auth")).data;
  }
}
