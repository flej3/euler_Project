// src/types/express/index.d.ts
import express from 'express';
import { User } from '../gitlab.type';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
