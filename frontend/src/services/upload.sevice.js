import createApiClient from "./api.service";

export default class UploadService {
  constructor(baseUrl = "http://localhost:3001/upload") {
    this.api = createApiClient(baseUrl);
  }

  async uploadResume(file) {
    return (await this.api.post(`/resume`, file)).data;
  }

  async uploadProfile(file) {
    return await this.api.post(`/profile`, file);
  }

  async deleteCV(filename) {
    return (await this.api.delete(`/resume/${filename}`)).data;
  }

  async adminDeleteCV(filename, id) {
    return (
      await this.api.delete(`/resume/admin/${filename}`, { data: { id } })
    ).data;
  }
}
