/* BAHR B22 — Live GPS للطلعات الخاصة
   ملف مستقل: لا يحتاج أي تعديل في app.js. يضيف زر «الطلعات» عائماً للمسجّلين فقط.
   - يقرأ الجلسة من localStorage بنفس طريقة b22-follow.js (دون عميل Supabase جديد للمصادقة).
   - استعلام دوري كل 15 ثانية (بلا Realtime وبلا خريطة مدمجة). الفتح في Google Maps برابط خارجي فقط.
   - الموقع يُرسل ما دامت الصفحة مفتوحة فقط (قيد المتصفحات)، وآخر موقع فقط بلا مسار.
   الاستدعاء من واجهات أخرى (مثل المجموعات): BAHR_LIVEGPS.openCreate({ groupId: 'UUID', title: '...' }) */
(function () {
  'use strict';
  if (window.BAHR_LIVEGPS) return;

  var cf = window.BAHR_CONFIG || {};
  var URL_ = cf.supabaseUrl, KEY = cf.supabaseAnonKey;
  if (!URL_ || !KEY) return;
  var REF = '';
  try { REF = new URL(URL_).hostname.split('.')[0]; } catch (e) { return; }
  var SK = 'sb-' + REF + '-auth-token';

  var ERR = {
    not_authenticated: 'سجّل الدخول أولاً.',
    bad_title: 'اكتب اسماً للطلعة (حتى 80 حرفاً).',
    bad_duration: 'المدة من 1 إلى 12 ساعة.',
    too_many_active_trips: 'عندك 3 طلعات نشطة. أنهِ واحدة أولاً.',
    not_owner: 'هذا الإجراء لمنظّم الطلعة فقط.',
    trip_not_active: 'الطلعة انتهت.',
    trip_full: 'اكتمل عدد المشاركين.',
    bad_user: 'مستخدم غير صالح.',
    no_invite: 'لا توجد دعوة.',
    owner_must_end: 'المنظّم ينهي الطلعة ولا يغادرها.',
    not_joined: 'لست منضمّاً لهذه الطلعة أو انتهت.',
    not_sharing: 'المشاركة متوقفة.',
    bad_coords: 'إحداثيات غير صالحة.',
    rate_limited: ''
  };
  function emsg(e) { var m = (e && e.message) || ''; return ERR.hasOwnProperty(m) ? ERR[m] : 'تعذّر تنفيذ الطلب. حاول مرة أخرى.'; }

  /* ---------- الجلسة وواجهة REST ---------- */
  function session() {
    try {
      var s = JSON.parse(localStorage.getItem(SK) || 'null');
      if (s && s.currentSession) s = s.currentSession;
      if (s && s.access_token && s.user && s.user.id) return s;
    } catch (e) {}
    return null;
  }
  function api(method, path, body, keepalive) {
    var s = session();
    var h = { apikey: KEY, Authorization: 'Bearer ' + (s ? s.access_token : KEY), 'Content-Type': 'application/json' };
    return fetch(URL_ + '/rest/v1/' + path, {
      method: method, headers: h, keepalive: !!keepalive,
      body: body !== undefined ? JSON.stringify(body) : undefined
    }).then(function (r) {
      return r.text().then(function (t) {
        var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
        if (!r.ok) { var er = new Error((j && (j.message || j.error)) || ('http_' + r.status)); er.status = r.status; throw er; }
        return j;
      });
    });
  }
  function rpc(name, args, keepalive) { return api('POST', 'rpc/' + name, args || {}, keepalive); }

  /* ---------- أدوات ---------- */
  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'class') el.className = attrs[k];
      else if (k === 'text') el.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), attrs[k]);
      else el.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  function dist(a, b) {
    var R = 6371000, r = Math.PI / 180;
    var dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }
  function bearing(a, b) {
    var r = Math.PI / 180, y = Math.sin((b.lng - a.lng) * r) * Math.cos(b.lat * r);
    var x = Math.cos(a.lat * r) * Math.sin(b.lat * r) - Math.sin(a.lat * r) * Math.cos(b.lat * r) * Math.cos((b.lng - a.lng) * r);
    return (Math.atan2(y, x) / r + 360) % 360;
  }
  function dirName(d) { return ['شمال', 'شمال شرق', 'شرق', 'جنوب شرق', 'جنوب', 'جنوب غرب', 'غرب', 'شمال غرب'][Math.round(d / 45) % 8]; }
  function fmtDist(m) { return m < 1000 ? Math.round(m / 10) * 10 + ' م' : (m / 1000).toFixed(1) + ' كم'; }
  function fmtAge(ts) {
    var s = Math.max(0, Math.round((Date.now() - new Date(ts).getTime()) / 1000));
    if (s < 10) return 'الآن';
    if (s < 60) return 'قبل ' + s + ' ث';
    return 'قبل ' + Math.round(s / 60) + ' د';
  }
  function fmtTime(ts) { try { return new Date(ts).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }

  /* ---------- الحالة ---------- */
  var S = {
    open: false, view: 'list', trip: null, people: [], pos: {}, names: {},
    sharing: false, hi: false, watch: null, beat: null, last: null, lastSent: 0,
    poll: null, tick: 0,
    newGroup: null, newTitle: '', toastT: null, confirmView: false
  };
  var root, body, bar, fab, toastEl;

  function toast(t) {
    if (!toastEl) return;
    toastEl.textContent = t; toastEl.className = 'b22lg-toast on';
    clearTimeout(S.toastT); S.toastT = setTimeout(function () { toastEl.className = 'b22lg-toast'; }, 3200);
  }

  /* ---------- الهيكل ---------- */
  function build() {
    fab = h('button', { class: 'b22lg-fab', type: 'button', 'aria-label': 'الطلعات', onclick: function () { openPanel(); } }, ['📍 الطلعات']);
    bar = h('div', { class: 'b22lg-bar', role: 'status' }, [
      h('span', { class: 'b22lg-dot' }), h('span', { class: 'b22lg-bart', text: 'موقعك مشارك' }),
      h('button', { type: 'button', class: 'b22lg-barstop', onclick: function () { stopShare(false); }, text: 'إيقاف' })
    ]);
    body = h('div', { class: 'b22lg-body' });
    toastEl = h('div', { class: 'b22lg-toast', role: 'status' });
    root = h('div', { class: 'b22lg', dir: 'rtl', hidden: 'hidden' }, [
      h('div', { class: 'b22lg-sheet' }, [
        h('div', { class: 'b22lg-head' }, [
          h('b', { text: 'الطلعات الخاصة' }),
          h('button', { type: 'button', class: 'b22lg-x', 'aria-label': 'إغلاق', onclick: closePanel, text: '✕' })
        ]),
        body
      ]), toastEl
    ]);
    document.body.appendChild(fab); document.body.appendChild(bar); document.body.appendChild(root);
  }
  function syncChrome() {
    var logged = !!session();
    fab.style.display = logged && !S.open ? '' : 'none';
    bar.className = 'b22lg-bar' + (S.sharing ? ' on' : '');
    if (!logged && S.sharing) stopShare(true);
  }
  function openPanel() { if (!session()) return; S.open = true; root.removeAttribute('hidden'); document.documentElement.classList.add('b22lg-lock'); syncChrome(); S.trip ? renderTrip() : renderList(); }
  function closePanel() { S.open = false; root.setAttribute('hidden', 'hidden'); document.documentElement.classList.remove('b22lg-lock'); leaveTripView(true); syncChrome(); }

  /* ---------- قائمة الطلعات ---------- */
  function renderList() {
    S.view = 'list'; S.trip = null; body.innerHTML = '';
    body.appendChild(h('p', { class: 'b22lg-muted', text: 'جارٍ التحميل…' }));
    rpc('b22_my_trips').then(function (rows) {
      rows = rows || []; body.innerHTML = '';
      var inv = rows.filter(function (r) { return r.my_status === 'invited'; });
      var act = rows.filter(function (r) { return r.my_status === 'joined'; });
      // أمان: لو بقي علم المشاركة مفعّلاً من جلسة سابقة ولا يوجد مؤقّت محلي، نوقفه
      act.forEach(function (r) { if (r.sharing && !S.sharing) { rpc('b22_trip_stop_sharing', { p_trip: r.trip_id }).catch(function () {}); } });

      if (inv.length) {
        body.appendChild(h('h3', { text: 'دعوات' }));
        inv.forEach(function (r) {
          body.appendChild(h('div', { class: 'b22lg-card' }, [
            h('b', { text: r.title }), h('div', { class: 'b22lg-muted', text: 'من ' + (r.owner_name || 'مستخدم') + ' · تنتهي ' + fmtTime(r.ends_at) }),
            h('div', { class: 'b22lg-row' }, [
              h('button', { type: 'button', class: 'b22lg-btn', text: 'قبول', onclick: function () { answer(r.trip_id, true); } }),
              h('button', { type: 'button', class: 'b22lg-btn ghost', text: 'رفض', onclick: function () { answer(r.trip_id, false); } })
            ])
          ]));
        });
      }
      body.appendChild(h('h3', { text: 'طلعاتي النشطة' }));
      if (!act.length) body.appendChild(h('p', { class: 'b22lg-muted', text: 'لا توجد طلعة نشطة.' }));
      act.forEach(function (r) {
        body.appendChild(h('div', { class: 'b22lg-card click', onclick: function () { openTrip(r); } }, [
          h('b', { text: r.title }),
          h('div', { class: 'b22lg-muted', text: (r.my_role === 'owner' ? 'أنت المنظّم' : 'منظّم: ' + (r.owner_name || 'مستخدم')) + ' · ' + r.members + ' منضمّ · تنتهي ' + fmtTime(r.ends_at) })
        ]));
      });
      renderCreate();
    }).catch(function (e) { body.innerHTML = ''; body.appendChild(h('p', { class: 'b22lg-err', text: emsg(e) })); renderCreate(); });
  }
  function answer(id, ok) { rpc('b22_trip_respond', { p_trip: id, p_accept: ok }).then(function () { toast(ok ? 'انضممت للطلعة' : 'تم الرفض'); renderList(); }).catch(function (e) { toast(emsg(e)); renderList(); }); }

  function renderCreate() {
    var title = h('input', { type: 'text', maxlength: '80', placeholder: 'اسم الطلعة (مثال: طلعة الجمعة)', class: 'b22lg-in', value: S.newTitle || '' });
    var dur = h('select', { class: 'b22lg-in' }, [1, 2, 4, 6, 8, 12].map(function (n) { var o = h('option', { value: String(n), text: n + ' ساعة' }); if (n === 4) o.selected = true; return o; }));
    var go = h('button', { type: 'button', class: 'b22lg-btn', text: 'إنشاء الطلعة' });
    go.addEventListener('click', function () {
      var t = title.value.trim(); if (!t) { toast(ERR.bad_title); return; }
      go.disabled = true;
      rpc('b22_trip_create', { p_title: t, p_hours: parseInt(dur.value, 10), p_group: S.newGroup || null, p_max: 10 }).then(function (id) {
        S.newGroup = null; S.newTitle = '';
        return rpc('b22_my_trips').then(function (rows) { var r = (rows || []).filter(function (x) { return x.trip_id === id; })[0]; if (r) openTrip(r); else renderList(); });
      }).catch(function (e) { go.disabled = false; toast(emsg(e)); });
    });
    body.appendChild(h('h3', { text: 'طلعة جديدة' }));
    body.appendChild(h('div', { class: 'b22lg-card' }, [title, dur, go,
      h('p', { class: 'b22lg-muted', text: 'الافتراضي 4 ساعات، والحد الأقصى 12. حتى 10 مشاركين. لا يرى أحد موقعك إلا من تدعوه وينضم.' })]));
  }

  /* ---------- شاشة الطلعة ---------- */
  function openTrip(r) {
    S.trip = r; S.view = 'trip'; S.pos = {}; S.names = {}; S.people = []; S.confirmView = false;
    renderTrip(); loadPeople(); loadPositions();
    clearInterval(S.poll); S.tick = 0;
    S.poll = setInterval(tickFn, 15000);
  }
  function leaveTripView(keepShare) {
    clearInterval(S.poll); S.poll = null;
    if (!keepShare) stopShare(true);
    S.trip = keepShare && S.sharing ? S.trip : null;
    if (!S.sharing) S.trip = null;
  }
  function tickFn() {
    if (!S.trip) return;
    if (new Date(S.trip.ends_at).getTime() <= Date.now()) { toast('انتهت الطلعة'); stopShare(true); S.trip = null; leaveTripView(false); if (S.open) renderList(); return; }
    S.tick++;
    loadPositions();
    if (S.tick % 2 === 0) loadPeople();
  }
  function gone(e) {
    if (e && /not_joined|trip_not_active/.test(e.message || '')) { toast('انتهت الطلعة أو لم تعد منضمّاً إليها'); stopShare(true); leaveTripView(false); if (S.open) renderList(); return true; }
    return false;
  }
  function loadPeople() {
    if (!S.trip) return;
    var id = S.trip.trip_id;
    rpc('b22_trip_people', { p_trip: id }).then(function (rows) {
      if (!S.trip || S.trip.trip_id !== id) return;
      S.people = rows || []; S.people.forEach(function (p) { S.names[p.user_id] = p.name; });
      var me = session(); var mine = me && S.people.filter(function (p) { return p.user_id === me.user.id; })[0];
      if (mine && mine.sharing && !S.sharing) rpc('b22_trip_stop_sharing', { p_trip: id }).catch(function () {});
      renderPeople();
    }).catch(function (e) { gone(e); });
  }
  function loadPositions() {
    if (!S.trip) return;
    var id = S.trip.trip_id;
    rpc('b22_trip_positions', { p_trip: id }).then(function (rows) {
      if (!S.trip || S.trip.trip_id !== id) return;
      var m = {}; (rows || []).forEach(function (p) { m[p.user_id] = p; }); S.pos = m;
      renderPeople();
    }).catch(function (e) { gone(e); });
  }
  /* ---------- رسم الشاشة ---------- */
  var peopleBox, shareBox, adminBox;
  function renderTrip() {
    if (!S.trip) return renderList();
    S.view = 'trip'; body.innerHTML = '';
    var t = S.trip, owner = t.my_role === 'owner';
    body.appendChild(h('div', { class: 'b22lg-row between' }, [
      h('button', { type: 'button', class: 'b22lg-btn ghost sm', text: '← الطلعات', onclick: function () { leaveTripView(true); renderList(); } }),
      h('span', { class: 'b22lg-muted', text: 'تنتهي ' + fmtTime(t.ends_at) })
    ]));
    body.appendChild(h('h2', { text: t.title }));
    shareBox = h('div', { class: 'b22lg-card' }); body.appendChild(shareBox);
    peopleBox = h('div', { class: 'b22lg-card' }); body.appendChild(peopleBox);
    adminBox = h('div'); body.appendChild(adminBox);
    body.appendChild(h('p', { class: 'b22lg-note', text: 'نحتفظ بآخر موقع فقط أثناء الطلعة، ونحذفه عند إيقاف المشاركة أو انتهاء الطلعة. لا نحفظ مسارك. الموقع يُحدَّث والصفحة مفتوحة فقط؛ إغلاق الصفحة أو قفل الشاشة يوقف التحديث.' }));
    renderShare(); renderPeople(); renderAdmin(owner);
  }

  function renderShare() {
    if (!shareBox) return; shareBox.innerHTML = '';
    if (S.confirmView) {
      var n = S.people.filter(function (p) { return p.status === 'joined'; }).length || 1;
      shareBox.appendChild(h('b', { text: 'قبل أن تشارك موقعك' }));
      shareBox.appendChild(h('ul', { class: 'b22lg-ul' }, [
        h('li', { text: 'من سيراه: المنضمّون إلى «' + S.trip.title + '» فقط (' + n + ' الآن).' }),
        h('li', { text: 'المدة: حتى ' + fmtTime(S.trip.ends_at) + ' كحدّ أقصى.' }),
        h('li', { text: 'الإيقاف: في أي لحظة من الشريط الظاهر أعلى الشاشة.' }),
        h('li', { text: 'نحفظ آخر موقع فقط ونحذفه عند الإيقاف أو الانتهاء.' }),
        h('li', { text: 'يعمل ما دامت الصفحة مفتوحة فقط.' })
      ]));
      shareBox.appendChild(h('div', { class: 'b22lg-row' }, [
        h('button', { type: 'button', class: 'b22lg-btn', text: 'موافق، شارك موقعي', onclick: startShare }),
        h('button', { type: 'button', class: 'b22lg-btn ghost', text: 'إلغاء', onclick: function () { S.confirmView = false; renderShare(); } })
      ]));
      return;
    }
    if (S.sharing) {
      var cb = h('input', { type: 'checkbox', id: 'b22lgHi' }); cb.checked = S.hi;
      cb.addEventListener('change', function () { S.hi = cb.checked; if (S.sharing) { startWatch(); toast(S.hi ? 'دقة عالية (تستهلك بطارية أكثر)' : 'دقة عادية'); } });
      shareBox.appendChild(h('div', { class: 'b22lg-row between' }, [
        h('b', { text: '📍 موقعك مشارك الآن' }),
        h('button', { type: 'button', class: 'b22lg-btn danger sm', text: 'إيقاف', onclick: function () { stopShare(false); } })
      ]));
      shareBox.appendChild(h('label', { class: 'b22lg-muted', for: 'b22lgHi' }, [cb, ' دقة عالية (بطارية أكثر)']));
    } else {
      shareBox.appendChild(h('div', { class: 'b22lg-row between' }, [
        h('span', { text: 'موقعك غير مشارك' }),
        h('button', { type: 'button', class: 'b22lg-btn sm', text: 'شارك موقعي', onclick: function () { S.confirmView = true; renderShare(); } })
      ]));
    }
  }

  function renderPeople() {
    if (!peopleBox) return; peopleBox.innerHTML = '';
    var me = session(), mid = me ? me.user.id : '', mypos = S.pos[mid] ? { lat: S.pos[mid].lat, lng: S.pos[mid].lng } : (S.last ? { lat: S.last.coords.latitude, lng: S.last.coords.longitude } : null);
    peopleBox.appendChild(h('b', { text: 'المشاركون' }));
    if (!S.people.length) peopleBox.appendChild(h('p', { class: 'b22lg-muted', text: 'جارٍ التحميل…' }));
    var list = S.people.slice();
    if (mypos) list.sort(function (x, y) {
      var px = S.pos[x.user_id], py = S.pos[y.user_id];
      var dx = px && x.user_id !== mid ? dist(mypos, px) : (x.user_id === mid ? -1 : 1e12);
      var dy = py && y.user_id !== mid ? dist(mypos, py) : (y.user_id === mid ? -1 : 1e12);
      return dx - dy;
    });
    list.forEach(function (p) {
      var pos = S.pos[p.user_id], info, link = null;
      if (p.status === 'invited') info = 'مدعو (لم ينضم)';
      else if (pos) {
        info = fmtAge(pos.updated_at);
        if (mypos && p.user_id !== mid) info += ' · ' + fmtDist(dist(mypos, pos)) + ' · ' + dirName(bearing(mypos, pos));
        link = h('a', { class: 'b22lg-btn ghost xs', target: '_blank', rel: 'noopener noreferrer', text: 'افتح في Google Maps',
          href: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(Number(pos.lat) + ',' + Number(pos.lng)) });
      } else info = p.sharing ? 'بانتظار الموقع…' : 'لا يشارك موقعه';
      var stale = pos && (Date.now() - new Date(pos.updated_at).getTime() > 60000);
      var row = h('div', { class: 'b22lg-person' }, [
        h('span', { class: 'b22lg-pd ' + (pos ? (stale ? 'stale' : 'live') : 'off') }),
        h('span', { class: 'b22lg-pn', text: (p.name || 'مستخدم') + (p.user_id === mid ? ' (أنت)' : '') + (p.role === 'owner' ? ' · منظّم' : '') }),
        h('span', { class: 'b22lg-muted', text: info }),
        link
      ]);
      if (S.trip && S.trip.my_role === 'owner' && p.user_id !== mid) {
        row.appendChild(h('button', { type: 'button', class: 'b22lg-btn ghost xs', text: 'إزالة', onclick: function () {
          if (!confirm('إزالة ' + (p.name || 'المستخدم') + ' من الطلعة؟')) return;
          rpc('b22_trip_remove', { p_trip: S.trip.trip_id, p_user: p.user_id }).then(function () { loadPeople(); loadPositions(); }).catch(function (e) { toast(emsg(e)); });
        } }));
      }
      peopleBox.appendChild(row);
    });
  }

  function renderAdmin(owner) {
    if (!adminBox) return; adminBox.innerHTML = '';
    if (owner) {
      var q = h('input', { type: 'text', class: 'b22lg-in', placeholder: 'ادعُ مشاركاً: اكتب 3 أحرف من اسمه' });
      var res = h('div'); var tm = null;
      q.addEventListener('input', function () {
        clearTimeout(tm); res.innerHTML = '';
        if (q.value.trim().length < 3) return;
        tm = setTimeout(function () {
          rpc('b22_find_user', { p_q: q.value.trim() }).then(function (rows) {
            res.innerHTML = '';
            if (!rows || !rows.length) { res.appendChild(h('p', { class: 'b22lg-muted', text: 'لا نتائج.' })); return; }
            rows.forEach(function (u) {
              res.appendChild(h('div', { class: 'b22lg-row between' }, [
                h('span', { text: u.name || 'مستخدم' }),
                h('button', { type: 'button', class: 'b22lg-btn sm', text: 'دعوة', onclick: function () {
                  rpc('b22_trip_invite', { p_trip: S.trip.trip_id, p_user: u.user_id }).then(function () { toast('أُرسلت الدعوة'); q.value = ''; res.innerHTML = ''; loadPeople(); }).catch(function (e) { toast(emsg(e)); });
                } })
              ]));
            });
          }).catch(function (e) { toast(emsg(e)); });
        }, 350);
      });
      adminBox.appendChild(h('div', { class: 'b22lg-card' }, [h('b', { text: 'دعوة مشارك' }), q, res]));
      adminBox.appendChild(h('button', { type: 'button', class: 'b22lg-btn danger', text: 'إنهاء الطلعة للجميع', onclick: function () {
        if (!confirm('إنهاء الطلعة؟ ستُمسح كل المواقع فوراً.')) return;
        stopShare(true);
        rpc('b22_trip_end', { p_trip: S.trip.trip_id }).then(function () { toast('انتهت الطلعة'); leaveTripView(false); renderList(); }).catch(function (e) { toast(emsg(e)); });
      } }));
    } else {
      adminBox.appendChild(h('button', { type: 'button', class: 'b22lg-btn ghost', text: 'مغادرة الطلعة', onclick: function () {
        if (!confirm('مغادرة الطلعة؟')) return;
        stopShare(true);
        rpc('b22_trip_leave', { p_trip: S.trip.trip_id }).then(function () { toast('غادرت الطلعة'); leaveTripView(false); renderList(); }).catch(function (e) { toast(emsg(e)); });
      } }));
    }
  }

  /* ---------- المشاركة ---------- */
  function geoErr(er) {
    if (er && er.code === 1) return 'لم يُسمح بالوصول إلى الموقع. فعّله من إعدادات المتصفح.';
    if (er && er.code === 3) return 'انتهت مهلة تحديد الموقع.';
    return 'تعذّر تحديد موقعك.';
  }
  function startShare() {
    if (!S.trip) return;
    if (!navigator.geolocation) { toast('المتصفح لا يدعم تحديد الموقع.'); return; }
    navigator.geolocation.getCurrentPosition(function (pos) {
      var id = S.trip.trip_id;
      rpc('b22_trip_start_sharing', { p_trip: id }).then(function () {
        S.sharing = true; S.confirmView = false; S.last = pos; S.lastSent = 0;
        sendPos(pos); startWatch(); syncChrome(); renderShare(); loadPeople();
        bar.querySelector('.b22lg-bart').textContent = 'موقعك مشارك — ' + S.trip.title;
      }).catch(function (e) { toast(emsg(e)); });
    }, function (er) { toast(geoErr(er)); }, { enableHighAccuracy: S.hi, timeout: 15000, maximumAge: 0 });
  }
  function interval() { return S.hi ? 10000 : 15000; }
  function startWatch() {
    stopWatch();
    S.watch = navigator.geolocation.watchPosition(function (pos) {
      S.last = pos; if (Date.now() - S.lastSent >= interval()) sendPos(pos);
    }, function (er) { if (er && er.code === 1) { toast(geoErr(er)); stopShare(false); } }, { enableHighAccuracy: S.hi, maximumAge: 5000, timeout: 20000 });
    // نبض: إن لم يتحرك المستخدم نعيد آخر نقطة طازجة (أقل من دقيقة) كي لا يُحذف موقعه بعد 10 دقائق
    S.beat = setInterval(function () {
      if (S.sharing && S.last && Date.now() - S.lastSent >= interval() && Date.now() - S.last.timestamp < 60000) sendPos(S.last);
    }, 5000);
  }
  function stopWatch() {
    if (S.watch != null) { try { navigator.geolocation.clearWatch(S.watch); } catch (e) {} S.watch = null; }
    clearInterval(S.beat); S.beat = null;
  }
  function sendPos(pos) {
    if (!S.trip || !S.sharing) return;
    S.lastSent = Date.now();
    rpc('b22_trip_update_position', { p_trip: S.trip.trip_id, p_lat: pos.coords.latitude, p_lng: pos.coords.longitude, p_acc: pos.coords.accuracy }).catch(function (e) {
      var m = (e && e.message) || '';
      if (m === 'rate_limited') return;
      if (/not_joined|not_sharing|trip_not_active/.test(m)) { toast(emsg(e)); stopShare(true); renderShare(); }
    });
  }
  function stopShare(silent) {
    var id = S.trip && S.trip.trip_id, was = S.sharing;
    stopWatch(); S.sharing = false; S.last = null;
    if (id && was) rpc('b22_trip_stop_sharing', { p_trip: id }).catch(function () {});
    syncChrome(); if (S.view === 'trip') { renderShare(); }
    if (was && !silent) toast('أُوقفت المشاركة ومُسح موقعك');
  }

  /* ---------- إقلاع ---------- */
  function init() {
    build(); syncChrome();
    setInterval(syncChrome, 4000);
    window.addEventListener('storage', function (e) { if (e.key === SK) syncChrome(); });
    window.addEventListener('pagehide', function () {
      if (S.sharing && S.trip) { try { rpc('b22_trip_stop_sharing', { p_trip: S.trip.trip_id }, true); } catch (e) {} }
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && S.sharing && S.last) { S.lastSent = 0; }
      if (!document.hidden && S.trip) { loadPositions(); loadPeople(); }
    });
  }
  window.BAHR_LIVEGPS = {
    open: openPanel,
    openCreate: function (o) { o = o || {}; S.newGroup = o.groupId || null; S.newTitle = o.title || ''; if (S.open) { renderList(); } else openPanel(); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
