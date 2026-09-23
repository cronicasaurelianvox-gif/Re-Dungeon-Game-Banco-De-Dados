import { getAuth } from 'firebase/auth';

import { app } from './firebase.ts';

export const auth = app ? getAuth(app) : null;

export default auth;
