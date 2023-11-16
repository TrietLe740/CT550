import createApiClient from "./api.service";

export default class DownloadService {
  constructor(baseUrl = "http://localhost:3001/download") {
    this.api = createApiClient(baseUrl);
  }

  async downloadResume(file) {
    return (await this.api.post(`/resume`, file)).data;
  }

  async downloadProfile(file) {
    return await this.api.post(`/profile`, file);
  }
}
