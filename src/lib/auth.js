import { getAuth } from 'firebase/auth';
import { app } from '../services/firebase.js';

export const auth = app ? getAuth(app) : null;
