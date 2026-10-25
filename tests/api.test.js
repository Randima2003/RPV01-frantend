import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import {
  API_ORIGIN,
  getCurrentUser,
  registerTraveler,
} from '../src/api/auth.js';
import { buildTravelerRegistrationPayload } from '../src/api/registration.js';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const validForm = {
  fullName: '  Traveler Example ',
  telephoneNumber: ' +94 77 123 4567 ',
  email: ' traveler@example.com ',
  password: 'password-with-spaces ',
  country: ' Australia ',
  travelInterests: ['Culture & Heritage', 'Hiking & Adventure'],
};

test('builds the traveler payload with validated field names and data types', () => {
  assert.deepEqual(buildTravelerRegistrationPayload(validForm), {
    fullName: 'Traveler Example',
    telephoneNumber: '+94 77 123 4567',
    email: 'traveler@example.com',
    password: 'password-with-spaces ',
    country: 'Australia',
    travelInterests: ['Culture & Heritage', 'Hiking & Adventure'],
  });
});

test('defaults omitted interests to an empty array and rejects invalid registration fields', () => {
  const payload = buildTravelerRegistrationPayload({ ...validForm, travelInterests: undefined });
  assert.deepEqual(payload.travelInterests, []);
  assert.throws(
    () => buildTravelerRegistrationPayload({ ...validForm, telephoneNumber: '' }),
    /Telephone number is required/,
  );
  assert.throws(
    () => buildTravelerRegistrationPayload({ ...validForm, travelInterests: 'Hiking' }),
    /must be a list of interests/,
  );
});

test('posts registration JSON to the versioned endpoint with credentialed requests', async () => {
  let requestUrl;
  let requestOptions;
  globalThis.fetch = async (url, options) => {
    requestUrl = url;
    requestOptions = options;
    return new Response(JSON.stringify({ user: { id: 12, fullName: 'Traveler Example' } }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const payload = buildTravelerRegistrationPayload(validForm);
  const response = await registerTraveler(payload);

  assert.equal(API_ORIGIN, 'https://rpv01-backend-1.onrender.com');
  assert.equal(requestUrl, `${API_ORIGIN}/api/v1/auth/register/traveler`);
  assert.equal(requestOptions.credentials, 'include');
  assert.equal(requestOptions.headers.get('Content-Type'), 'application/json');
  assert.deepEqual(JSON.parse(requestOptions.body), payload);
  assert.equal(response.user.id, 12);
});

test('/auth/me treats a non-JSON 401 as unauthenticated', async () => {
  globalThis.fetch = async () => new Response('Unauthorized', { status: 401 });

  assert.deepEqual(await getCurrentUser(), {
    success: false,
    status: 401,
    user: null,
    message: 'Not logged in.',
  });
});

test('registration returns a safe message for a non-JSON server error', async () => {
  globalThis.fetch = async () => new Response('<html>internal details</html>', {
    status: 500,
    headers: { 'Content-Type': 'text/html' },
  });

  await assert.rejects(registerTraveler(buildTravelerRegistrationPayload(validForm)), (error) => {
    assert.equal(error.status, 500);
    assert.match(error.message, /Server error \(500\)/);
    assert.doesNotMatch(error.message, /internal details/);
    return true;
  });
});

test('registration includes backend validation details in a failed response', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({
    message: 'Validation failed',
    details: { country: ['Country is required'] },
  }), { status: 400, headers: { 'Content-Type': 'application/json' } });

  await assert.rejects(registerTraveler(buildTravelerRegistrationPayload(validForm)), (error) => {
    assert.equal(error.status, 400);
    assert.deepEqual(error.details, { country: ['Country is required'] });
    assert.equal(error.message, 'Validation failed');
    return true;
  });
});

test('network failures are reported as errors', async () => {
  globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };

  await assert.rejects(registerTraveler(buildTravelerRegistrationPayload(validForm)), /Unable to reach the server/);
});
