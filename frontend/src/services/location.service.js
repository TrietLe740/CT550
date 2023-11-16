import createApiClient from "./api.service";

export default class LocationsService {
  constructor(baseUrl = "http://localhost:3001/api/locations") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
}
