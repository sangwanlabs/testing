/* =============================================
   PARKAR.IN - Component Loader
   js/components.js
   =============================================
   Loads reusable navbar & footer into every page.

   Environments handled automatically:
     • Local (Live Server / file://)   – depth-relative file paths
     • GitHub Pages (github.io)        – depth-relative file paths
                                         (no URL rewriting on GH Pages)
     • Production (Nginx / Apache)     – clean URLs served via
                                         nginx.conf / .htaccess rewrites
   ============================================= */

(function () {
  'use strict';

  /* ── Route map: clean URL → file path (relative to project root) ────────── */
  const ROUTES = {
    '/':                                    'index.html',
    '/platforms/aioniq':                    'Platforms/AIONIQ.html',
    '/platforms/vector':                    'Vector/Overview.html',
    '/platforms/vector-platform':           'Vector/Platform.html',
    '/platforms/vector-integrations':       'Vector/Integration.html',
    '/solutions/agentic-ai':                'Solutions/AgenticAI.html',
    '/solutions/applications':              'Solutions/Applications.html',
    '/solutions/data':                      'Solutions/Data.html',
    '/solutions/cloud':                     'Solutions/Cloud.html',
    '/gcc/overview':                        'GCC/Overview.html',
    '/gcc/managed-service':                 'GCC/ManagedService.html',
    '/gcc/pay-as-you-go':                   'GCC/PayAsYouGo.html',
    '/gcc/build-operate-transfer':          'GCC/BuildOperateTransfer.html',
    '/gcc/thought-leadership':              'GCC/ThoughtLeadership.html',
    '/industries/financial-services':       'Industries/FinancialServices.html',
    '/industries/healthcare':               'Industries/Healthcare.html',
    '/industries/manufacturing':            'Industries/Manufacturing.html',
    '/industries/media':                    'Industries/Media.html',
    '/resources/insights':                  'Resources/Insights.html',
    '/resources/research':                  'Resources/ResourcesHub.html',
    '/resources/case-studies':              'Resources/CaseStudy.html',
    '/resources/events':                    'Resources/Events.html',
    '/resources/news':                      'Resources/News.html',
    '/company/about':                       'Company/About.html',
    '/company/our-journey':                 'Company/OurJourney.html',
    '/company/awards':                      'Company/AwardsRecognitions.html',
    '/company/partners':                    'Company/Partners.html',
    '/company/leadership':                  'Company/Leadership.html',
    '/careers/life-at-parkar':              'Careers/LifeAtParkar.html',
    '/careers/open-positions':              'Careers/OpenPositions.html',
    '/careers/team-highlights':             'Careers/TeamHighlights.html',
    '/contact':                             'Contact.html',
    '/careers/team-highlights/satyen':             'Careers/TeamHighlights/Satyen.html',
    // GCC articles
    '/gcc/blogs/BuildingForIntelligence':           'GCC/GccBlogs/BuildingForIntelligence.html',
    '/gcc/blogs/WhyEnterpriseAIStruggles':          'GCC/GccBlogs/WhyEnterpriseAIStruggles.html',
    '/gcc/case-studies/gen-ai-studio':              'GCC/GccCaseStudies/GenAIStudio.html',
    '/gcc/case-studies/real-time-ai-ops':           'GCC/GccCaseStudies/RealTimeAIOps.html',
    // Resources articles
    '/resources/blogs/the-architecture-that-frees-your-data-engineering-team': 'Resources/blogs/the-architecture-that-frees-your-data-engineering-team.html',
    '/resources/blogs/when-fraud-monitoring-becomes-manual-triage':            'Resources/blogs/when-fraud-monitoring-becomes-manual-triage.html',
    '/resources/blogs/alert-fatigue-is-a-data-architecture-problem':          'Resources/blogs/alert-fatigue-is-a-data-architecture-problem.html',
    '/resources/case-studies/predictive-maintenance':                 'Resources/case-studies/predictive-maintenance.html',
    '/resources/case-studies/stabilizing-global-it-operations':       'Resources/case-studies/stabilizing-global-it-operations.html',
    '/resources/case-studies/unlocking-population-health-insights':   'Resources/case-studies/unlocking-population-health-insights.html',
    '/resources/events/ta-leadership-retreat':                        'Resources/events/ta-leadership-retreat.html',
    '/resources/events/microsoft-mumbai-ai-tour-2025':                'Resources/events/microsoft-mumbai-ai-tour-2025.html',
    '/resources/events/et-gcc-conclave-2025':                         'Resources/events/et-gcc-conclave-2025.html',
    '/resources/webinars/curateai-demo':                              'Resources/webinars/curateai-demo.html',
    '/resources/webinars/building-resilient-cloud-infrastructure-sre':'Resources/webinars/building-resilient-cloud-infrastructure-sre.html',
    '/resources/webinars/end-to-end-api-testing-apac-emea':           'Resources/webinars/end-to-end-api-testing-apac-emea.html',
    '/resources/news/national-technology-day-2024':                   'Resources/news/national-technology-day-2024.html',
    '/resources/news/revolutionizing-it-vectors-vision':              'Resources/news/revolutionizing-it-vectors-vision.html',
    '/resources/news/parkar-digital-vector-2-launch':                 'Resources/news/parkar-digital-vector-2-launch.html',
    // Solutions case studies
    '/solutions/case-studies/unlocking-growth-user-adoption':   'Solutions/case-studies/unlocking-growth-user-adoption.html',
    '/solutions/case-studies/operational-excellence-cloud':     'Solutions/case-studies/operational-excellence-cloud.html',
    '/solutions/case-studies/cost-efficiency-cloud':            'Solutions/case-studies/cost-efficiency-cloud.html',
    '/solutions/case-studies/elevating-database-performance':   'Solutions/case-studies/elevating-database-performance.html',
    '/solutions/case-studies/data-driven-bi':                   'Solutions/case-studies/data-driven-bi.html',
    '/solutions/case-studies/strategic-insight-cloud':          'Solutions/case-studies/strategic-insight-cloud.html',
  };

  /* ── Reverse map: file path → clean URL ────────────────────────────────── */
  const FILE_TO_CLEAN_URL = Object.entries(ROUTES).reduce((map, [cleanUrl, filePath]) => {
    const normalizedFilePath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    const pathWithoutExt = normalizedFilePath.replace(/\.html$/, '');

    map[normalizedFilePath] = cleanUrl;
    map[pathWithoutExt] = cleanUrl;
    return map;
  }, {});

  /* ── Detect environment ──────────────────────────────────────────────────── */
  const _scriptSrc = (document.currentScript || {}).src || '';

  // Project root URL derived from this script's own URL.
  // • Local file://  → "file:///home/.../parkar-main-website/"
  // • Live Server    → "http://127.0.0.1:5500/"
  // • GitHub Pages   → "https://user.github.io/parkar-main-website/"
  // • Production     → "https://parkar.in/"
  const _rootUrl = _scriptSrc
    ? _scriptSrc.replace(/js\/components\.js(\?.*)?$/, '')
    : '';

  // Environments that do NOT have reliable server-side URL rewriting.
  // On these, clean URLs (/contact etc.) must be remapped to real file paths.
  // The current workers.dev deployment serves the moved HTML files directly.
  const _needsFileRemap =
    (window.location.protocol === 'file:' ||             // opened as file
     window.location.hostname === '127.0.0.1' ||         // Live Server
     window.location.hostname === 'localhost' ||          // any local server
     window.location.hostname.endsWith('.github.io') ||   // GitHub Pages
     window.location.hostname.endsWith('.workers.dev')) &&// current deployment
    !window.location.hostname.endsWith('.pages.dev');     // Cloudflare Pages
  /* ── Page depth relative to project root ────────────────────────────────── */
  // Always uses _rootUrl when available so the repo-name prefix on GitHub Pages
  // (e.g. /parkar-main-website/) is correctly stripped before counting slashes.
  //
  // Examples:
  //   Live Server  http://127.0.0.1:5500/Solutions/Data.html  → depth 1
  //   GitHub Pages https://user.github.io/repo/Solutions/Data.html → depth 1
  //   Production   https://parkar.in/solutions/data  → depth 1 (doesn't matter,
  //                components fetched via absolute URL, hrefs are clean paths)
  function _getPageDepth() {
    if (_rootUrl) {
      const rootPath    = new URL(_rootUrl).pathname;       // "/" or "/repo-name/"
      const currentPath = window.location.pathname;
      const rel         = currentPath.slice(rootPath.length); // path relative to root
      return (rel.match(/\//g) || []).length;
    }
    return (window.location.pathname.match(/\//g) || []).length - 1;
  }

  /* ── Resolve a single href for the current environment ──────────────────── */
  function _resolve(raw, prefix) {
    // Production with URL rewriting: clean paths work natively — use as-is.
    if (!_needsFileRemap) return raw;

    // Clean absolute path (e.g. "/contact", "/platforms/aioniq#section") →
    // look up in ROUTES and convert to a depth-relative file path.
    if (raw.startsWith('/') && !raw.startsWith('//')) {
      const hash     = raw.includes('#') ? raw.slice(raw.indexOf('#')) : '';
      const base     = hash ? raw.slice(0, raw.indexOf('#')) : raw;
      const filePath = ROUTES[base];
      return filePath ? prefix + filePath + hash : raw;
    }

    // Legacy relative path (shouldn't exist after migration, but safe fallback)
    return prefix + raw;
  }

  /* ── Rewrite clean-URL hrefs already in the page HTML ───────────────────── */
  // Runs only on environments without URL rewriting.
  // Converts every  href="/contact"  →  href="../Contact.html"
  // before the user can click them.
  function rewritePageLinks() {
    if (!_needsFileRemap) return;
    const prefix = _buildPrefix();

    document.querySelectorAll('a[href]').forEach(el => {
      const href = el.getAttribute('href');
      if (!href) return;
      // Skip: external URLs, protocol-relative URLs, anchors, already-relative paths
      if (!href.startsWith('/') || href.startsWith('//')) return;

      const hash     = href.includes('#') ? href.slice(href.indexOf('#')) : '';
      const base     = hash ? href.slice(0, href.indexOf('#')) : href;
      const filePath = ROUTES[base];
      if (filePath) el.setAttribute('href', prefix + filePath + hash);
    });
  }

  function _buildPrefix() {
    const depth = _getPageDepth();
    return depth > 0 ? '../'.repeat(depth) : '';
  }

  /* ── Normalize direct file-path visits to clean URLs ───────────────────── */
  // Some deployments can serve direct HTML file paths without applying server-side
  // redirects. When that happens, keep the current document but swap the
  // address bar to the canonical clean path.
  function normalizeCurrentUrl() {
    if (_needsFileRemap) return;

    const currentPath = window.location.pathname;
    const cleanUrl =
      FILE_TO_CLEAN_URL[currentPath] ||
      FILE_TO_CLEAN_URL[currentPath.replace(/\.html$/, '')];

    if (cleanUrl && cleanUrl !== currentPath) {
      const nextUrl = `${cleanUrl}${window.location.search}${window.location.hash}`;
      window.history.replaceState(window.history.state, '', nextUrl);
    }
  }

  /* ── Fetch & inject a component partial ─────────────────────────────────── */
  async function loadComponent(targetId, componentPath) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const prefix = _buildPrefix();

    // Production: fetch from absolute root URL (avoids any path ambiguity).
    // Local / GitHub Pages: fetch using depth-relative path.
    const url = (_rootUrl && !_needsFileRemap)
      ? _rootUrl + componentPath
      : prefix + componentPath;

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const html = await resp.text();
      target.innerHTML = html;

      // Resolve data-local-href attributes for all environments
      target.querySelectorAll('[data-local-href]').forEach(el => {
        el.setAttribute('href', _resolve(el.getAttribute('data-local-href'), prefix));
      });

      // Re-execute any <script> tags inside the injected HTML
      target.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        [...oldScript.attributes].forEach(attr =>
          newScript.setAttribute(attr.name, attr.value)
        );
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });

      document.dispatchEvent(new CustomEvent('componentLoaded', { detail: { id: targetId } }));

    } catch (err) {
      console.warn(`[components.js] Could not load "${url}":`, err.message);
      target.style.display = 'none';
    }
  }

  /* ── Highlight active nav link ───────────────────────────────────────────── */
  function highlightActiveNav() {
    const currentPath = window.location.pathname
      .replace(/\/$/, '')
      .replace(/\.html$/, '');

    document.querySelectorAll('.nav-link, .dropdown-simple-link, .dropdown-link').forEach(link => {
      const href = (link.getAttribute('href') || '')
        .replace(/\.html$/, '')
        .replace(/\/$/, '');
      if (href && currentPath.endsWith(href)) {
        link.closest('.nav-item')?.classList.add('active');
      }
    });
  }

  /* ── Boot ────────────────────────────────────────────────────────────────── */
  normalizeCurrentUrl();

  document.addEventListener('DOMContentLoaded', async () => {
    rewritePageLinks();

    await Promise.all([
      loadComponent('navbar-placeholder', 'components/navbar.html'),
      loadComponent('footer-placeholder', 'components/footer.html'),
    ]);

    highlightActiveNav();
    document.dispatchEvent(new CustomEvent('allComponentsLoaded'));
  });

})();
