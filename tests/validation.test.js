import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createAuthScreen, togglePasswordVisibility } from '../src/ui/auth-screen.js';
import { validateEmail, validateLoginForm } from '../src/ui/validation.js';
import { checkDatabaseAccess, loginWithIdentifier } from '../src/services/auth.js';
import { signOut } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ type: 'mock-auth' })),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback(null);
    return () => {};
  })
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn((db, collectionName, id) => ({ db, collectionName, id })),
  getDoc: vi.fn(),
  getFirestore: vi.fn(() => ({ type: 'mock-firestore' })),
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn()
}));

describe('validateEmail', () => {
  it('aceita e-mails válidos', () => {
    expect(validateEmail('duque@regeron.com')).toBe(true);
  });

  it('rejeita e-mails inválidos', () => {
    expect(validateEmail('duque@')).toBe(false);
  });
});

describe('validateLoginForm', () => {
  it('valida os campos do login', () => {
    expect(validateLoginForm('duque@regeron.com', 'senha123')).toEqual({
      valid: true,
      errors: {}
    });
  });

  it('exige usuário e senha preenchidos', () => {
    const result = validateLoginForm('', '');

    expect(result.valid).toBe(false);
    expect(result.errors).toMatchObject({
      identifier: 'Informe seu usuário ou e-mail.',
      password: 'Informe sua senha.'
    });
  });
});

describe('togglePasswordVisibility', () => {
  it('alterna o tipo do campo para mostrar ou ocultar a senha', () => {
    const input = { type: 'password' };

    expect(togglePasswordVisibility(input, true)).toBe('text');
    expect(input.type).toBe('text');
    expect(togglePasswordVisibility(input, false)).toBe('password');
    expect(input.type).toBe('password');
  });
});

describe('checkDatabaseAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('autoriza quando authentication OK, status active e databaseAccess true', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ status: 'active', databaseAccess: true })
    });

    await expect(checkDatabaseAccess('user-123')).resolves.toMatchObject({
      authorized: true,
      reason: null
    });
  });

  it('nega quando databaseAccess false', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ status: 'active', databaseAccess: false })
    });

    await expect(checkDatabaseAccess('user-123')).resolves.toMatchObject({
      authorized: false,
      reason: 'DATABASE_ACCESS_DENIED'
    });
  });

  it('nega quando databaseAccess inexistente', async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => ({ status: 'active' }) });

    await expect(checkDatabaseAccess('user-123')).resolves.toMatchObject({
      authorized: false,
      reason: 'DATABASE_ACCESS_DENIED'
    });
  });

  it('nega quando status inactive', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ status: 'inactive', databaseAccess: true })
    });

    await expect(checkDatabaseAccess('user-123')).resolves.toMatchObject({
      authorized: false,
      reason: 'USER_INACTIVE'
    });
  });

  it('nega quando o documento de usuario nao existe', async () => {
    getDoc.mockResolvedValue({ exists: () => false });

    await expect(checkDatabaseAccess('user-123')).resolves.toMatchObject({
      authorized: false,
      reason: 'DOCUMENT_NOT_FOUND'
    });
  });

  it('nega quando ocorre erro de Firestore', async () => {
    getDoc.mockRejectedValue(new Error('permission-denied'));

    await expect(checkDatabaseAccess('user-123')).resolves.toMatchObject({
      authorized: false,
      reason: 'FIRESTORE_ERROR'
    });
  });

  it('autoriza sessão restaurada quando status active e databaseAccess true', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ status: 'active', databaseAccess: true })
    });

    await expect(checkDatabaseAccess('session-user')).resolves.toMatchObject({
      authorized: true,
      reason: null
    });
  });

  it('nega sessão restaurada quando databaseAccess false', async () => {
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ status: 'active', databaseAccess: false })
    });

    await expect(checkDatabaseAccess('session-user')).resolves.toMatchObject({
      authorized: false,
      reason: 'DATABASE_ACCESS_DENIED'
    });
  });
});

describe('loginWithIdentifier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('faz signOut quando o usuario autenticado nao tem permissao', async () => {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'user-456', email: 'user@redungeon.com' }
    });
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ status: 'active', databaseAccess: false })
    });

    await expect(loginWithIdentifier('user@redungeon.com', '12345678')).rejects.toMatchObject({
      code: 'DATABASE_ACCESS_DENIED'
    });

    expect(signOut).toHaveBeenCalledTimes(1);
  });
});

describe('createAuthScreen', () => {
  it('renderiza a tela de autenticação administrativa com acesso por login', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);

    createAuthScreen();

    expect(app.querySelector('#login-form')).not.toBeNull();
    expect(app.querySelector('#signup-form')).toBeNull();
    expect(app.querySelector('.info-button')).not.toBeNull();
    expect(app.textContent).toContain('RE:DUNGEON');
    expect(app.textContent).toContain('BANCO DE DADOS');

    app.remove();
  });
});
