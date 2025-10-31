// (See script from previous cell; included fully here.)
const views = {
  'login-admin': document.getElementById('view-login-admin'),
  admin: document.getElementById('view-admin'),
  'login-passageiro': document.getElementById('view-login-passageiro'),
  home: document.getElementById('view-home'),
  resultados: document.getElementById('view-resultados'),
  assentos: document.getElementById('view-assentos'),
  dados: document.getElementById('view-dados'),
  pagamento: document.getElementById('view-pagamento'),
  confirmacao: document.getElementById('view-confirmacao'),
  ajuda: document.getElementById('view-ajuda'),
  'minhas-compras': document.getElementById('view-minhas-compras'),
  bilhete: document.getElementById('view-bilhete'),
};
function go(viewName) {
  document.querySelectorAll('[data-view]').forEach(v => v.classList.remove('active'));
  (views[viewName] || views.home).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.querySelectorAll('[data-nav]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-nav');
    go(target);
    if (target === 'minhas-compras') { renderReservas(); }
  });
});

const LS = { flightsKey: 'airtrip.flights', usersKey: 'airtrip.users', sessionKey: 'airtrip.session', reservKey: 'airtrip.reservas' };
const store = {
  getFlights() { const v = JSON.parse(localStorage.getItem(LS.flightsKey) || '[]'); if (!v.length) { seedFlights(); return JSON.parse(localStorage.getItem(LS.flightsKey) || '[]'); } return v; },
  setFlights(list) { localStorage.setItem(LS.flightsKey, JSON.stringify(list)); },
  getUsers() { return JSON.parse(localStorage.getItem(LS.usersKey) || '[]'); },
  setUsers(list) { localStorage.setItem(LS.usersKey, JSON.stringify(list)); },
  getSession() { return JSON.parse(localStorage.getItem(LS.sessionKey) || 'null'); },
  setSession(sess) { localStorage.setItem(LS.sessionKey, JSON.stringify(sess)); },
  clearSession() { localStorage.removeItem(LS.sessionKey); },
  getReservas() { return JSON.parse(localStorage.getItem(LS.reservKey) || '[]'); },
  setReservas(list) { localStorage.setItem(LS.reservKey, JSON.stringify(list)); },
};
function seedFlights() {
  const seed = [
    { id: 'AT101', airline: 'Azul', number: 'AD-101', origin: 'FOR', dest: 'GRU', departISO: '2025-11-25 06:35', arriveISO: '2025-11-25 10:10', depart: '06:35', arrive: '10:10', duration: '3h35', stops: 0, price: 649.90 },
    { id: 'AT234', airline: 'LATAM', number: 'LA-234', origin: 'FOR', dest: 'GRU', departISO: '2025-11-25 09:20', arriveISO: '2025-11-25 13:30', depart: '09:20', arrive: '13:30', duration: '4h10', stops: 1, price: 589.00 },
    { id: 'AT777', airline: 'GOL', number: 'G3-777', origin: 'FOR', dest: 'GRU', departISO: '2025-11-25 12:40', arriveISO: '2025-11-25 16:15', depart: '12:40', arrive: '16:15', duration: '3h35', stops: 0, price: 719.00 },
    { id: 'AT402', airline: 'LATAM', number: 'LA-402', origin: 'FOR', dest: 'GRU', departISO: '2025-11-25 19:10', arriveISO: '2025-11-25 23:20', depart: '19:10', arrive: '23:20', duration: '4h10', stops: 1, price: 579.90 },
    { id: 'AT901', airline: 'Azul', number: 'AD-901', origin: 'FOR', dest: 'GRU', departISO: '2025-11-25 21:00', arriveISO: '2025-11-26 00:30', depart: '21:00', arrive: '00:30', duration: '3h30', stops: 0, price: 799.90 },
  ];
  localStorage.setItem(LS.flightsKey, JSON.stringify(seed));
}

