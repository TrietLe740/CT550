import createApiClient from "./api.service";

export default class UsersService {
  constructor(baseUrl = "http://localhost:3001/api/user") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  async update(data) {
    return (await this.api.put("/", data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async apply(id) {
    return await this.api.post(`/${id}/applications`);
  }
}
