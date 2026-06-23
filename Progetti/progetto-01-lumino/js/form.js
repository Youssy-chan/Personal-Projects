/* ============================================================
   LUMINO — form.js
   Validazione client-side del form di contatto
   ============================================================ */

'use strict';

const form        = document.getElementById('contact-form');
const nameInput   = document.getElementById('name');
const emailInput  = document.getElementById('email');
const msgInput    = document.getElementById('message');
const charCount   = document.getElementById('char-count');
const submitBtn   = document.getElementById('submit-btn');
const btnText     = submitBtn.querySelector('.btn-text');
const btnSpinner  = submitBtn.querySelector('.btn-spinner');
const formSuccess = document.getElementById('form-success');

// ── Validators ────────────────────────────────────────────
const validators = {
  name: (val) => {
    if (!val.trim()) return 'Il nome è obbligatorio.';
    if (val.trim().length < 2) return 'Il nome deve avere almeno 2 caratteri.';
    return null;
  },
  email: (val) => {
    if (!val.trim()) return 'L\'email è obbligatoria.';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(val)) return 'Inserisci un\'email valida.';
    return null;
  },
  message: (val) => {
    if (!val.trim()) return 'Il messaggio è obbligatorio.';
    if (val.trim().length < 10) return `Minimo 10 caratteri (ora: ${val.trim().length}).`;
    return null;
  },
};

// ── Show / clear error ────────────────────────────────────
function showError(input, message) {
  const errorEl = document.getElementById(`${input.id}-error`);
  input.classList.add('error');
  input.setAttribute('aria-invalid', 'true');
  if (errorEl) errorEl.textContent = message;
}

function clearError(input) {
  const errorEl = document.getElementById(`${input.id}-error`);
  input.classList.remove('error');
  input.removeAttribute('aria-invalid');
  if (errorEl) errorEl.textContent = '';
}

// ── Validate single field ─────────────────────────────────
function validateField(input, validatorKey) {
  const error = validators[validatorKey]?.(input.value);
  if (error) {
    showError(input, error);
    return false;
  }
  clearError(input);
  return true;
}

// ── Live validation on blur ───────────────────────────────
nameInput.addEventListener('blur', () => validateField(nameInput, 'name'));
emailInput.addEventListener('blur', () => validateField(emailInput, 'email'));
msgInput.addEventListener('blur', () => validateField(msgInput, 'message'));

// ── Clear error on input ──────────────────────────────────
[nameInput, emailInput, msgInput].forEach(input => {
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) {
      clearError(input);
    }
  });
});

// ── Character counter for message ────────────────────────
msgInput.addEventListener('input', () => {
  const len = msgInput.value.length;
  charCount.textContent = `${len} caratteri`;
  charCount.style.color = len < 10 ? 'var(--clr-error)' : 'var(--clr-muted)';
});

// ── Set loading state ─────────────────────────────────────
function setLoading(loading) {
  submitBtn.disabled = loading;
  btnText.hidden = loading;
  btnSpinner.hidden = !loading;
}

// ── Form submit ───────────────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate all fields
  const nameValid  = validateField(nameInput, 'name');
  const emailValid = validateField(emailInput, 'email');
  const msgValid   = validateField(msgInput, 'message');

  if (!nameValid || !emailValid || !msgValid) {
    // Focus first invalid field
    const firstInvalid = form.querySelector('.error');
    firstInvalid?.focus();
    return;
  }

  // Loading state
  setLoading(true);

  try {
    // Simulate network delay (replace with actual fetch for Netlify Forms)
    await new Promise(resolve => setTimeout(resolve, 1200));

    /*
    // For Netlify Forms (uncomment when deployed):
    const data = new FormData(form);
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString(),
    });
    if (!response.ok) throw new Error('Network error');
    */

    // Success
    form.reset();
    charCount.textContent = '0 caratteri';
    formSuccess.removeAttribute('hidden');
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Hide success message after 6s
    setTimeout(() => {
      formSuccess.setAttribute('hidden', '');
    }, 6000);

  } catch (err) {
    console.error('Form error:', err);
    showError(submitBtn, 'Errore nell\'invio. Riprova tra poco.');
  } finally {
    setLoading(false);
  }
});
