import createApiClient from "./api.service";

export default class UsersService {
  constructor(baseUrl = "http://localhost:3001/api/payment") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async payment(data) {
    return (await this.api.post("/", data)).data;
  }
}
