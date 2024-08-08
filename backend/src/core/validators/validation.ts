import { ValidationOptions } from 'class-validator';

export const getValidateOptions = (message: string): ValidationOptions => ({
  message,
  each: true,
  always: true,
});
