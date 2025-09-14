(function(){
  if (!window.firebase) {
    // Ensure Firebase is present; widget will noop without it
    console.warn('ChatWidget: Firebase not available.');
    return;
  }

  if (window.ChatWidget) return; // singleton

  var db = firebase.database();
  var playerName = 'Sans pseudo';
  try { playerName = sessionStorage.getItem('playerName') || 'Sans pseudo'; } catch(_) {}

  // DOM creation
  var fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.setAttribute('aria-label', 'Ouvrir le chat');
  fab.innerHTML = '💬<span class="badge" id="chatBadge"></span>';

  var panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.innerHTML = ''
    + '<div class="chat-head">'
    + '  <div class="chat-title">Chat</div>'
    + '  <button class="chat-close" aria-label="Fermer">×</button>'
    + '</div>'
    + '<div class="chat-body" id="chatBody"></div>'
    + '<div class="chat-input">'
    + '  <input type="text" id="chatInputFloating" placeholder="Tapez un message..." />'
    + '  <button id="chatSendBtn">Envoyer</button>'
    + '</div>';

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var bodyEl = panel.querySelector('#chatBody');
  var inputEl = panel.querySelector('#chatInputFloating');
  var sendBtn = panel.querySelector('#chatSendBtn');
  var closeBtn = panel.querySelector('.chat-close');
  var badgeEl = fab.querySelector('#chatBadge');

  function open() {
    panel.classList.add('open');
    fab.setAttribute('aria-expanded', 'true');
    resetUnread();
    setTimeout(scrollToBottom, 0);
    try { inputEl.focus(); } catch(_) {}
  }
  function close() {
    panel.classList.remove('open');
    fab.setAttribute('aria-expanded', 'false');
  }
  function toggle() { if (panel.classList.contains('open')) close(); else open(); }
  function scrollToBottom(){ bodyEl.scrollTop = bodyEl.scrollHeight; }

  var unread = 0;
  function incUnread(){
    if (!panel.classList.contains('open')) {
      unread++;
      badgeEl.style.display = 'flex';
      badgeEl.textContent = String(unread);
    }
  }
  function resetUnread(){ unread = 0; badgeEl.style.display = 'none'; }

  function renderMessage(msg){
    var el = document.createElement('div');
    el.className = 'chat-msg';
    var pseudo = document.createElement('span');
    pseudo.className = 'pseudo';
    pseudo.textContent = msg.pseudo || 'Anonyme';
    if (pseudo.textContent === 'Alexis') pseudo.style.color = 'red';
    el.appendChild(pseudo);
    el.appendChild(document.createTextNode(': ' + (msg.message || '')));
    bodyEl.appendChild(el);
  }

  function send(){
    var v = inputEl.value.trim();
    if (!v) return;
    inputEl.value = '';
    db.ref('chat').push({ pseudo: playerName, message: v, timestamp: firebase.database.ServerValue.TIMESTAMP });
  }

  // Events
  fab.addEventListener('click', toggle);
  closeBtn.addEventListener('click', close);
  sendBtn.addEventListener('click', send);
  inputEl.addEventListener('keypress', function(e){ if (e.key === 'Enter') send(); });

  // Firebase stream (limit history client-side)
  db.ref('chat').limitToLast(200).on('child_added', function(snap){
    var m = snap.val() || {};
    renderMessage(m);
    if (panel.classList.contains('open')) scrollToBottom(); else incUnread();
  });

  window.ChatWidget = { open: open, close: close, toggle: toggle };
})();

