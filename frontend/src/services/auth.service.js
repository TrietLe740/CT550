import createApiClient from "./api.service";

export default class AuthService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return await this.api.get("/").data;
  }
}
