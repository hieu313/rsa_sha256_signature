export const API_ROUTES = {
  AUTH: {
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
  },
  USER: {
    ME: `/users/me`,
    PUBLIC_KEYS: `/users/me/public-keys`,
    ACTIVE_PUBLIC_KEYS: `/users/me/public-keys/active`,
  },
  PUBLIC_KEY: {
    UPLOAD: `/public-keys`,
    REVOKE: (keyId: string) => `/public-keys/${keyId}`,
    UPDATE: (keyId: string) => `/public-keys/${keyId}`,
  },
  SIGN: {
    CONTENT: `/sign/create-document`,
    VERIFY: `/sign/verify-signature`,
  },
  VERIFY: {
    CONTENT: `/verify`,
  },
};