const formLoginAdmin = document.getElementById('form-login-admin');
formLoginAdmin?.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('admin-user').value.trim();
  const pass = document.getElementById('admin-pass').value.trim();
  if (user === 'admin' && pass === '1234') { store.setSession({ role: 'admin', user: 'admin' }); renderAdmin(); go('admin'); }
  else alert('Credenciais inválidas.');
});

const listaAdminVoos = document.getElementById('lista-admin-voos');
const formVoo = document.getElementById('form-voo');
const btnLimparVoo = document.getElementById('btn-limpar-voo');

function renderAdmin() {
  const flights = store.getFlights();
  listaAdminVoos.innerHTML = '';
  if (!flights.length) { listaAdminVoos.innerHTML = '<p class="small">Nenhum voo cadastrado.</p>'; return; }
  flights.forEach((f) => {
    const item = document.createElement('div');
    item.className = 'flight';
    item.innerHTML = `
      <div class="airline">${f.airline} <span class="badge">${f.number}</span></div>
      <div><div><strong>${f.depart}</strong> • ${f.origin}</div><div class="small">Partida</div></div>
      <div><div><strong>${f.arrive}</strong> • ${f.dest}</div><div class="small">Chegada</div></div>
      <div><div>${f.duration}</div><div class="small">${f.stops === 0 ? 'Direto' : f.stops + ' parada(s)'}</div></div>
      <div style="text-align:right">
        <div class="price">R$ ${Number(f.price).toFixed(2)}</div>
        <div class="small" style="margin:.25rem 0">${f.id}</div>
        <button class="btn" data-editar="${f.id}">Editar</button>
        <button class="btn outline" data-excluir="${f.id}">Excluir</button>
      </div>`;
    listaAdminVoos.appendChild(item);
  });
  listaAdminVoos.querySelectorAll('[data-editar]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-editar');
      const f = store.getFlights().find(x => x.id === id);
      if (!f) return;
      document.getElementById('voo-id').value = f.id;
      document.getElementById('voo-comp').value = f.airline;
      document.getElementById('voo-num').value = f.number;
      document.getElementById('voo-origem').value = f.origin;
      document.getElementById('voo-dest').value = f.dest;
      document.getElementById('voo-partida').value = f.departISO || '';
      document.getElementById('voo-chegada').value = f.arriveISO || '';
      document.getElementById('voo-dur').value = f.duration;
      document.getElementById('voo-stops').value = String(f.stops);
      document.getElementById('voo-preco').value = f.price;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  listaAdminVoos.querySelectorAll('[data-excluir]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-excluir');
      const next = store.getFlights().filter(x => x.id !== id);
      store.setFlights(next);
      renderAdmin();
    });
  });
}
btnLimparVoo?.addEventListener('click', () => { formVoo.reset(); document.getElementById('voo-id').value = ''; });
formVoo?.addEventListener('submit', (e) => {
  e.preventDefault();
  const idHidden = document.getElementById('voo-id').value;
  const f = {
    id: idHidden || ('AT-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
    airline: document.getElementById('voo-comp').value.trim(),
    number: document.getElementById('voo-num').value.trim(),
    origin: document.getElementById('voo-origem').value.trim().toUpperCase(),
    dest: document.getElementById('voo-dest').value.trim().toUpperCase(),
    departISO: document.getElementById('voo-partida').value.trim(),
    arriveISO: document.getElementById('voo-chegada').value.trim(),
    duration: document.getElementById('voo-dur').value.trim(),
    stops: Number(document.getElementById('voo-stops').value),
    price: Number(document.getElementById('voo-preco').value),
  };
  f.depart = (f.departISO.split(' ')[1] || f.departISO).slice(0, 5);
  f.arrive = (f.arriveISO.split(' ')[1] || f.arriveISO).slice(0, 5);
  const flights = store.getFlights();
  const idx = flights.findIndex(x => x.id === f.id);
  if (idx >= 0) flights[idx] = f; else flights.push(f);
  store.setFlights(flights);
  alert('Voo salvo!'); formVoo.reset(); document.getElementById('voo-id').value = ''; renderAdmin();
});

const formLoginPass = document.getElementById('form-login-pass');
const formCadastro = document.getElementById('form-cadastro');
formLoginPass?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('pass-email').value.trim().toLowerCase();
  const senha = document.getElementById('pass-senha').value;
  const user = store.getUsers().find(u => u.email === email && u.senha === senha);
  if (user) { store.setSession({ role: 'user', email }); alert('Login realizado!'); go('home'); }
  else alert('E-mail ou senha inválidos.');
});
formCadastro?.addEventListener('submit', (e) => {
  e.preventDefault();
  const u = {
    nome: document.getElementById('cad-nome').value.trim(),
    cpf: document.getElementById('cad-cpf').value.trim(),
    telefone: document.getElementById('cad-tel').value.trim(),
    email: document.getElementById('cad-email').value.trim().toLowerCase(),
    senha: document.getElementById('cad-senha').value,
  };
  const users = store.getUsers();
  if (users.some(x => x.email === u.email)) { alert('Já existe uma conta com este e-mail.'); return; }
  users.push(u); store.setUsers(users); store.setSession({ role: 'user', email: u.email });
  alert('Conta criada com sucesso!'); go('home');
});

