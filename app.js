const STORAGE_KEY = 'nova-redirect-config';
const METRICS_KEY = 'nova-demo-metrics';
const defaultConfig = { destination: 'destino.html', active: true };

function readConfig() {
  try { return { ...defaultConfig, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { return defaultConfig; }
}

function readMetrics() {
  try { return { visits: 1284, clicks: 976, ...JSON.parse(localStorage.getItem(METRICS_KEY) || '{}') }; }
  catch { return { visits: 1284, clicks: 976 }; }
}

function saveMetrics(metrics) { localStorage.setItem(METRICS_KEY, JSON.stringify(metrics)); }

const ageCheck = document.querySelector('#age-check');
const continueBtn = document.querySelector('#continue-btn');
if (ageCheck && continueBtn) {
  const metrics = readMetrics();
  metrics.visits += 1;
  saveMetrics(metrics);

  ageCheck.addEventListener('change', () => { continueBtn.disabled = !ageCheck.checked; });
  continueBtn.addEventListener('click', () => {
    const config = readConfig();
    if (!config.active) return alert('Esta campaña se encuentra pausada.');
    const updated = readMetrics();
    updated.clicks += 1;
    saveMetrics(updated);
    const overlay = document.querySelector('#redirect-overlay');
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => { window.location.href = config.destination || 'destino.html'; }, 900);
  });
  document.querySelector('#leave-btn').addEventListener('click', () => { window.location.href = 'https://www.google.com'; });
}

const form = document.querySelector('#redirect-form');
if (form) {
  const input = document.querySelector('#destination-url');
  const active = document.querySelector('#campaign-active');
  const switchText = document.querySelector('#switch-text');
  const config = readConfig();
  const metrics = readMetrics();
  input.value = config.destination;
  active.checked = config.active;
  switchText.textContent = active.checked ? 'Activa' : 'Pausada';
  document.querySelector('#stat-visits').textContent = metrics.visits.toLocaleString('es-AR');
  document.querySelector('#stat-clicks').textContent = metrics.clicks.toLocaleString('es-AR');
  document.querySelector('#stat-rate').textContent = `${((metrics.clicks / metrics.visits) * 100).toFixed(1).replace('.', ',')}%`;

  active.addEventListener('change', () => { switchText.textContent = active.checked ? 'Activa' : 'Pausada'; });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ destination: input.value.trim(), active: active.checked }));
    const toast = document.querySelector('#save-toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
  });
  document.querySelector('#test-btn').addEventListener('click', () => window.open(input.value || 'destino.html', '_blank', 'noopener'));
}
