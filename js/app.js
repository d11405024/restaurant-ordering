/* ══════════════════════════════════════════
   饌味軒 — 點餐系統
   純前端 vanilla JS，無需建置步驟
   ══════════════════════════════════════════ */
(function () {
  'use strict';

  const STORAGE_KEY = 'zunweixuan.cart.v1';

  /* ── DOM ── */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const els = {
    tabs:       $('#menuGrid')?.previousElementSibling,
    grid:       $('#menuGrid'),
    menuEmpty:  $('#menuEmpty'),
    cartBtn:    $('#cartBtn'),
    cartCount:  $('#cartCount'),
    cart:       $('#cart'),
    overlay:    $('#overlay'),
    cartClose:  $('#cartClose'),
    cartList:   $('#cartList'),
    cartEmpty:  $('#cartEmpty'),
    cartFoot:   $('#cartFoot'),
    form:       $('#checkoutForm'),
    formError:  $('#formError'),
    addressField: $('#addressField'),
    submitBtn:  $('#submitBtn'),
    toast:      $('#toast'),
    modal:      $('#successModal'),
    nav:        $('#nav'),
  };

  const sums = {
    sub:     $('#sumSub'),
    service: $('#sumService'),
    delivery: $('#sumDelivery'),
    total:   $('#sumTotal'),
    rowDel:  $('#rowDelivery'),
    freeHint: $('#freeHint'),
  };

  /** 狀態
      注意：cart 的實際載入放在 init() 中進行。
      因為 findItem / STORAGE_KEY 等 const 在下方才宣告，
      若在此處立即呼叫 loadCart() 會踩到 TDZ 並被 catch 吞掉。 */
  let cart = [];
  let activeCat = 'all';
  let lastFocus = null;

  /* ══════════════════════════
     工具
     ══════════════════════════ */
  const money = n => 'NT$' + n.toLocaleString('zh-TW');
  const findItem = id => MENU.find(m => m.id === id);

  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!Array.isArray(raw)) return [];
      // 過濾掉菜單上已不存在的品項
      return raw.filter(l => l && findItem(l.id) && l.qty > 0)
                .map(l => ({ id: l.id, qty: Math.min(99, Math.max(1, Number(l.qty) || 1)) }));
    } catch {
      return [];
    }
  }

  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* 隱私模式忽略 */ }
  }

  let toastTimer;
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { els.toast.hidden = true; }, 2200);
  }

  /* ══════════════════════════
     菜單渲染
     ══════════════════════════ */
  function renderTabs() {
    els.tabs.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const b = document.createElement('button');
      b.className = 'tab';
      b.type = 'button';
      b.role = 'tab';
      b.textContent = cat.label;
      b.dataset.cat = cat.id;
      b.setAttribute('aria-selected', String(cat.id === activeCat));
      b.addEventListener('click', () => {
        activeCat = cat.id;
        $$('.tab').forEach(t => t.setAttribute('aria-selected', String(t.dataset.cat === activeCat)));
        renderMenu();
        $('#menu').scrollIntoView({ block: 'start' });
      });
      els.tabs.appendChild(b);
    });
  }

  function renderMenu() {
    const items = activeCat === 'all' ? MENU : MENU.filter(m => m.cat === activeCat);
    els.menuEmpty.hidden = items.length > 0;
    els.grid.innerHTML = '';

    items.forEach(m => {
      const qty = cart.find(c => c.id === m.id)?.qty || 0;

      const card = document.createElement('article');
      card.className = 'card reveal';
      card.dataset.id = m.id;
      card.innerHTML = `
        <div class="card__media">
          <img src="${m.img}" alt="${m.name}" loading="lazy" width="900" height="600">
          ${m.tag ? `<span class="card__tag${m.hot ? ' card__tag--hot' : ''}">${m.tag}</span>` : ''}
        </div>
        <div class="card__body">
          <div class="card__top">
            <h3 class="card__name">${m.name}</h3>
            <p class="card__price"><small>$</small>${m.price}</p>
          </div>
          <p class="card__desc">${m.desc}</p>
          <div class="card__foot" data-role="foot"></div>
        </div>`;

      renderCardFoot(card, qty);
      els.grid.appendChild(card);
    });

    requestAnimationFrame(() => revealAll());
  }

  /** 卡片底部：數量為 0 顯示「加入」，否則顯示步進器 */
  function renderCardFoot(card, qty) {
    const m = findItem(card.dataset.id);
    const foot = $('[data-role="foot"]', card);
    foot.innerHTML = '';

    if (qty === 0) {
      const btn = document.createElement('button');
      btn.className = 'btn btn--primary card__add';
      btn.type = 'button';
      btn.innerHTML = `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg> 加入購物車`;
      btn.addEventListener('click', () => setQty(m.id, qty + 1, { silent: true }));
      foot.appendChild(btn);
    } else {
      foot.appendChild(buildStepper(m.id, qty, 'card'));
      const note = document.createElement('p');
      note.className = 'card__note';
      note.textContent = `已加入 ${qty} 份 · NT$${m.price * qty}`;
      $('[data-role="foot"]', card).appendChild(note);
    }
  }

  function buildStepper(id, qty, variant) {
    const wrap = document.createElement('div');
    wrap.className = 'stepper';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', findItem(id).name + ' 數量');

    const dec = document.createElement('button');
    dec.type = 'button';
    dec.innerHTML = '&minus;';
    // 可見文字「−」必須包含在無障礙名稱中，否則語音螢幕讀取會與畫面不一致
    dec.setAttribute('aria-label', '− 減少一份');
    dec.addEventListener('click', () => setQty(id, qty - 1));

    const out = document.createElement('output');
    out.textContent = qty;
    out.setAttribute('aria-live', 'polite');

    const inc = document.createElement('button');
    inc.type = 'button';
    inc.innerHTML = '+';
    inc.setAttribute('aria-label', '+ 增加一份');
    inc.addEventListener('click', () => setQty(id, qty + 1));

    wrap.append(dec, out, inc);
    return wrap;
  }

  /* ══════════════════════════
     購物車操作
     ══════════════════════════ */
  function setQty(id, qty, { silent = false } = {}) {
    qty = Math.max(0, Math.min(99, qty));
    const idx = cart.findIndex(c => c.id === id);

    if (qty === 0) {
      if (idx > -1) cart.splice(idx, 1);
    } else if (idx > -1) {
      cart[idx].qty = qty;
    } else {
      cart.push({ id, qty });
    }

    saveCart();
    renderCart();
    syncMenuCards();

    if (!silent && qty > 0) {
      const m = findItem(id);
      toast(`已加入「${m.name}」×${qty}`);
    }
  }

  /** 更新所有卡片底部的數量 UI（不重建 DOM） */
  function syncMenuCards() {
    $$('.card', els.grid).forEach(card => {
      const id = card.dataset.id;
      const qty = cart.find(c => c.id === id)?.qty || 0;
      renderCardFoot(card, qty);
    });
  }

  /* ══════════════════════════
     購物車面板
     ══════════════════════════ */
  function renderCart() {
    const count = cart.reduce((s, l) => s + l.qty, 0);
    els.cartCount.textContent = count;
    els.cartCount.hidden = count === 0;
    // 徽章本身對螢幕讀取器隱藏，改由按鈕的可及名稱帶出數量
    els.cartBtn.setAttribute('aria-label',
      count === 0 ? '開啟購物車，目前沒有餐點' : `開啟購物車，目前有 ${count} 件餐點`);

    els.cartEmpty.hidden = count > 0;
    els.cartFoot.hidden = count === 0;

    // 清單
    els.cartList.innerHTML = '';
    cart.forEach(line => {
      const m = findItem(line.id);
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.dataset.id = line.id;
      li.innerHTML = `
        <img class="cart-item__img" src="${m.img}" alt="" loading="lazy">
        <div>
          <p class="cart-item__name">${m.name}</p>
          <p class="cart-item__unit">${money(m.price)} / 份</p>
          <div data-role="step" style="margin-top:8px"></div>
        </div>
        <div class="cart-item__right">
          <span class="cart-item__sum">${money(m.price * line.qty)}</span>
          <button class="cart-item__del" type="button">移除</button>
        </div>`;
      $('[data-role="step"]', li).appendChild(buildStepper(line.id, line.qty, 'cart'));
      $('.cart-item__del', li).addEventListener('click', () => {
        setQty(line.id, 0);
        toast(`已移除「${m.name}」`);
      });
      els.cartList.appendChild(li);
    });

    renderTotals();
  }

  function renderTotals() {
    const sub = cart.reduce((s, l) => s + findItem(l.id).price * l.qty, 0);
    const service = Math.round(sub * RESTAURANT.serviceRate);
    const isPickup = els.form?.fulfil.value === 'pickup';

    const freeShip = sub >= RESTAURANT.freeDeliveryOver;
    const delivery = (!isPickup && sub > 0 && !freeShip) ? RESTAURANT.deliveryFee : 0;

    sums.sub.textContent = money(sub);
    sums.service.textContent = money(service);
    sums.delivery.textContent = freeShip ? '免費' : money(delivery);
    sums.total.textContent = money(sub + service + delivery);

    sums.rowDel.hidden = isPickup;
    sums.freeHint.hidden = !(!isPickup && sub > 0 && !freeShip);
    if (!isPickup && sub > 0 && !freeShip) {
      sums.freeHint.textContent =
        `再點 ${money(RESTAURANT.freeDeliveryOver - sub)} 即可免外送費`;
    }
    return { sub, service, delivery, total: sub + service + delivery };
  }

  /* ══════════════════════════
     開關抽屜
     ══════════════════════════ */
  function openCart() {
    lastFocus = document.activeElement;
    els.overlay.hidden = false;
    els.cart.hidden = false;
    document.body.style.overflow = 'hidden';
    els.cartClose.focus();
  }

  function closeCart() {
    els.overlay.hidden = true;
    els.cart.hidden = true;
    document.body.style.overflow = '';
    lastFocus?.focus();
  }

  const cartOpen = () => !els.cart.hidden;

  /* ══════════════════════════
     訂單送出
     ══════════════════════════ */
  function submitOrder(e) {
    e.preventDefault();
    const f = els.form;
    const error = validate(f);
    if (error) {
      els.formError.textContent = error;
      els.formError.hidden = false;
      return;
    }
    els.formError.hidden = true;

    const t = renderTotals();
    const isPickup = f.fulfil.value === 'pickup';
    const orderNo = 'ZW' + Date.now().toString(36).toUpperCase().slice(-6);
    const name = f.custName.value.trim();

    // 成功畫面
    $('#orderNo').textContent = orderNo;
    $('#orderMsg').textContent = isPickup
      ? `${name} 您好，訂單已收到！請於 25 分鐘後到店取餐，取餐時請出示訂單編號。`
      : `${name} 您好，訂單已收到！外送專員將於 30–45 分鐘內聯繫您確認地址，請保持電話暢通。`;

    $('#orderSum').innerHTML = `
      <div><dt>取貨方式</dt><dd>${isPickup ? '自取' : '外送'}</dd></div>
      <div><dt>餐點</dt><dd>${cart.reduce((s, l) => s + l.qty, 0)} 份</dd></div>
      <div><dt>小計</dt><dd>${money(t.sub)}</dd></div>
      <div><dt>服務費</dt><dd>${money(t.service)}</dd></div>
      ${isPickup ? '' : `<div><dt>外送費</dt><dd>${money(t.delivery)}</dd></div>`}
      <div><dt>應付總計</dt><dd>${money(t.total)}</dd></div>`;

    closeCart();
    els.modal.hidden = false;
    $('#successClose').focus();

    // 成功後清空購物車與表單
    cart = [];
    saveCart();
    renderCart();
    syncMenuCards();
    f.reset();
    els.addressField.style.display = '';
    renderTotals();
  }

  function validate(f) {
    const name = f.custName.value.trim();
    const phone = f.custPhone.value.trim();
    const addr = f.address.value.trim();

    f.custName.classList.remove('is-invalid');
    f.custPhone.classList.remove('is-invalid');
    f.address.classList.remove('is-invalid');

    if (!name) { f.custName.classList.add('is-invalid'); return '請填寫姓名。'; }
    if (name.length > 30) { f.custName.classList.add('is-invalid'); return '姓名請勿超過 30 字。'; }

    if (!phone) { f.custPhone.classList.add('is-invalid'); return '請填寫連絡電話。'; }
    if (!/^[\d+\-\s()]{8,20}$/.test(phone)) {
      f.custPhone.classList.add('is-invalid');
      return '電話格式不正確，請確認後再送出。';
    }

    if (f.fulfil.value === 'delivery') {
      if (!addr) { f.address.classList.add('is-invalid'); return '請填寫外送地址。'; }
      if (addr.length < 5) { f.address.classList.add('is-invalid'); return '外送地址太短，請填寫詳細一點。'; }
    }
    return '';
  }

  /* ══════════════════════════
     捲動動畫
     ══════════════════════════ */
  let io;
  function revealAll() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(el => el.classList.add('is-in'));
      return;
    }
    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -40px 0px', threshold: .08 });
    }
    $$('.reveal:not(.is-in)').forEach(el => io.observe(el));
    scheduleRevealFallback();
  }

  /** 保險：頁面在背景分頁未被瀏覽器渲染時，IO 可能延遲不觸發、
      CSS transition 也可能被凍結。若短時間內仍有元素未顯示，
      直接強制全部顯示，避免內容永久隱藏。 */
  let fallbackTimer;
  function scheduleRevealFallback() {
    clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(() => {
      const pending = $$('.reveal:not(.is-in)');
      if (!pending.length) return;
      pending.forEach(el => el.classList.add('is-in'));
      // 動畫若沒真的跑完，直接強制顯示
      requestAnimationFrame(() => {
        if ($$('.reveal').some(el => getComputedStyle(el).opacity !== '1')) {
          document.documentElement.classList.add('force-reveal');
        }
      });
    }, 2500);
  }

  /* ══════════════════════════
     初始化
     ══════════════════════════ */
  function init() {
    cart = loadCart();
    renderTabs();
    renderMenu();
    renderCart();

    els.cartBtn.addEventListener('click', openCart);
    els.cartClose.addEventListener('click', closeCart);
    els.overlay.addEventListener('click', closeCart);

    els.form.addEventListener('submit', submitOrder);
    $('#successClose').addEventListener('click', () => {
      els.modal.hidden = true;
      document.body.style.overflow = '';
      els.cartBtn.focus();
    });

    // 取貨方式切換
    $$('input[name="fulfil"]', els.form).forEach(r =>
      r.addEventListener('change', () => {
        const pickup = r.value === 'pickup';
        if (r.checked) {
          els.addressField.style.display = pickup ? 'none' : '';
          renderTotals();
        }
      })
    );

    // 即時清除欄位錯誤樣式
    ['custName', 'custPhone', 'address'].forEach(id => {
      const inp = document.getElementById(id);
      inp?.addEventListener('input', () => {
        inp.classList.remove('is-invalid');
        els.formError.hidden = true;
      });
    });

    // 導覽列陰影
    const onScroll = () => els.nav.classList.toggle('is-stuck', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Esc 關閉 + 焦點鎖在抽屜內
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!els.modal.hidden) { els.modal.hidden = true; document.body.style.overflow = ''; els.cartBtn.focus(); }
        else if (cartOpen()) closeCart();
        return;
      }
      if (e.key === 'Tab' && cartOpen()) trapFocus(e);
    });

    revealAll();
  }

  function trapFocus(e) {
    const focusables = $$(
      'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])',
      els.cart
    ).filter(el => el.offsetParent !== null);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();