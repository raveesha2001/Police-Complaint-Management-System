/* ==========================================================
   common.js  |  Shared helpers for all CMS views
   Requires: jQuery 3.x, Bootstrap 4.6 bundle, Bootstrap-select
   ========================================================== */
window.CMS = window.CMS || {};

/* ---- Config: change API base URL to your backend ---- */
CMS.config = {
  apiBaseUrl: '/api',          // e.g. 'https://cms.police.gov.lk/api'
  defaultLang: 'en',
  tokenKey: 'cms_token'
};

/* ---- Local/session storage helpers ---- */
CMS.storage = {
  get: function (k) { try { return localStorage.getItem(k) || sessionStorage.getItem(k); } catch (e) { return null; } },
  set: function (k, v, persist) { try { (persist ? localStorage : sessionStorage).setItem(k, v); } catch (e) {} },
  remove: function (k) { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch (e) {} }
};

/* ---- Fetch wrapper for backend integration ---- */
CMS.api = {
  request: function (method, url, body) {
    var headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    var token = CMS.storage.get(CMS.config.tokenKey);
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return fetch(CMS.config.apiBaseUrl + url, {
      method: method, headers: headers, body: body ? JSON.stringify(body) : undefined, credentials: 'include'
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) { var err = new Error(data.message || 'Request failed'); err.status = res.status; err.data = data; throw err; }
        return data;
      });
    });
  },
  get:  function (u)    { return this.request('GET', u); },
  post: function (u, b) { return this.request('POST', u, b); },
  put:  function (u, b) { return this.request('PUT', u, b); },
  del:  function (u)    { return this.request('DELETE', u); }
};

/* ---- i18n helper: pass a dictionary { en:{key:text}, si:{...}, ta:{...} } ---- */
CMS.i18n = {
  lang: CMS.config.defaultLang,
  dict: {},
  load: function (dict) { this.dict = dict; },
  t: function (key) { return (this.dict[this.lang] && this.dict[this.lang][key]) || (this.dict.en && this.dict.en[key]) || key; },
  apply: function (lang) {
    this.lang = lang;
    document.documentElement.lang = lang;
    var self = this;
    $('[data-i18n]').each(function () { $(this).text(self.t($(this).data('i18n'))); });
    $('[data-i18n-placeholder]').each(function () { $(this).attr('placeholder', self.t($(this).data('i18n-placeholder'))); });
    CMS.storage.set('cms_lang', lang, true);
  }
};

/* ---- Inline alert ---- */
CMS.alert = function (selector, msg) { $(selector).text(msg).addClass('show'); };
CMS.clearAlert = function (selector) { $(selector).removeClass('show').text(''); };

/* ---- Button loading state ---- */
CMS.setLoading = function ($btn, on, label) {
  if (on) { $btn.data('html', $btn.html()).prop('disabled', true).html('<span class="cms-spinner"></span> ' + (label || '')); }
  else { $btn.prop('disabled', false).html($btn.data('html')); }
};

/* ---- Global init ---- */
$(function () {
  // Bootstrap-select auto-init for any .selectpicker on any view
  if ($.fn.selectpicker) { $('.selectpicker').selectpicker({ style: '', styleBase: 'form-control' }); }
  // Bootstrap tooltips
  $('[data-toggle="tooltip"]').tooltip();
});
