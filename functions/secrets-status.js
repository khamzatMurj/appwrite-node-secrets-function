const REQUIRED_VARIABLES = ['USERNAME', 'PASSWORD', 'API_KEY'];

export default function handler(_request, response) {
  const missingVariables = REQUIRED_VARIABLES.filter((key) => !process.env[key]);

  if (missingVariables.length > 0) {
    return response.status(500).json({
      ok: false,
      message: 'One or more required secret variables are missing.',
      missingVariables,
    });
  }

  return response.status(200).json({
    ok: true,
    message: 'The three secret variables were read successfully.',
    variables: Object.fromEntries(
      REQUIRED_VARIABLES.map((key) => [key, {
        configured: true,
        length: process.env[key].length,
      }]),
    ),
  });
}