const formBusca = document.getElementById('form-busca');
const listaVoos = document.getElementById('lista-voos');
const ordenar = document.getElementById('ordenar');
const rangeHora = document.getElementById('range-hora');
const rangeHoraLabel = document.getElementById('range-hora-label');
rangeHora.addEventListener('input', () => { const h = String(rangeHora.value).padStart(2, '0'); rangeHoraLabel.textContent = `A partir de ${h}:00`; renderResultados(); });
ordenar.addEventListener('change', renderResultados);
let ultimaBusca = null;
formBusca.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(formBusca);
  ultimaBusca = { origem: (data.get('origem') || '').trim(), destino: (data.get('destino') || '').trim(), dataIda: data.get('dataIda'), dataVolta: data.get('dataVolta'), passageiros: Number(data.get('passageiros') || 1), classe: data.get('classe') || 'Econômica' };
  reserva.passageiros = ultimaBusca.passageiros; reserva.classe = ultimaBusca.classe; renderResultados(); go('resultados');
});
let filtroParadas = null;
document.querySelectorAll('[data-filter]').forEach(p => {
  p.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(x => x.classList.remove('selected'));
    p.classList.add('selected'); filtroParadas = p.getAttribute('data-filter').split(':')[1]; renderResultados();
  });
});
function horaToInt(hhmm) { return parseInt(hhmm.split(':')[0], 10); }
function toMin(dur) { const [h, m] = dur.replace('h', '').split(' '); return parseInt(h, 10) * 60 + parseInt(m || '0', 10); }
function renderResultados() {
  listaVoos.innerHTML = '';
  if (!ultimaBusca) { listaVoos.innerHTML = '<p class="small">Faça uma busca para ver os resultados.</p>'; return; }
  const flights = store.getFlights();
  const minHour = parseInt(rangeHora.value, 10);
  let results = flights.filter(f => f.origin && ultimaBusca.origem.toUpperCase().includes(f.origin)).filter(f => f.dest && ultimaBusca.destino.toUpperCase().includes(f.dest)).filter(f => horaToInt(f.depart) >= minHour);
  if (filtroParadas === '0') results = results.filter(f => f.stops === 0);
  if (filtroParadas === '1') results = results.filter(f => f.stops === 1);
  if (filtroParadas === '2+') results = results.filter(f => f.stops >= 2);
  if (ordenar.value === 'preco') results.sort((a, b) => a.price - b.price);
  if (ordenar.value === 'duracao') results.sort((a, b) => toMin(a.duration) - toMin(b.duration));
  if (ordenar.value === 'partida') results.sort((a, b) => horaToInt(a.depart) - horaToInt(b.depart));
  for (const f of results) {
    const div = document.createElement('div'); div.className = 'flight card';
    div.innerHTML = `
      <div class="airline">${f.airline} <span class="badge">${f.number}</span></div>
      <div><div><strong>${f.depart}</strong> • ${f.origin}</div><div class="small">Partida</div></div>
      <div><div><strong>${f.arrive}</strong> • ${f.dest}</div><div class="small">Chegada</div></div>
      <div><div>${f.duration}</div><div class="small">${f.stops === 0 ? 'Direto' : f.stops + ' parada(s)'}</div></div>
      <div style="text-align:right">
        <div class="price">R$ ${Number(f.price).toFixed(2)}</div>
        <button class="btn primary" data-escolher="${f.id}">Escolher</button>
      </div>`;
    listaVoos.appendChild(div);
  }
  listaVoos.querySelectorAll('[data-escolher]').forEach(btn => btn.addEventListener('click', () => { escolherVoo(btn.getAttribute('data-escolher')); }));
}

