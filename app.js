const stream = document.querySelector('#chat-stream');
const composer = document.querySelector('#composer');
const input = document.querySelector('#message-input');
const typing = document.querySelector('#typing');
const toast = document.querySelector('#toast');
const modePill = document.querySelector('#mode-pill');
const statusText = document.querySelector('#status-text');
const escalateBtn = document.querySelector('#escalate-btn');

const answers = [
  { match: ['horario', 'atienden'], answer: 'Nuestro horario de atención es de lunes a viernes, de 9 a 18 h. Fuera de ese horario puedo seguir ayudándote con consultas frecuentes.' },
  { match: ['pago', 'medios'], answer: 'Podés pagar con tarjeta de crédito o débito, transferencia bancaria y Mercado Pago. Las compras por transferencia tienen un 10% de descuento.' },
  { match: ['envío', 'envio', 'demora'], answer: 'Realizamos envíos a todo el país. El plazo habitual es de 3 a 5 días hábiles y podés seguir el pedido desde el enlace que enviamos por WhatsApp.' },
  { match: ['cambiar', 'devolución', 'devolucion'], answer: 'Podés solicitar un cambio dentro de los 30 días posteriores a la compra. Para ayudarte necesito el número de pedido.' },
  { match: ['precio', 'cuesta', 'costo'], answer: 'Para calcular el valor exacto necesito el producto y tu código postal. Si me compartís esos datos, te doy una respuesta inmediata.' }
];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

function addMessage(text, type, meta = '') {
  const box = document.createElement('div');
  box.className = `message ${type}`;
  const p = document.createElement('p');
  p.textContent = text;
  const time = document.createElement('time');
  time.textContent = `${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}${meta}`;
  box.append(p, time);
  stream.appendChild(box);
  stream.scrollTop = stream.scrollHeight;
}

function findAnswer(question) {
  const normalized = question.toLowerCase();
  return answers.find(item => item.match.some(word => normalized.includes(word)))?.answer || 'Entiendo tu consulta. Para darte una respuesta precisa, voy a derivarla a una persona del equipo junto con el resumen de esta conversación.';
}

function simulateAI(question) {
  typing.classList.remove('hidden');
  setTimeout(() => {
    typing.classList.add('hidden');
    const answer = findAnswer(question);
    const label = document.createElement('div');
    label.className = 'ai-label';
    label.innerHTML = '<span>✦</span> RESPUESTA AUTOMÁTICA · 94% CONFIANZA';
    stream.appendChild(label);
    addMessage(answer, 'outgoing', ' ✓✓');
  }, 900);
}

composer.addEventListener('submit', event => {
  event.preventDefault();
  const question = input.value.trim();
  if (!question) return;
  addMessage(question, 'incoming');
  input.value = '';
  simulateAI(question);
});

document.querySelector('#send-suggestion').addEventListener('click', () => {
  const text = document.querySelector('#suggested-text').textContent.trim();
  addMessage(text, 'outgoing', ' ✓✓');
  document.querySelector('.suggestion-box').classList.add('sent');
  showToast('Respuesta enviada y registrada');
});

document.querySelector('#edit-suggestion').addEventListener('click', () => {
  input.value = document.querySelector('#suggested-text').textContent.trim();
  input.focus();
});

escalateBtn.addEventListener('click', () => {
  const isHuman = modePill.classList.toggle('human');
  modePill.innerHTML = isHuman ? '<b>●</b> Agente humano' : '<b>✦</b> IA atendiendo';
  statusText.textContent = isHuman ? 'Derivado a humano' : 'Automatizado';
  escalateBtn.querySelector('strong').textContent = isHuman ? 'Devolver a la IA' : 'Derivar a una persona';
  showToast(isHuman ? 'Conversación derivada con resumen y contexto' : 'Automatización reactivada');
});

document.querySelectorAll('.conversation').forEach(item => item.addEventListener('click', () => {
  document.querySelectorAll('.conversation').forEach(el => el.classList.remove('active'));
  item.classList.add('active');
  if (item.dataset.contact !== 'valentina') showToast('Demo: seleccioná a Valentina para probar el flujo completo');
}));
