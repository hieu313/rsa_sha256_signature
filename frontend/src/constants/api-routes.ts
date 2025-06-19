export const API_ROUTES = {
  AUTH: {
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
  },
  USER: {
    ME: `/users/me`,
    PUBLIC_KEYS: `/users/me/public-keys`,
  },
  PUBLIC_KEY: {
    UPLOAD: `/public-keys`,
    DELETE: (keyId: string) => `/public-keys/${keyId}`,
  },
};
