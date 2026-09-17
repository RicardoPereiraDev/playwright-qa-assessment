import { expect, test } from '@playwright/test';
import { AuthService } from '../../services/AuthService';

test.describe('Scenario 5 - Authentication and token handling', () => {
  test('should authenticate with valid credentials and return a token', async ({
    request,
  }) => {
    const authService = new AuthService(request);

    const response = await authService.authenticate(
      'admin',
      'password123'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    );

    expect(body.token.length).toBeGreaterThan(0);
  });

  test('should reject invalid credentials with the expected response', async ({
    request,
  }) => {
    const authService = new AuthService(request);

    const response = await authService.authenticate(
      'admin',
      'wrong-password'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toEqual({
      reason: 'Bad credentials',
    });
  });

  test('should allow protected DELETE with a valid token and reject it without authentication', async ({
    request,
  }) => {
    const authService = new AuthService(request);

    const validResponse = await authService.authenticate(
      'admin',
      'password123'
    );

    expect(validResponse.status()).toBe(200);

    const { token } = await validResponse.json();

    expect(token).toEqual(expect.any(String));

    const createResponse = await request.post('/booking', {
      data: {
        firstname: 'API',
        lastname: 'Test',
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: '2026-09-15',
          checkout: '2026-09-20',
        },
        additionalneeds: 'Breakfast',
      },
    });

    expect(createResponse.status()).toBe(200);

    const { bookingid } = await createResponse.json();

    const unauthenticatedDelete = await request.delete(
      `/booking/${bookingid}`
    );

    expect([401, 403]).toContain(
      unauthenticatedDelete.status()
    );

    const authenticatedDelete = await request.delete(
      `/booking/${bookingid}`,
      {
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );

    expect(authenticatedDelete.status()).toBe(201);
  });
});