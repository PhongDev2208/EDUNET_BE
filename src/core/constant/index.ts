export const getJwtSecret = () => process.env.JWT_SECRET ?? '';

export const getPasswordSecret = () => process.env.PASSWORD_SECRET ?? '';

export const getFrontendUrl = () => process.env.FE_URL ?? 'http://localhost:5173';