const mapaAssentos = document.getElementById('mapa-assentos');
const resumoAssentos = document.getElementById('resumo-assentos');
const vooEscolhidoEl = document.getElementById('voo-escolhido');
const btnContinuarDados = document.getElementById('btn-continuar-dados');
let reserva = { voo: null, assentos: [], passageiros: 1, classe: 'Econômica', bagagem: 0, dados: {}, pagamento: { metodo: 'credito' }, total: 0 };
function escolherVoo(id) {
  const f = store.getFlights().find(x => x.id === id);
  if (!f) return;
  reserva.voo = f; reserva.assentos = [];
  vooEscolhidoEl.textContent = `Voo ${f.id} • ${f.airline} • ${f.origin} → ${f.dest} • ${f.depart} - ${f.arrive}`;
  desenharAssentos(); atualizarResumoAssentos(); go('assentos');
}
function desenharAssentos() {
  mapaAssentos.innerHTML = '';
  const linhas = 18, colunas = 6, letras = 'ABCDEF';
  for (let i = 1; i <= linhas; i++) {
    for (let j = 0; j < colunas; j++) {
      const id = `${i}${letras[j]}`; const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'seat free';
      if (Math.random() < 0.18) { btn.className = 'seat taken'; btn.disabled = true; }
      btn.setAttribute('aria-label', `Assento ${id}`); btn.addEventListener('click', () => toggleSeat(id, btn)); mapaAssentos.appendChild(btn);
    }
  }
}
function toggleSeat(id, el) {
  const idx = reserva.assentos.indexOf(id);
  if (idx >= 0) { reserva.assentos.splice(idx, 1); el.classList.remove('selected'); }
  else { if (reserva.assentos.length >= reserva.passageiros) { alert('Você já selecionou assentos para todos os passageiros.'); return; } reserva.assentos.push(id); el.classList.add('selected'); }
  atualizarResumoAssentos();
}
function atualizarResumoAssentos() {
  const f = reserva.voo || {}; const total = (f.price || 0) * (reserva.passageiros || 1);
  resumoAssentos.innerHTML = `<p><strong>Voo:</strong> ${f.id || '-'}</p><p><strong>Assentos:</strong> ${reserva.assentos.join(', ') || '—'}</p><p><strong>Passageiros:</strong> ${reserva.passageiros}</p><p><strong>Classe:</strong> ${reserva.classe}</p><hr><p><strong>Total:</strong> R$ ${Number(total).toFixed(2)}</p>`;
}
btnContinuarDados.addEventListener('click', () => { if (reserva.assentos.length === 0) { alert('Selecione ao menos 1 assento.'); return; } go('dados'); });

