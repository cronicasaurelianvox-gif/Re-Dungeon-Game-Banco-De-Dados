import './styles/main.css';
import './styles/auth-screen.css';
import { startDatabaseAccessMonitor } from './services/auth.js';
import { createAuthScreen } from './ui/auth-screen.js';

const app = document.querySelector('#app');

if (app) {
  app.setAttribute('aria-live', 'polite');
  const authScreen = createAuthScreen();

  startDatabaseAccessMonitor(({ state, reason }) => {
    if (!authScreen?.setMessage) {
      return;
    }

    if (state === 'CHECKING_ACCESS') {
      authScreen.setMessage('info', 'Verificando permissão administrativa...');
      return;
    }

    if (state === 'AUTHORIZED') {
      authScreen.setMessage('success', 'Acesso autorizado.');
      return;
    }

    if (state === 'UNAUTHORIZED') {
      if (reason === 'USER_INACTIVE') {
        authScreen.setMessage('error', 'Esta conta não está habilitada para acessar o sistema.');
        return;
      }

      if (reason === 'DATABASE_ACCESS_DENIED' || reason === 'DOCUMENT_NOT_FOUND') {
        authScreen.setMessage(
          'error',
          'Esta conta não possui autorização para acessar o Banco de Dados.'
        );
        return;
      }

      if (reason === 'FIRESTORE_ERROR') {
        authScreen.setMessage(
          'error',
          'Não foi possível verificar sua permissão de acesso. Tente novamente.'
        );
        return;
      }

      authScreen.setMessage('info', 'Conecte-se para acessar o Banco de Dados.');
    }
  });
}
