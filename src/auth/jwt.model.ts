export interface JwtPayload {
  name: string;
  email: string;
  password: string;
  iat: number;
  exp: number;
}
