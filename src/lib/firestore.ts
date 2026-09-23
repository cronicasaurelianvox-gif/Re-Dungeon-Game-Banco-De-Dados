import { getFirestore } from 'firebase/firestore';

import { app } from './firebase.ts';

export const firestore = app ? getFirestore(app) : null;
export const db = firestore;

export default firestore;
