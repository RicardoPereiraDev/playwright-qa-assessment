import { APIRequestContext, expect } from '@playwright/test';

export interface AuthResponse {
  token: string;
}

export interface AuthErrorResponse {
  reason: string;
}

export class AuthService {
  constructor(private readonly request: APIRequestContext) {}

  async authenticate(
    username: string,
    password: string
  ) {
    return this.request.post('/auth', {
      data: {
        username,
        password,
      },
    });
  }

  async authenticateSuccessfully(
    username: string,
    password: string
  ): Promise<string> {
    const response = await this.authenticate(username, password);

    await expect(response).toBeOK();

    const body = (await response.json()) as AuthResponse;

    expect(body.token).toEqual(expect.any(String));
    expect(body.token.length).toBeGreaterThan(0);

    return body.token;
  }
}