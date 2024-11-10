export const Environment = {
  local: 'local',
  development: 'development',
  production: 'production',
  staging: 'staging',
} as const;

export type Environment = (typeof Environment)[keyof typeof Environment];

export default () => ({
  env: process.env.NODE_ENV,

  app: {
    name: process.env.APP_NAME,
    port: parseInt(process.env.PORT || '4200', 10),
  },

  frontend: {
    url: process.env.FRONTEND_URL,
  },

  auth: {
    salt: parseInt(process.env.SALT || '10', 10),
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
  },

  throttler: {
    ttl: parseInt(process.env.THROTTLER_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLER_LIMIT || '20', 10),
  },

  mail: {
    key: {
      private: process.env.MAILJET_API_KEY_PRIVATE,
      public: process.env.MAILJET_API_KEY_PUBLIC,
    },
  },
});
