import { loginWithIdentifier, requestPasswordReset } from '../services/auth.js';
import { validateEmail, validateLoginForm, validateSignupForm } from './validation.js';

export function togglePasswordVisibility(input, shouldShow) {
  if (!input) {
    return null;
  }

  input.type = shouldShow ? 'text' : 'password';
  return input.type;
}

export function createAuthScreen() {
  const app = document.querySelector('#app');

  if (!app) {
    return null;
  }

  app.innerHTML = `
    <div class="auth-scene" aria-label="Tela inicial de autenticação do banco de dados">
      <div class="ambient ambient-left"></div>
      <div class="ambient ambient-right"></div>

      <main class="auth-panel" aria-live="polite">
        <div class="panel-emblem" aria-hidden="true">R</div>

        <header class="auth-header">
          <p class="eyebrow">RE : D U N G E O N</p>
          <h1>
            <span class="title-main">RE:DUNGEON</span>
            <span class="title-sub">BANCO DE DADOS</span>
            <span class="title-version">SISTEMA ADMINISTRATIVO</span>
          </h1>
        </header>

        <section class="auth-form-panel is-active" data-view="login" aria-label="Formulário de acesso ao sistema">
          <div class="form-header">
            <h2>Acessar o sistema</h2>
            <p>Gerencie os dados e conteúdos do universo Re:Dungeon.</p>
          </div>

          <form id="login-form" novalidate>
            <div class="field-group">
              <label for="login-identifier">E-mail</label>
              <input
                id="login-identifier"
                name="identifier"
                type="email"
                placeholder="administrador@redungeon.com"
                autocomplete="email"
                aria-describedby="login-identifier-help"
              />
              <small id="login-identifier-help" class="field-hint">Utilize seu e-mail administrativo.</small>
            </div>

            <div class="field-group">
              <label for="login-password">Senha</label>
              <div class="password-field">
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Sua senha"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="password-toggle"
                  data-target="login-password"
                  aria-label="Mostrar senha"
                  aria-pressed="false"
                  title="Mostrar senha"
                >
                  <span aria-hidden="true">👁</span>
                </button>
              </div>
            </div>

            <button type="submit" class="primary-button">Entrar no sistema</button>
          </form>

          <div class="meta-links">
            <button type="button" class="text-button info-button">Esqueceu sua senha?</button>
          </div>
        </section>

        <div class="system-message" id="system-message" aria-live="polite" aria-atomic="true"></div>
      </main>

      <footer class="auth-footer">
        <p>RE:DUNGEON — BANCO DE DADOS</p>
        <p>SISTEMA ADMINISTRATIVO</p>
        <small>Gerenciamento de conteúdo e dados do Re:Dungeon.</small>
      </footer>
    </div>
  `;

  const messageBox = app.querySelector('#system-message');
  const loginSection = app.querySelector('[data-view="login"]');
  const loginForm = app.querySelector('#login-form');
  let activeView = 'login';

  const setMessage = (type, text) => {
    if (!messageBox) return;

    messageBox.className = `system-message ${type}`;
    messageBox.textContent = text;
  };

  const setLoadingState = (button, isLoading, label) => {
    if (!button) return;

    button.disabled = isLoading;
    button.textContent = isLoading ? 'Aguarde...' : label;
  };

  const showView = (view) => {
    activeView = view;

    if (view === 'login') {
      loginSection.hidden = false;
      loginSection.classList.add('is-active');
      const field = app.querySelector('#login-identifier');
      field?.focus();
    }
  };

  const attachFieldValidation = (field) => {
    if (!field) return;

    field.addEventListener('input', () => {
      field.classList.remove('is-invalid');
      const message = field.parentElement?.querySelector('.field-error');
      message?.remove();
    });
  };

  app.querySelectorAll('.field-group input').forEach(attachFieldValidation);

  const attachPasswordToggle = (button) => {
    const input = app.querySelector(`#${button.dataset.target}`);

    if (!button || !input) {
      return;
    }

    button.addEventListener('click', () => {
      const shouldShow = input.type === 'password';
      const nextType = togglePasswordVisibility(input, shouldShow);

      button.setAttribute('aria-label', nextType === 'text' ? 'Ocultar senha' : 'Mostrar senha');
      button.setAttribute('aria-pressed', String(shouldShow));
      button.title = nextType === 'text' ? 'Ocultar senha' : 'Mostrar senha';
      button.innerHTML =
        nextType === 'text'
          ? '<span aria-hidden="true">🙈</span>'
          : '<span aria-hidden="true">👁</span>';
    });
  };

  app.querySelectorAll('.password-toggle').forEach(attachPasswordToggle);

  const showFieldError = (field, message) => {
    if (!field) return;

    field.classList.add('is-invalid');

    const existingError = field.parentElement?.querySelector('.field-error');
    if (existingError) {
      existingError.textContent = message;
      return;
    }

    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    field.parentElement?.appendChild(error);
  };

  app.querySelector('.info-button')?.addEventListener('click', () => {
    openPasswordResetModal();
  });

  function openPasswordResetModal() {
    let modal = app.querySelector('#password-reset-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'password-reset-modal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="pr-title">
          <header class="modal-header">
            <h2 id="pr-title">Recuperar acesso</h2>
            <button class="modal-close" aria-label="Fechar">✖</button>
          </header>
          <div class="modal-body">
            <p class="eyebrow">ACESSO ADMINISTRATIVO</p>
            <p>Informe o e-mail da sua conta e enviaremos um link seguro para redefinir sua senha.</p>

            <form id="password-reset-form">
              <div class="field-group">
                <label for="pr-email">E-mail da conta</label>
                <input id="pr-email" name="email" type="email" autocomplete="email" required />
              </div>

              <div class="actions">
                <button type="submit" class="primary-button">Enviar link de recuperação</button>
                <button type="button" class="text-button pr-back">Voltar para entrar</button>
              </div>
              <div id="pr-message" class="system-message" aria-live="polite"></div>
            </form>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const closeBtn = modal.querySelector('.modal-close');
      const backBtn = modal.querySelector('.pr-back');
      const form = modal.querySelector('#password-reset-form');
      const emailInput = modal.querySelector('#pr-email');
      const prMessage = modal.querySelector('#pr-message');

      function closeModal() {
        modal.remove();
        const field = app.querySelector('#login-identifier');
        field?.focus();
      }

      closeBtn.addEventListener('click', closeModal);
      backBtn.addEventListener('click', closeModal);

      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
      });

      form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const submitBtn = form.querySelector('.primary-button');
        const email = String(emailInput.value ?? '').trim();

        prMessage.className = 'system-message info';
        prMessage.textContent = 'Enviando link de recuperação...';
        submitBtn.disabled = true;

        try {
          await requestPasswordReset(email);
          prMessage.className = 'system-message success';
          prMessage.textContent =
            'O mensageiro foi enviado. Verifique seu e-mail e a pasta de spam.';
        } catch (err) {
          prMessage.className = 'system-message error';
          const msg =
            err?.message || 'Não foi possível enviar o link de recuperação. Tente novamente.';
          if (err?.code === 'auth/user-not-found') {
            prMessage.textContent =
              'Se existir uma conta com esse e-mail, enviaremos um link de recuperação.';
          } else {
            prMessage.textContent = msg;
          }
        } finally {
          submitBtn.disabled = false;
        }
      });

      modal.querySelector('#pr-email')?.focus();
    } else {
      modal.querySelector('#pr-email')?.focus();
    }
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const loginButton = loginForm.querySelector('.primary-button');
    const identifier = loginForm.identifier.value;
    const password = loginForm.password.value;
    const result = validateLoginForm(identifier, password);

    app.querySelectorAll('#login-form input').forEach((input) => {
      input.classList.remove('is-invalid');
      const error = input.parentElement?.querySelector('.field-error');
      error?.remove();
    });

    if (!result.valid) {
      const fieldMap = {
        identifier: loginForm.identifier,
        password: loginForm.password
      };

      Object.entries(result.errors).forEach(([key, message]) => {
        showFieldError(fieldMap[key], message);
      });

      setMessage('error', 'Os dados informados não são válidos.');
      return;
    }

    try {
      setLoadingState(loginButton, true, 'Entrar no sistema');
      setMessage('info', 'Autenticando acesso...');

      const normalizedIdentifier = identifier.trim();
      const user = await loginWithIdentifier(normalizedIdentifier, password);
      const displayName =
        user?.displayName || normalizedIdentifier.split('@')[0] || 'Administrador';
      setMessage('info', 'Verificando permissão administrativa...');
      setMessage('success', `Acesso confirmado. ${user.email || displayName}.`);
      void displayName;
    } catch (error) {
      if (error?.message === 'Firebase não configurado.') {
        setMessage('info', 'Firebase ainda não está conectado.');
        return;
      }

      if (error?.code === 'USER_NOT_FOUND') {
        setMessage('error', 'Usuário não encontrado. Verifique seu nome ou e-mail.');
      } else if (error?.code === 'USER_INACTIVE') {
        setMessage('error', 'Esta conta não está habilitada para acessar o sistema.');
      } else if (error?.code === 'DATABASE_ACCESS_DENIED' || error?.code === 'DOCUMENT_NOT_FOUND') {
        setMessage('error', 'Esta conta não possui autorização para acessar o Banco de Dados.');
      } else if (error?.code === 'FIRESTORE_ERROR') {
        setMessage('error', 'Não foi possível verificar sua permissão de acesso. Tente novamente.');
      } else {
        setMessage('error', 'Não foi possível autenticar o acesso. Verifique seus dados.');
      }
    } finally {
      setLoadingState(loginButton, false, 'Entrar no sistema');
    }
  });

  setMessage('info', 'Verificando credenciais...');
  showView(activeView);

  return {
    setMessage,
    showView,
    validateEmail,
    validateLoginForm,
    validateSignupForm
  };
}
