import createApiClient from "./api.service";

export default class UploadService {
  constructor(baseUrl = "http://localhost:3001/upload") {
    this.api = createApiClient(baseUrl);
  }

  async uploadResume(file) {
    return await this.api.post(`/resume`, file);
  }

  async uploadProfile(file) {
    return await this.api.post(`/profile`, file);
  }
}
