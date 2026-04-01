export interface JwtPayload {
  userId: number;
  username: string;
  email?: string;
  tokenVersion: number;
  iat: number;
  exp: number;
}
