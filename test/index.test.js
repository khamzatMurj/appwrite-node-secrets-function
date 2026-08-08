import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../index.js';

function createContext() {
  const response = {
    jsonBody: undefined,
    statusCode: undefined,
    json(body, statusCode = 200) {
      this.jsonBody = body;
      this.statusCode = statusCode;
      return body;
    },
  };

  return {
    response,
    context: {
      res: response,
      log() {},
      error() {},
    },
  };
}

test('reports all three variables as configured without returning values', async () => {
  const previous = {
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD,
    API_KEY: process.env.API_KEY,
  };

  process.env.USERNAME = 'test-user';
  process.env.PASSWORD = 'test-password';
  process.env.API_KEY = 'test-api-key';

  try {
    const { context, response } = createContext();
    await handler(context);

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.jsonBody, {
      ok: true,
      message: 'The three secret variables were read successfully.',
      variables: {
        USERNAME: { configured: true, length: 9 },
        PASSWORD: { configured: true, length: 13 },
        API_KEY: { configured: true, length: 12 },
      },
    });
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

test('returns a safe error when a variable is missing', async () => {
  const previous = process.env.API_KEY;
  delete process.env.API_KEY;

  try {
    const { context, response } = createContext();
    await handler(context);

    assert.equal(response.statusCode, 500);
    assert.deepEqual(response.jsonBody, {
      ok: false,
      message: 'One or more required secret variables are missing.',
    });
  } finally {
    if (previous === undefined) {
      delete process.env.API_KEY;
    } else {
      process.env.API_KEY = previous;
    }
  }
});
