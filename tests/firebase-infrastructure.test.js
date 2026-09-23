import { describe, expect, it } from 'vitest';

import { app as officialApp, db as officialDb } from '../src/services/firebase.js';
import { app as libApp, db as libDb } from '../src/lib/firebase.js';
import { auth as libAuth } from '../src/lib/auth.js';
import { firestore as libFirestore } from '../src/lib/firestore.js';

describe('firebase infrastructure', () => {
  it('keeps a single Firebase web app and exposes Firestore/Auth through the shared lib layer', () => {
    expect(libApp).toBe(officialApp);
    expect(libDb).toBe(officialDb);
    expect(libAuth).toBeTruthy();
    expect(libFirestore).toBe(officialDb);
  });
});
