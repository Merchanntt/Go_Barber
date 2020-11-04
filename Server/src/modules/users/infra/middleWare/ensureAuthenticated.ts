import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/error/appError';

import Secret from '@config/auth';

interface ITokenPayLoad {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthentucated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authToken = request.headers.authorization;

  if (!authToken) {
    throw new AppError('Token is missing!', 401);
  }

  const [, token] = authToken.split(' ');

  try {
    const decoded = verify(token, Secret.jwt.secret);

    const { sub } = decoded as ITokenPayLoad;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid Token!', 401);
  }
}
