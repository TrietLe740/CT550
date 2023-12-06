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

  async getAllRecruiter() {
    return (await this.api.get(`/recruiter`)).data;
  }

  async getRecruiter(id) {
    return (await this.api.get(`/recruiter/${id}`)).data;
  }

  async getAllIntern() {
    return (await this.api.get(`/intern`)).data;
  }

  async getIntern(id) {
    return (await this.api.get(`/intern/${id}`)).data;
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

  async updateLV(data) {
    return (await this.api.put("/updateLV", data)).data;
  }

  async updateRecruiter(data) {
    return (await this.api.put("/recruiter", data)).data;
  }

  async updateIntern(data) {
    return (await this.api.put("/intern", data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async apply(id) {
    return await this.api.post(`/${id}/applications`);
  }
}
