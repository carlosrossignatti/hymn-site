/* HYMN v9: o que todas as páginas dividem. Topo que muda de cor na hora, menu do celular,
   copiar contato e o "Voltar ao topo" que só aparece no fim da página. */
(function () {
  var raiz = document.documentElement;
  raiz.lang = 'pt-BR';
  raiz.classList.add('js');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Topo ----------
     Cada seção diz o tom dela (data-tom: claro, video ou escuro). O topo olha qual seção está bem debaixo
     da linha do meio dele e troca no mesmo evento de scroll, sem esperar o próximo quadro e sem transição de cor. */
  var topo = $('[data-topo]'), tons = $$('[data-tom]'), volta = $('[data-volta]');
  var MEIO = 38;
  function atualiza() {
    var y = window.scrollY || window.pageYOffset;
    var modo = 'escuro';
    for (var k = 0; k < tons.length; k++) {
      var r = tons[k].getBoundingClientRect();
      if (r.top <= MEIO && r.bottom > MEIO) { modo = tons[k].getAttribute('data-tom'); break; }
    }
    if (topo) {
      topo.classList.toggle('is-claro', modo === 'claro');
      topo.classList.toggle('is-video', modo === 'video');
      topo.classList.toggle('is-solido', modo === 'escuro');
      topo.classList.toggle('is-rolado', y > 8);
    }
    /* "Voltar ao topo" aparece quando a pessoa chega de fato ao fim da página */
    if (volta) {
      var fim = window.innerHeight + y >= document.documentElement.scrollHeight - 72;
      volta.classList.toggle('is-visivel', fim);
    }
  }
  window.addEventListener('scroll', atualiza, { passive: true });
  window.addEventListener('resize', atualiza);
  window.addEventListener('load', atualiza);
  atualiza();

  /* ---------- Menu do celular ---------- */
  var menu = $('#menu-cel'), abreMenu = $('[data-abre-menu]');
  if (menu && abreMenu) {
    var abre = function () { menu.hidden = false; abreMenu.setAttribute('aria-expanded', 'true'); requestAnimationFrame(function () { requestAnimationFrame(function () { menu.classList.add('is-aberto'); }); }); $('a', menu).focus({ preventScroll: true }); };
    var fecha = function () { menu.classList.remove('is-aberto'); menu.hidden = true; abreMenu.setAttribute('aria-expanded', 'false'); abreMenu.focus({ preventScroll: true }); };
    abreMenu.addEventListener('click', abre);
    $$('[data-fecha-menu]').forEach(function (b) { b.addEventListener('click', fecha); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) fecha(); });
  }

  /* ---------- Copiar contato ---------- */
  $$('[data-copia]').forEach(function (b) {
    b.addEventListener('click', function () {
      var ok = function () { b.classList.add('is-ok'); $('use', b).setAttribute('href', '#i-check'); setTimeout(function () { b.classList.remove('is-ok'); $('use', b).setAttribute('href', '#i-copiar'); }, 1800); };
      var seleciona = function () { var t = b.parentElement.querySelector('[data-texto]'); var s = window.getSelection(); var r = document.createRange(); r.selectNodeContents(t); s.removeAllRanges(); s.addRange(r); };
      try { navigator.clipboard.writeText(b.dataset.copia).then(ok, seleciona); } catch (e) { seleciona(); }
    });
  });

  window.HYMN = { atualizaTopo: atualiza };
})();
