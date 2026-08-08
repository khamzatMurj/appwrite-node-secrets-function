import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../functions/secrets-status.js';

function createResponse() {
  return {
    statusCode: undefined,
    jsonBody: undefined,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.jsonBody = body;
      return this;
    },
  };
}

test('Nhost function reports configured secrets without returning values', () => {
  const previous = {
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD,
    API_KEY: process.env.API_KEY,
  };

  process.env.USERNAME = 'test-user';
  process.env.PASSWORD = 'test-password';
  process.env.API_KEY = 'test-api-key';

  try {
    const response = createResponse();
    handler({}, response);

    assert.equal(response.statusCode, 200);
    assert.equal(response.jsonBody.ok, true);
    assert.equal(JSON.stringify(response.jsonBody).includes('test-password'), false);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
});

test('Nhost function reports missing variables safely', () => {
  const previous = {
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD,
    API_KEY: process.env.API_KEY,
  };

  delete process.env.USERNAME;
  process.env.PASSWORD = 'test-password';
  process.env.API_KEY = 'test-api-key';

  try {
    const response = createResponse();
    handler({}, response);

    assert.equal(response.statusCode, 500);
    assert.deepEqual(response.jsonBody, {
      ok: false,
      message: 'One or more required secret variables are missing.',
      missingVariables: ['USERNAME'],
    });
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
});
