import { Application } from 'express';
import asyncMethod from '../shared/async-method';
import test from '../app/testMethod';
import credit from '../app/creditMethod';

export default (app: Application): void => {
  app.get('/test', asyncMethod(test));
  app.post('/credit-search', asyncMethod(credit));
};
