import { Request, Response } from 'src/shared/models';

class API {
  constructor(private baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request({ url, method, body }: Request): Promise<Response> {
    try {
      const request = await fetch(`${this.baseUrl}${url}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await request.json() as [];
      return { data };
    } catch (error) {
      return { error } as Extract<Response, 'error'>;
    }
  }

  get({ url, body }: Omit<Request, 'method'>): Promise<Response> {
    return this.request({ url, method: 'GET', body });
  }
}

const api = new API('https://vacancy.sdpro.uz/api/');

export default api;