const formDados = document.getElementById('form-dados');
document.getElementById('btn-ir-pagamento').addEventListener('click', (e) => {
  e.preventDefault();
  const data = new FormData(formDados);
  reserva.dados = { nome: data.get('nome'), cpf: data.get('cpf'), nascimento: data.get('nascimento'), email: data.get('email'), telefone: data.get('telefone') };
  reserva.bagagem = Number(data.get('bagagem') || 0);
  if (!reserva.dados.nome || !reserva.dados.cpf || !reserva.dados.nascimento || !reserva.dados.email) { alert('Preencha os campos obrigatórios.'); return; }
  atualizarResumoFinal(); go('pagamento');
});

const resumoFinal = document.getElementById('resumo-final');
function atualizarResumoFinal() {
  const f = reserva.voo; const bagValor = 120.00 * reserva.bagagem; const subtotal = (f.price * reserva.passageiros); const taxas = Math.round(subtotal * 0.12 * 100) / 100; const total = subtotal + taxas + bagValor; reserva.total = total;
  resumoFinal.innerHTML = `<p><strong>Voo:</strong> ${f.id} • ${f.origin} → ${f.dest}</p><p><strong>Assentos:</strong> ${reserva.assentos.join(', ')}</p><p><strong>Passageiro:</strong> ${reserva.dados.nome}</p><p class="small">Bagagens: ${reserva.bagagem} • Classe: ${reserva.classe}</p><hr><p class="small">Subtotal: R$ ${subtotal.toFixed(2)}</p><p class="small">Taxas (12%): R$ ${taxas.toFixed(2)}</p><p class="small">Bagagem: R$ ${bagValor.toFixed(2)}</p><p><strong>Total: R$ ${total.toFixed(2)}</strong></p>`;
}
document.querySelectorAll('[data-pay]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-pay]').forEach(x => x.classList.remove('selected'));
    btn.classList.add('selected'); const metodo = btn.getAttribute('data-pay'); reserva.pagamento.metodo = metodo;
    document.querySelectorAll('.pay-block').forEach(b => b.classList.add('hidden')); document.getElementById('pag-' + metodo).classList.remove('hidden');
  });
});
document.getElementById('btn-confirmar').addEventListener('click', () => {
  if (reserva.pagamento.metodo === 'credito') { const ok = document.getElementById('nome-cartao').value && document.getElementById('numero-cartao').value; if (!ok) { alert('Preencha os dados do cartão.'); return; } }
  const ticketId = 'RES-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const sess = store.getSession(); const emailUser = (sess?.email) || reserva.dados.email;
  const reservaSalva = { id: ticketId, createdAt: new Date().toISOString(), userEmail: emailUser, voo: reserva.voo, assentos: [...reserva.assentos], passageiros: reserva.passageiros, classe: reserva.classe, bagagem: reserva.bagagem, dados: reserva.dados, pagamento: reserva.pagamento, total: reserva.total, status: 'CONFIRMADA' };
  const all = store.getReservas(); all.push(reservaSalva); store.setReservas(all); mostrarConfirmacao(reservaSalva);
});
function mostrarConfirmacao(r) {
  document.getElementById('codigo-reserva').textContent = `Código da reserva: ${r.id}`;
  const f = r.voo;
  document.getElementById('detalhes-confirmacao').innerHTML = `<p><strong>Passageiro:</strong> ${r.dados.nome}</p><p><strong>Voo:</strong> ${f.id} • ${f.airline} • ${f.origin} → ${f.dest} • ${f.depart} → ${f.arrive}</p><p><strong>Assentos:</strong> ${r.assentos.join(', ')}</p><p><strong>Total pago:</strong> R$ ${Number(r.total).toFixed(2)} • <span class="small">Método: ${r.pagamento.metodo.toUpperCase()}</span></p>`;
  go('confirmacao');
}
document.getElementById('btn-imprimir').addEventListener('click', () => window.print());

