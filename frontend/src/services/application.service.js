import createApiClient from "./api.service";

export default class ApplicationService {
  constructor(baseUrl = "http://localhost:3001/api/applications") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
}
