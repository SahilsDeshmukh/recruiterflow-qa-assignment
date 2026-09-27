import { test, expect } from '@playwright/test';

test.describe('Reqres Users API', () => {
  test('GET /api/users?page=2 returns list of users', async ({ request }) => {
    const response = await request.get('/api/users', { params: { page: 2 } });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(0);

    for (const user of body.data) {
      expect(user).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          email: expect.any(String),
          first_name: expect.any(String),
          last_name: expect.any(String),
        })
      );
    }
  });

  test('POST /api/users creates a user', async ({ request }) => {
    const payload = { name: 'morpheus', job: 'leader' };

    const response = await request.post('/api/users', { data: payload });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body.id).toBeTruthy();
    expect(Date.parse(body.createdAt)).not.toBeNaN();
  });

  // reqres doesn't persist data, so there's no real GET after this.
  // Showing how I'd structure a create -> verify flow against a real backend.
  test('create then verify user flow', async ({ request }) => {
    const payload = { name: 'neo', job: 'the one' };
    let createdUser: { id: string; name: string; job: string; createdAt: string };

    await test.step('create user', async () => {
      const response = await request.post('/api/users', { data: payload });
      expect(response.status()).toBe(201);
      createdUser = await response.json();
    });

    await test.step('verify created user', async () => {
      // real backend: const res = await request.get(`/api/users/${createdUser.id}`)
      // then assert on res.json() instead of the POST response
      expect(createdUser.id).toBeTruthy();
      expect(createdUser).toMatchObject(payload);
      expect(Date.parse(createdUser.createdAt)).not.toBeNaN();
    });
  });
});