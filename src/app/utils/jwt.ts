/* eslint-disable no-useless-catch */
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
const createToken = (
  payload: JwtPayload,
  secret: string,
  options: SignOptions,
) => {
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string, secret: string) => {
  try {
    const decodedToken = jwt.verify(token, secret) as JwtPayload;
    return {
        success:true,
        data:decodedToken
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    return{
        success:false,
        message:error.message,
        error:error
    }
  }
};

const decodeToken = (token: string) => {
  return jwt.decode(token);
};

export const jwtUtils = {
  createToken,
  verifyToken,
  decodeToken,
};
