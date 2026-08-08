const REQUIRED_VARIABLES = ['USERNAME', 'PASSWORD', 'API_KEY'];

function readRequiredVariables() {
  return Object.fromEntries(
    REQUIRED_VARIABLES.map((key) => {
      const value = process.env[key];

      if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
      }

      return [key, value];
    }),
  );
}

function describeConfiguration(values) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, {
      configured: true,
      length: value.length,
    }]),
  );
}

export default async function ({ res, log, error }) {
  try {
    const values = readRequiredVariables();

    log('Required secret variables are configured.');

    return res.json({
      ok: true,
      message: 'The three secret variables were read successfully.',
      variables: describeConfiguration(values),
    });
  } catch (configurationError) {
    error(configurationError.message);

    return res.json({
      ok: false,
      message: 'One or more required secret variables are missing.',
    }, 500);
  }
}
