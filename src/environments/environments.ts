export const environment = {
  production: false,
  apiBaseUrl: process.env['NGROK_URL'] || 'http://localhost:5140',
  uploadsBaseUrl: process.env['NGROK_URL'] || 'http://localhost:5140',
};
