import createApiClient from "./api.service";

export default class MajorsService {
  constructor(baseUrl = "http://localhost:3001/api/majors") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
}
