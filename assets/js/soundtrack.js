(function () {
  var root = document.getElementById('soundtrack');
  if (!root) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FAM_COLORS = {
    'Pop': '#6e1423',
    'Rap & Hip Hop': '#b8863b',
    'Rock & Alternative': '#3f4b5b',
    'Country': '#7d8f4e',
    'R&B & Soul': '#a8556b',
    'Folk & Jazz': '#4f7a8c',
    'Electronic': '#7a5ea8',
    'Other': '#9a9a9a'
  };
  var SEMS = ['Fall 2022', 'Fall 2023', 'Spring 2024', 'Fall 2024'];
  var SINGER_COLORS = { 'Male': '#3f4b5b', 'Female': '#6e1423', 'Mixed or group': '#b8863b' };
  var PAGE = 24;

  var data = [];
  var state = { sem: new Set(), fam: new Set(), resp: null, singer: null, lang: null, q: '', shown: PAGE, sort: 'new' };

  function $(sel, ctx) { return (ctx || root).querySelector(sel); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function pct(n, d) { return d ? Math.round((n / d) * 100) : 0; }
  function count(rows, fn) { var m = {}; rows.forEach(function (r) { var k = fn(r); if (k != null) m[k] = (m[k] || 0) + 1; }); return m; }
  function sortedEntries(m) { return Object.keys(m).map(function (k) { return [k, m[k]]; }).sort(function (a, b) { return b[1] - a[1]; }); }
  function mmss(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function plural(n, w) { return n.toLocaleString() + ' ' + w + (n === 1 ? '' : 's'); }

  function matches(r, skip) {
    if (skip !== 'sem' && state.sem.size && !r.sems.some(function (x) { return state.sem.has(x); })) return false;
    if (skip !== 'fam' && state.fam.size && !state.fam.has(r.family)) return false;
    if (skip !== 'resp' && state.resp && r.resp !== state.resp) return false;
    if (skip !== 'singer' && state.singer && r.singer !== state.singer) return false;
    if (skip !== 'lang' && state.lang && r.lang !== state.lang) return false;
    if (skip !== 'q' && state.q) {
      var h = (r.title + ' ' + r.artist).toLowerCase();
      if (h.indexOf(state.q) === -1) return false;
    }
    return true;
  }
  function rowsFor(skip) { return data.filter(function (r) { return matches(r, skip); }); }

  /* ---------- hero ---------- */
  function heroStats() {
    var vals = {
      songs: data.length,
      artists: new Set(data.map(function (r) { return r.artist; })).size,
      genres: new Set(data.map(function (r) { return r.genre; }).filter(Boolean)).size,
      langs: new Set(data.map(function (r) { return r.lang; })).size
    };
    root.querySelectorAll('.st-stat-num').forEach(function (n) {
      var target = vals[n.getAttribute('data-count')];
      if (reduceMotion || document.hidden) { n.textContent = target.toLocaleString(); return; }
      var start = null, dur = 1300;
      function step(t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        n.textContent = Math.round(target * e).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
    root.querySelectorAll('strong[data-count]').forEach(function (n) {
      n.textContent = vals[n.getAttribute('data-count')].toLocaleString();
    });
  }

  /* ---------- insights (computed on the full dataset) ---------- */
  function insights() {
    var box = $('#st-insights');
    box.textContent = '';
    var male = data.filter(function (r) { return r.singer === 'Male'; }).length;
    var men = data.filter(function (r) { return r.resp === 'Male'; });
    var women = data.filter(function (r) { return r.resp === 'Female'; });
    var menMale = pct(men.filter(function (r) { return r.singer === 'Male'; }).length, men.length);
    var womenMale = pct(women.filter(function (r) { return r.singer === 'Male'; }).length, women.length);
    var artists = sortedEntries(count(data, function (r) { return r.artist; }));
    var repeats = data.slice().sort(function (x, y) { return y.times - x.times || x.title.localeCompare(y.title); });
    var top5 = data.filter(function (r) { return r.top5 > 0; }).length;
    var nonEng = data.filter(function (r) { return r.lang !== 'English'; }).length;
    function famShare(sem, fam) {
      var s = data.filter(function (r) { return r.sems.indexOf(sem) !== -1; });
      return pct(s.filter(function (r) { return r.family === fam; }).length, s.length);
    }
    var secs = data.map(function (r) { return r.sec; }).filter(Boolean).sort(function (a, b) { return a - b; });
    var median = secs[Math.floor(secs.length / 2)];
    var rep = repeats[0];

    var cards = [
      { big: pct(male, data.length) + '%', text: 'of the songs were by male artists. Women artists made up ' + pct(data.filter(function (r) { return r.singer === 'Female'; }).length, data.length) + '%.' },
      { big: menMale + '% vs ' + womenMale + '%', text: 'Songs by male artists among the songs men chose, compared with the songs women chose.' },
      { big: rep.title, text: 'was the song chosen most often, ' + rep.times + ' times across ' + rep.sems.length + ' semesters. ' + artists[0][0] + ' has the most different songs (' + artists[0][1] + ').' },
      { big: famShare('Fall 2022', 'Pop') + '% to ' + famShare('Fall 2024', 'Pop') + '%', text: 'Pop share of the songs from Fall 2022 to Fall 2024. Rap and Hip Hop went from ' + famShare('Fall 2022', 'Rap & Hip Hop') + '% to ' + famShare('Fall 2024', 'Rap & Hip Hop') + '%.' },
      { big: pct(nonEng, data.length) + '%', text: 'of songs were not in English, across ' + (new Set(data.map(function (r) { return r.lang; })).size - 1) + ' other languages. The typical song runs ' + mmss(median) + '.' }
    ];
    cards.forEach(function (c, i) {
      var a = el('article', 'st-insight');
      if (!reduceMotion) a.style.animationDelay = (i * 90) + 'ms';
      a.appendChild(el('p', 'st-insight-big', c.big));
      a.appendChild(el('p', 'st-insight-text', c.text));
      box.appendChild(a);
    });
  }

  /* ---------- filter controls ---------- */
  function buildControls() {
    var semBox = $('#f-sem');
    SEMS.forEach(function (s) {
      var b = el('button', 'st-chip', s);
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { toggle(state.sem, s); });
      b.dataset.v = s;
      semBox.appendChild(b);
    });
    var famBox = $('#f-fam');
    sortedEntries(count(data, function (r) { return r.family; })).forEach(function (e) {
      var b = el('button', 'st-chip');
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      var dot = el('span', 'st-dot');
      dot.style.background = FAM_COLORS[e[0]] || '#999';
      b.appendChild(dot);
      b.appendChild(document.createTextNode(e[0]));
      b.dataset.v = e[0];
      b.addEventListener('click', function () { toggle(state.fam, e[0]); });
      famBox.appendChild(b);
    });
    segment($('#f-resp'), [['All', null], ['Women', 'Female'], ['Men', 'Male']], 'resp');
    segment($('#f-singer'), [['All', null], ['Male', 'Male'], ['Female', 'Female'], ['Group', 'Mixed or group']], 'singer');

    var lang = $('#f-lang');
    lang.appendChild(new Option('All languages', ''));
    sortedEntries(count(data, function (r) { return r.lang; })).forEach(function (e) {
      lang.appendChild(new Option(e[0] + ' (' + e[1] + ')', e[0]));
    });
    lang.addEventListener('change', function () { state.lang = lang.value || null; resetShown(); render(); });

    var q = $('#f-q'), timer;
    q.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { state.q = q.value.trim().toLowerCase(); resetShown(); render(); }, 150);
    });
    $('#f-sort').addEventListener('change', function (e) { state.sort = e.target.value; resetShown(); renderSongs(); });
    $('#st-reset').addEventListener('click', function () {
      state.sem.clear(); state.fam.clear(); state.resp = null; state.singer = null; state.lang = null; state.q = '';
      lang.value = ''; q.value = '';
      resetShown(); render();
    });
    $('#st-more').addEventListener('click', function () { state.shown += PAGE; renderSongs(); });
    $('#st-surprise').addEventListener('click', surprise);
  }
  function segment(box, opts, key) {
    opts.forEach(function (o) {
      var b = el('button', 'st-seg-btn', o[0]);
      b.type = 'button';
      b.dataset.v = o[1] == null ? '' : o[1];
      b.addEventListener('click', function () { state[key] = o[1]; resetShown(); render(); });
      box.appendChild(b);
    });
  }
  function toggle(set, v) { if (set.has(v)) set.delete(v); else set.add(v); resetShown(); render(); }
  function resetShown() { state.shown = PAGE; }

  function syncControls() {
    root.querySelectorAll('#f-sem .st-chip').forEach(function (b) {
      var on = state.sem.has(b.dataset.v); b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on);
    });
    root.querySelectorAll('#f-fam .st-chip').forEach(function (b) {
      var on = state.fam.has(b.dataset.v); b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on);
    });
    ['resp', 'singer'].forEach(function (k) {
      root.querySelectorAll('#f-' + k + ' .st-seg-btn').forEach(function (b) {
        var on = (state[k] || '') === b.dataset.v; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on);
      });
    });
  }

  /* ---------- charts ---------- */
  function barList(box, items, opts) {
    box.textContent = '';
    var max = Math.max.apply(null, items.map(function (i) { return i.value; }).concat([1]));
    items.forEach(function (it) {
      var row = el(it.onClick ? 'button' : 'div', 'st-bar' + (it.active ? ' is-active' : ''));
      if (it.onClick) { row.type = 'button'; row.addEventListener('click', it.onClick); }
      row.appendChild(el('span', 'st-bar-label', it.label));
      var track = el('span', 'st-bar-track');
      var fill = el('span', 'st-bar-fill');
      fill.style.background = it.color || '#6e1423';
      fill.style.width = (it.value / max * 100) + '%';
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(el('span', 'st-bar-val', it.value.toLocaleString()));
      box.appendChild(row);
    });
    if (!items.length) box.appendChild(el('p', 'st-empty', 'Nothing matches these filters.'));
  }
  function stack(box, segs, total, label) {
    var row = el('div', 'st-stack-row');
    if (label) row.appendChild(el('span', 'st-stack-label', label));
    var bar = el('div', 'st-stack');
    segs.forEach(function (s) {
      if (!s.value) return;
      var p = pct(s.value, total);
      var seg = el('span', 'st-seg-fill', p >= 9 ? p + '%' : '');
      seg.style.width = (s.value / total * 100) + '%';
      seg.style.background = s.color;
      seg.title = s.label + ': ' + s.value + ' songs (' + p + '%)';
      bar.appendChild(seg);
    });
    row.appendChild(bar);
    box.appendChild(row);
  }

  function chartPick() {
    var box = $('#c-pick'); box.textContent = '';
    var rows = rowsFor('resp').filter(function (r) { return r.resp; });
    var order = ['Male', 'Female', 'Mixed or group'];
    [['Women', 'Female'], ['Men', 'Male']].forEach(function (g) {
      var sub = rows.filter(function (r) { return r.resp === g[1]; });
      var m = count(sub, function (r) { return r.singer; });
      stack(box, order.map(function (o) { return { label: o + ' artist', value: m[o] || 0, color: SINGER_COLORS[o] }; }), sub.length || 1, g[0] + ' (' + sub.length + ' songs)');
    });
    var lg = el('div', 'st-legend');
    order.forEach(function (o) {
      var s = el('span', 'st-legend-item'); var d = el('span', 'st-dot'); d.style.background = SINGER_COLORS[o];
      s.appendChild(d); s.appendChild(document.createTextNode(o === 'Mixed or group' ? 'Group or mixed' : o + ' artist')); lg.appendChild(s);
    });
    box.appendChild(lg);
    var w = rows.filter(function (r) { return r.resp === 'Female'; }), m2 = rows.filter(function (r) { return r.resp === 'Male'; });
    var wm = pct(w.filter(function (r) { return r.singer === 'Male'; }).length, w.length);
    var mm = pct(m2.filter(function (r) { return r.singer === 'Male'; }).length, m2.length);
    $('#st-pick-note').textContent = rows.length ? 'In the current selection, men picked male artists ' + mm + '% of the time and women ' + wm + '%.' : '';
  }

  function chartFam() {
    var rows = rowsFor('fam');
    var m = count(rows, function (r) { return r.family; });
    barList($('#c-fam'), sortedEntries(m).map(function (e) {
      return { label: e[0], value: e[1], color: FAM_COLORS[e[0]], active: state.fam.has(e[0]), onClick: function () { toggle(state.fam, e[0]); } };
    }));
  }

  function chartSem() {
    var box = $('#c-sem'); box.textContent = '';
    var rows = rowsFor('sem');
    var fams = Object.keys(FAM_COLORS);
    SEMS.forEach(function (s) {
      var sub = rows.filter(function (r) { return r.sems.indexOf(s) !== -1; });
      var m = count(sub, function (r) { return r.family; });
      var wrap = el('button', 'st-stack-btn' + (state.sem.has(s) ? ' is-active' : ''));
      wrap.type = 'button';
      wrap.addEventListener('click', function () { toggle(state.sem, s); });
      stack(wrap, fams.map(function (f) { return { label: f, value: m[f] || 0, color: FAM_COLORS[f] }; }), sub.length || 1, s);
      box.appendChild(wrap);
    });
    var lg = $('#c-sem-legend');
    if (!lg.childNodes.length) {
      fams.forEach(function (f) {
        var s = el('span', 'st-legend-item'); var d = el('span', 'st-dot'); d.style.background = FAM_COLORS[f];
        s.appendChild(d); s.appendChild(document.createTextNode(f)); lg.appendChild(s);
      });
    }
  }

  function chartFeel() {
    var rows = rowsFor('').filter(function (r) { return r.feeling; });
    var m = count(rows, function (r) { return r.feeling; });
    var colors = { Great: '#6e1423', Good: '#a8556b', Okay: '#b8863b', Calm: '#4f7a8c', Tired: '#3f4b5b', Stressed: '#7a5ea8', 'Still alive': '#9a9a9a' };
    barList($('#c-feel'), sortedEntries(m).map(function (e) { return { label: e[0], value: e[1], color: colors[e[0]] }; }));
  }
  function chartWx() {
    var rows = rowsFor('').filter(function (r) { return r.weather; });
    var m = count(rows, function (r) { return r.weather; });
    barList($('#c-wx'), sortedEntries(m).map(function (e) { return { label: e[0], value: e[1], color: '#b8863b' }; }));
  }
  function chartArtists() {
    var ol = $('#c-artists'); ol.textContent = '';
    var rows = rowsFor('');
    sortedEntries(count(rows, function (r) { return r.artist; })).slice(0, 8).forEach(function (e) {
      var li = el('li');
      li.appendChild(el('span', 'st-artist-name', e[0]));
      li.appendChild(el('span', 'st-artist-n', plural(e[1], 'song')));
      ol.appendChild(li);
    });
    if (!ol.childNodes.length) ol.appendChild(el('li', 'st-empty', 'Nothing matches these filters.'));
  }

  /* ---------- songs ---------- */
  function sortRows(rows) {
    var r = rows.slice();
    if (state.sort === 'old') r.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    else if (state.sort === 'streams') r.sort(function (a, b) { return (b.streams || 0) - (a.streams || 0); });
    else if (state.sort === 'times') r.sort(function (a, b) { return b.times - a.times || a.title.localeCompare(b.title); });
    else if (state.sort === 'az') r.sort(function (a, b) { return a.title.localeCompare(b.title); });
    else r.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    return r;
  }
  function fmtStreams(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return Math.round(n / 1e6) + 'M';
    if (n >= 1e3) return Math.round(n / 1e3) + 'K';
    return String(n);
  }
  function card(r) {
    var c = el('article', 'st-song');
    c.style.borderTopColor = FAM_COLORS[r.family] || '#999';
    var top = el('div', 'st-song-top');
    top.appendChild(el('h3', 'st-song-title', r.title));
    var badges = el('span', 'st-badges');
    if (r.times > 1) badges.appendChild(el('span', 'st-badge st-badge--times', 'Chosen ' + r.times + 'x'));
    if (r.top5 > 0) badges.appendChild(el('span', 'st-badge', 'Top 5'));
    if (badges.childNodes.length) top.appendChild(badges);
    c.appendChild(top);
    c.appendChild(el('p', 'st-song-artist', r.artist));
    var tags = el('p', 'st-tags');
    [r.genre, r.mood, r.lang !== 'English' ? r.lang : null, r.sems.length > 1 ? r.sems.length + ' semesters' : r.sem].forEach(function (t, i) {
      if (!t) return;
      var tg = el('span', 'st-tag', t);
      if (i === 3 && r.sems.length > 1) tg.title = r.sems.join(', ');
      tags.appendChild(tg);
    });
    c.appendChild(tags);
    var ctx = [];
    if (r.resp) ctx.push((r.times > 1 ? 'First chosen by a ' : 'Chosen by a ') + (r.resp === 'Female' ? 'woman' : 'man'));
    if (r.feeling) ctx.push('feeling ' + r.feeling.toLowerCase());
    if (r.weather) ctx.push(r.weather.toLowerCase() + ' outside');
    if (ctx.length) c.appendChild(el('p', 'st-song-ctx', ctx.join(', ') + '.'));
    var foot = el('div', 'st-song-foot');
    var meta = [];
    if (r.sec) meta.push(mmss(r.sec));
    if (r.streams) meta.push(fmtStreams(r.streams) + ' plays');
    foot.appendChild(el('span', 'st-song-meta', meta.join(' · ')));
    if (r.id) {
      var b = el('button', 'st-play', 'Play');
      b.type = 'button';
      b.setAttribute('aria-label', 'Play ' + r.title + ' by ' + r.artist);
      b.addEventListener('click', function () { openPlayer(c, r, 80); b.remove(); });
      foot.appendChild(b);
    }
    c.appendChild(foot);
    return c;
  }
  function openPlayer(host, r, h) {
    var old = host.querySelector('iframe');
    if (old) old.remove();
    var f = document.createElement('iframe');
    f.src = 'https://open.spotify.com/embed/track/' + r.id + '?utm_source=generator';
    f.height = h; f.width = '100%'; f.loading = 'lazy'; f.title = r.title + ' by ' + r.artist;
    f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    f.className = 'st-embed';
    host.appendChild(f);
  }
  function renderSongs() {
    var rows = sortRows(rowsFor(''));
    var box = $('#st-songs'); box.textContent = '';
    rows.slice(0, state.shown).forEach(function (r, i) {
      var c = card(r);
      if (!reduceMotion) c.style.animationDelay = Math.min(i % PAGE, 12) * 30 + 'ms';
      box.appendChild(c);
    });
    if (!rows.length) box.appendChild(el('p', 'st-empty', 'No songs match these filters. Try clearing one.'));
    $('#st-more').hidden = rows.length <= state.shown;
  }
  function surprise() {
    var rows = rowsFor('').filter(function (r) { return r.id; });
    if (!rows.length) return;
    var r = rows[Math.floor(Math.random() * rows.length)];
    var f = $('#st-featured');
    f.hidden = false; f.textContent = '';
    f.appendChild(el('p', 'st-featured-eyebrow', 'Your random pick'));
    var c = card(r);
    c.classList.add('is-featured');
    var btn = c.querySelector('.st-play'); if (btn) btn.remove();
    f.appendChild(c);
    openPlayer(c, r, 152);
    f.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }

  /* ---------- orchestrate ---------- */
  function render() {
    syncControls();
    var n = rowsFor('').length;
    $('#st-count').textContent = 'Showing ' + n.toLocaleString() + ' of ' + data.length.toLocaleString() + ' songs';
    var active = state.sem.size || state.fam.size || state.resp || state.singer || state.lang || state.q;
    $('#st-reset').hidden = !active;
    chartPick(); chartFam(); chartSem(); chartFeel(); chartWx(); chartArtists();
    renderSongs();
  }

  fetch(root.getAttribute('data-src'))
    .then(function (r) { return r.json(); })
    .then(function (d) {
      data = d;
      heroStats(); insights(); buildControls(); render();
      root.classList.add('is-ready');
    })
    .catch(function () {
      var p = el('p', 'st-empty', 'The playlist data could not be loaded. Please refresh the page.');
      root.appendChild(p);
    });
})();
