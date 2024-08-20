module.exports = [
  'strapi::logger',
  'strapi::errors',
  
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // 'connect-src': ["'self'", 'https:'],
          'connect-src': ["'self'", 'https:', 'http://127.0.0.1:1337'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },

  
  
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:3000'], // Add your Next.js frontend URL
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization'],
      keepHeaderOnError: true,
    },
  },

  // 'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
