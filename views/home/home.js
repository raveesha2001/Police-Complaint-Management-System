/* home.js | behaviour specific to the home view */
$(function () {

  // Block access if not logged in
  if (!CMS.auth.requireLogin()) return;

  /* ---------- Logged-in user (header + welcome) ---------- */
  var user = CMS.auth.getUser();
  $('#userName, #welcomeName').text(user);
  $('#userAvatar').text(user.charAt(0).toUpperCase());
  $('#btnLogout').on('click', function (e) { e.preventDefault(); CMS.auth.logout(); });

  /* ---------- Module list ----------
     slug = folder/file name of the target view  ->  ../<slug>/<slug>.html
     Later you can load this list (or filter it by privilege) from the backend. */
  var MODULES = [
    { id: 'complaints', title: 'Complaints', desc: 'Handle, assign and follow up complaints.', items: [
      { slug: 'my-assignments',        t: 'My Assignments',         d: 'Complaints assigned to you',    i: 'fas fa-clipboard-check' },
      { slug: 'lost-phone-assignments',t: 'Lost Phone Assignments', d: 'Lost phone cases for you',      i: 'fas fa-mobile-alt' },
      { slug: 'view-requests',         t: 'View Requests',          d: 'Browse all requests',           i: 'fas fa-file-alt' },
      { slug: 'assigned-requests',     t: 'Assigned Requests',      d: 'See who is handling what',      i: 'fas fa-paper-plane' },
      { slug: 'edit-requests',         t: 'Edit Requests',          d: 'Update request details',        i: 'fas fa-pencil-alt' },
      { slug: 'reactivate-complaints', t: 'Re-Activate Complaints', d: 'Reopen closed complaints',      i: 'fas fa-sync-alt' },
      { slug: 'police-locations',      t: 'Police Locations',       d: 'Stations and offices',          i: 'fas fa-map-marker-alt' }
    ]},
    { id: 'reports', title: 'Reports', desc: 'Dashboards and statistics.', items: [
      { slug: 'dashboard-360',         t: '360 Dashboard',          d: 'Full overview at a glance',     i: 'fas fa-th-large' },
      { slug: 'report-data',           t: 'Report & Data',          d: 'Reports and data export',       i: 'fas fa-file-export' },
      { slug: 'officer-stats',         t: 'Officer Stats',          d: 'Performance by officer',        i: 'fas fa-chart-bar' },
      { slug: 'main-complaint-stats',  t: 'Main Complaint Stats',   d: 'Totals by complaint type',      i: 'fas fa-chart-line' },
      { slug: 'forward-count',         t: 'Forward Count',          d: 'Forwarded complaint totals',    i: 'fas fa-location-arrow' }
    ]},
    { id: 'settings', title: 'Configurations', desc: 'Manage users, access and system options.', items: [
      { slug: 'category-type',         t: 'Category Type Management', d: 'Complaint category types',    i: 'fas fa-tag' },
      { slug: 'category-assignment',   t: 'Category Assignment',    d: 'Link categories to officers',   i: 'far fa-check-square' },
      { slug: 'display-text',          t: 'Display Text Management',d: 'Edit labels and messages',      i: 'fas fa-font' },
      { slug: 'after-hour',            t: 'After Hour Management',  d: 'After-hours settings',          i: 'far fa-clock' },
      { slug: 'user-management',       t: 'User Management',       d: 'Add and edit users',            i: 'far fa-user' },
      { slug: 'privilege-management',  t: 'Privilege Management',   d: 'Roles and permissions',         i: 'fas fa-shield-alt' },
      { slug: 'location-management',   t: 'Location Management',    d: 'Manage locations',              i: 'fas fa-map-marker-alt' },
      { slug: 'designation-management',t: 'Designation Management', d: 'Officer designations',          i: 'fas fa-medal' },
      { slug: 'change-password',       t: 'Change My Password',     d: 'Update your password',          i: 'fas fa-lock' }
    ]}
  ];

  /* ---------- Render (optionally filtered by search text) ---------- */
  function render(query) {
    var q = $.trim(query || '').toLowerCase(), count = 0, idx = 0;
    var $wrap = $('#moduleSections').empty();

    MODULES.forEach(function (sec) {
      var items = sec.items.filter(function (m) { return !q || (m.t + ' ' + m.d).toLowerCase().indexOf(q) > -1; });
      if (!items.length) return;

      var $sec = $('<section class="mod-section sec-' + sec.id + '"></section>');
      $sec.append($('<div class="mod-head"></div>').append($('<h2></h2>').text(sec.title), $('<p></p>').text(sec.desc)));

      var $grid = $('<div class="mod-grid"></div>');
      items.forEach(function (m) {
        $grid.append(
          $('<a class="mod-card"></a>').attr({ href: '../' + m.slug + '/' + m.slug + '.html', style: '--d:' + (idx++) }).append(
            $('<span class="mod-ico"></span>').append($('<i></i>').addClass(m.i)),
            $('<span class="mod-text"></span>').append($('<strong></strong>').text(m.t), $('<small></small>').text(m.d))
          )
        );
        count++;
      });
      $wrap.append($sec.append($grid));
    });

    $('#noResults').prop('hidden', count > 0);
  }

  render();                                   // first load (with entrance animation)
  $('#moduleSections').addClass('static');    // no animation replay on later renders (search)

  /* ---------- Search ---------- */
  $('#moduleSearch').on('input', function () { render($(this).val()); });
  $('#moduleSearch').on('keydown', function (e) {
    if (e.key === 'Escape') { $(this).val('').blur(); render(); }
    if (e.key === 'Enter') { var $first = $('.mod-card').first(); if ($first.length) window.location.href = $first.attr('href'); }
  });
  // Press "/" anywhere to jump to the search box
  $(document).on('keydown', function (e) {
    if (e.key === '/' && !$(e.target).is('input, textarea, select')) { e.preventDefault(); $('#moduleSearch').focus(); }
  });
});