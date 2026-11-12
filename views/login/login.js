/* login.js | behaviour specific to the login view */
$(function () {
    /* TEMP: hardcoded login for UI development only. Set to false when the backend is ready. */
  var USE_HARDCODED_LOGIN = true;
  var DEV_USER = '000000', DEV_PASS = 'abc123';

  /* ---------- 1. Translations ---------- */
  CMS.i18n.load({
    en: { title: 'Officer sign-in', subtitle: 'Sign in with your official credentials to continue', username: 'Username', password: 'Password',
          remember: 'Remember me', forgot: 'Forgot password?', signin: 'Sign in securely',
          heroDesc: 'The Complaints Management System lets authorised officers register, track and resolve public complaints, with every action recorded for accountability.',
          f1: 'Complaint registration', f2: 'Case tracking', f3: 'Role-based access', f4: 'Full audit trail',
          required: 'Enter your username and password.', failed: 'Sign-in failed. Check your credentials and try again.' },
    si: { title: 'නිලධාරි පිවිසුම', subtitle: 'ඉදිරියට යාමට ඔබගේ නිල අක්තපත්‍ර භාවිතයෙන් පිවිසෙන්න', username: 'පරිශීලක නාමය', password: 'මුරපදය',
          remember: 'මාව මතක තබාගන්න', forgot: 'මුරපදය අමතකද?', signin: 'ආරක්ෂිතව පිවිසෙන්න',
          heroDesc: 'පැමිණිලි කළමනාකරණ පද්ධතිය මගින් බලයලත් නිලධාරීන්ට මහජන පැමිණිලි ලියාපදිංචි කිරීමට, ලුහුබැඳීමට සහ විසඳීමට හැකි අතර, සෑම ක්‍රියාවක්ම වගවීම සඳහා සටහන් වේ.',
          f1: 'පැමිණිලි ලියාපදිංචිය', f2: 'නඩු ලුහුබැඳීම', f3: 'භූමිකා පාදක ප්‍රවේශය', f4: 'සම්පූර්ණ විගණන සටහන',
          required: 'පරිශීලක නාමය සහ මුරපදය ඇතුළත් කරන්න.', failed: 'පිවිසීම අසාර්ථකයි. අක්තපත්‍ර පරීක්ෂා කර නැවත උත්සාහ කරන්න.' },
    ta: { title: 'அதிகாரி உள்நுழைவு', subtitle: 'தொடர உங்கள் அதிகாரப்பூர்வ சான்றுகளுடன் உள்நுழையவும்', username: 'பயனர்பெயர்', password: 'கடவுச்சொல்',
          remember: 'என்னை நினைவில் கொள்', forgot: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?', signin: 'பாதுகாப்பாக உள்நுழை',
          heroDesc: 'புகார் மேலாண்மை அமைப்பின் மூலம் அங்கீகரிக்கப்பட்ட அதிகாரிகள் பொதுமக்களின் புகார்களைப் பதிவு செய்து, கண்காணித்து, தீர்க்கலாம்; ஒவ்வொரு செயலும் பொறுப்புக்கூறலுக்காகப் பதிவு செய்யப்படும்.',
          f1: 'புகார் பதிவு', f2: 'வழக்கு கண்காணிப்பு', f3: 'பாத்திர அடிப்படையிலான அணுகல்', f4: 'முழு தணிக்கைப் பதிவு',
          required: 'பயனர்பெயர் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.', failed: 'உள்நுழைவு தோல்வியடைந்தது. சான்றுகளைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.' }
  });
  function setLang(l) { CMS.i18n.apply(l); $('.lang-btn').removeClass('active').filter('[data-lang="' + l + '"]').addClass('active'); }
  $('.lang-btn').on('click', function () { setLang($(this).data('lang')); });
  setLang(CMS.storage.get('cms_lang') || CMS.config.defaultLang);

  /* ---------- 2. Headline letter-by-letter animation ---------- */
  var charIndex = 0;
  $('[data-split]').each(function () {
    var $line = $(this), words = $line.text().trim().split(' ');
    $line.empty();
    words.forEach(function (w) {
      var $w = $('<span class="word"></span>');
      w.split('').forEach(function (c) { $w.append($('<span class="char"></span>').text(c).css('--i', charIndex++)); });
      $line.append($w);
    });
  });
  setTimeout(function () { $('.line-gold').addClass('done'); }, 1500);

  /* ---------- 3. Show / hide password ---------- */
  $('#togglePwd').on('click', function () {
    var $p = $('#password'), show = $p.attr('type') === 'password';
    $p.attr('type', show ? 'text' : 'password');
    $(this).attr('aria-label', show ? 'Hide password' : 'Show password').find('i').toggleClass('fa-eye fa-eye-slash');
  });

  /* ---------- 4. Submit ---------- */
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    CMS.clearAlert('#loginAlert');
    var user = $.trim($('#username').val()), pass = $('#password').val();
    $('.field').removeClass('invalid');
    if (!user || !pass) {
      if (!user) $('#username').closest('.field').addClass('invalid');
      if (!pass) $('#password').closest('.field').addClass('invalid');
      CMS.alert('#loginAlert', CMS.i18n.t('required'));
      $('.login-card').removeClass('shake'); void $('.login-card')[0].offsetWidth; $('.login-card').addClass('shake');
      return;
    }
    var $btn = $('#btnLogin');
    CMS.setLoading($btn, true);

        if (USE_HARDCODED_LOGIN) {
      setTimeout(function () {
        if (user === DEV_USER && pass === DEV_PASS) {
          CMS.storage.set(CMS.config.tokenKey, 'dev-token', $('#remember').is(':checked'));
          CMS.storage.set(CMS.auth.userKey, 'Tell-IGP', $('#remember').is(':checked'));
          window.location.href = '../home/home.html';
        } else {
          CMS.setLoading($btn, false);
          CMS.alert('#loginAlert', CMS.i18n.t('failed'));
          $('.login-card').removeClass('shake'); void $('.login-card')[0].offsetWidth; $('.login-card').addClass('shake');
        }
      }, 600);
      return;
    }

    // TODO (backend): adjust endpoint + payload + response fields
    CMS.api.post('/auth/login', { username: user, password: pass, remember: $('#remember').is(':checked') })
      .then(function (res) {
        CMS.storage.set(CMS.config.tokenKey, res.token, $('#remember').is(':checked'));
        window.location.href = '../home/home.html';
      })
      .catch(function (err) {
        CMS.alert('#loginAlert', (err && err.message && err.status ? err.message : CMS.i18n.t('failed')));
        $('.login-card').removeClass('shake'); void $('.login-card')[0].offsetWidth; $('.login-card').addClass('shake');
      })
      .then(function () { CMS.setLoading($btn, false); });
  });

  $('#forgotLink').on('click', function (e) { e.preventDefault(); /* TODO: window.location.href = '../forgot-password/forgot-password.html'; */ });

  /* ---------- 5. Background network animation ---------- */
  var cv = document.getElementById('bgCanvas'), ctx = cv.getContext('2d'), nodes = [], W, H;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize() {
    W = cv.width = window.innerWidth; H = cv.height = window.innerHeight;
    var n = Math.min(70, Math.floor(W * H / 22000)); nodes = [];
    for (var i = 0; i < n; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, gold: Math.random() < .18 });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      if (!reduce) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1; }
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 170) { ctx.strokeStyle = 'rgba(140,165,255,' + (0.16 * (1 - d / 170)) + ')'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      ctx.fillStyle = a.gold ? 'rgba(246,195,67,.85)' : 'rgba(140,165,255,.55)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.gold ? 2.6 : 2, 0, 6.283); ctx.fill();
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  resize(); draw();
  $(window).on('resize', function () { resize(); if (reduce) draw(); });
});
