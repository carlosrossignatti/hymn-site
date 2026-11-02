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
    /* "Voltar ao topo" aparece quando a pessoa chega de fato ao fim da página (igual à v9).
       Em tela baixa (notebook pequeno, prévia dentro de outra janela, celular), o botão pode ficar acima da tela quando a página
       termina e nunca seria visto: aí ele aparece quando passa pela tela, já no contato, no mesmo lugar. */
    if (volta) {
      var alto = document.documentElement.scrollHeight, telaH = window.innerHeight;
      var fim = telaH + y >= alto - 72;
      var r = volta.getBoundingClientRect();
      var cabeca = topo ? topo.getBoundingClientRect().bottom : 0;
      var noFim = r.top + y - Math.max(0, alto - telaH);
      volta.classList.toggle('is-visivel', noFim >= cabeca ? fim : (r.top >= cabeca && r.bottom <= telaH * 0.75));
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
