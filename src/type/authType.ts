import { ZodFormattedError } from 'zod';
import { Tables } from './database';

export type AuthInput = {
  email: string;
  nickname?: string;
  password: string;
};

export type AuthField = 'email' | 'nickname' | 'password';

export type AuthResult =
  | {
      error: ZodFormattedError<
        {
          email: string;
          nickname: string;
          password: string;
        },
        string
      >;
      message?: undefined;
    }
  | {
      message: string;
      error?: undefined;
    };

type ExtractErrorType<T> = T extends { error: infer E } ? E : never;

export type AuthValiationErr = ExtractErrorType<AuthResult>;