const listaReservas = document.getElementById('lista-reservas');
function renderReservas() {
  const sess = store.getSession(); const email = sess?.email; const all = store.getReservas().filter(r => !email || r.userEmail === email);
  listaReservas.innerHTML = ''; if (!all.length) { listaReservas.innerHTML = '<p class="small">Nenhuma reserva encontrada.</p>'; return; }
  all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  all.forEach(r => {
    const f = r.voo; const item = document.createElement('div'); item.className = 'flight';
    item.innerHTML = `<div class="airline">${f.airline} <span class="badge">${f.number}</span></div><div><div><strong>${f.depart}</strong> • ${f.origin}</div><div class="small">Partida</div></div><div><div><strong>${f.arrive}</strong> • ${f.dest}</div><div class="small">Chegada</div></div><div><div>${r.status}</div><div class="small">Assentos: ${r.assentos.join(', ')}</div></div><div style="text-align:right"><div class="price">R$ ${Number(r.total).toFixed(2)}</div><button class="btn primary" data-bilhete="${r.id}">Ver bilhete</button></div>`;
    listaReservas.appendChild(item);
  });
  listaReservas.querySelectorAll('[data-bilhete]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-bilhete'); const r = store.getReservas().find(x => x.id === id); if (r) mostrarBilhete(r);
    });
  });
}
const bilheteContent = document.getElementById('bilhete-content');
function mostrarBilhete(r) {
  const f = r.voo;
  bilheteContent.innerHTML = `<p><strong>Código:</strong> ${r.id}</p><p><strong>Passageiro:</strong> ${r.dados.nome} • <span class="small">${r.dados.cpf}</span></p><p><strong>Voo:</strong> ${f.id} (${f.number}) — ${f.airline}</p><p><strong>Rota:</strong> ${f.origin} → ${f.dest}</p><p><strong>Partida:</strong> ${f.departISO || f.depart} • <strong>Chegada:</strong> ${f.arriveISO || f.arrive}</p><p><strong>Assentos:</strong> ${r.assentos.join(', ')} • <strong>Classe:</strong> ${r.classe}</p><p><strong>Bagagem:</strong> ${r.bagagem} • <strong>Status:</strong> ${r.status}</p><hr><p><strong>Total pago:</strong> R$ ${Number(r.total).toFixed(2)} • <span class="small">Método: ${r.pagamento.metodo.toUpperCase()}</span></p>`;
  document.getElementById('btn-bilhete-print').onclick = () => window.print();
  go('bilhete');
}

const cpf = document.getElementById('cpf');
cpf?.addEventListener('input', (e) => { let v = e.target.value.replace(/\D/g, ''); if (v.length > 11) v = v.slice(0, 11); v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'); e.target.value = v; });
const telefone = document.getElementById('telefone');
telefone?.addEventListener('input', (e) => { let v = e.target.value.replace(/\D/g, ''); if (v.length > 11) v = v.slice(0, 11); v = v.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{4})$/, '$1-$2'); e.target.value = v; });
const cadcpf = document.getElementById('cad-cpf');
cadcpf?.addEventListener('input', (e) => { let v = e.target.value.replace(/\D/g, ''); if (v.length > 11) v = v.slice(0, 11); v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'); e.target.value = v; });
const cadtel = document.getElementById('cad-tel');
cadtel?.addEventListener('input', (e) => { let v = e.target.value.replace(/\D/g, ''); if (v.length > 11) v = v.slice(0, 11); v = v.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{4})$/, '$1-$2'); e.target.value = v; });

(function initDates() { const today = new Date(); const dt = (d) => d.toISOString().slice(0, 10); const ida = document.getElementById('data-ida'); const volta = document.getElementById('data-volta'); if (ida) ida.value = dt(today); if (volta) volta.value = dt(new Date(today.getTime() + 86400000)); })();
(function initAdminAuto() { const sess = store.getSession(); if (sess?.role === 'admin') { renderAdmin(); } })();
