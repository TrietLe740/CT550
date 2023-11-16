import createApiClient from "./api.service";

export default class SchoolsService {
  constructor(baseUrl = "http://localhost:3001/api/schools") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
}
