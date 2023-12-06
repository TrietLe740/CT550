import createApiClient from "./api.service";

export default class JobsService {
  constructor(baseUrl = "http://localhost:3001/api/jobs") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
  async getAllWithMjor() {
    return (await this.api.get("/major")).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async apply(id) {
    return await this.api.post(`/${id}/applications`);
  }
}
