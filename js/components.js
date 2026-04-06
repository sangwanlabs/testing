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
    '/platforms/aioniq':                    'pages/Platforms/AIONIQ.html',
    '/platforms/vector':                    'pages/Vector/Overview.html',
    '/platforms/vector-platform':           'pages/Vector/Platform.html',
    '/platforms/vector-integrations':       'pages/Vector/Integration.html',
    '/solutions/agentic-ai':                'pages/Solutions/AgenticAI.html',
    '/solutions/applications':              'pages/Solutions/Applications.html',
    '/solutions/data':                      'pages/Solutions/Data.html',
    '/solutions/cloud':                     'pages/Solutions/Cloud.html',
    '/gcc/overview':                        'pages/GCC/Overview.html',
    '/gcc/managed-service':                 'pages/GCC/ManagedService.html',
    '/gcc/pay-as-you-go':                   'pages/GCC/PayAsYouGo.html',
    '/gcc/build-operate-transfer':          'pages/GCC/BuildOperateTransfer.html',
    '/gcc/thought-leadership':              'pages/GCC/ThoughtLeadership.html',
    '/industries/financial-services':       'pages/Industries/FinancialServices.html',
    '/industries/healthcare':               'pages/Industries/Healthcare.html',
    '/industries/manufacturing':            'pages/Industries/Manufacturing.html',
    '/industries/media':                    'pages/Industries/Media.html',
    '/resources/insights':                  'pages/Resources/Insights.html',
    '/resources/research':                  'pages/Resources/ResourcesHub.html',
    '/resources/case-studies':              'pages/Resources/CaseStudy.html',
    '/resources/events':                    'pages/Resources/Events.html',
    '/resources/news':                      'pages/Resources/News.html',
    '/company/about':                       'pages/Company/About.html',
    '/company/our-journey':                 'pages/Company/OurJourney.html',
    '/company/awards':                      'pages/Company/AwardsRecognitions.html',
    '/company/partners':                    'pages/Company/Partners.html',
    '/company/leadership':                  'pages/Company/Leadership.html',
    '/careers/life-at-parkar':              'pages/Careers/LifeAtParkar.html',
    '/careers/open-positions':              'pages/Careers/OpenPositions.html',
    '/careers/team-highlights':             'pages/Careers/TeamHighlights.html',
    '/contact':                             'pages/Contact.html',
    '/careers/team-highlights/satyen':             'pages/Careers/TeamHighlights/Satyen.html',
    // GCC articles
    '/gcc/blogs/BuildingForIntelligence':           'pages/GCC/GccBlogs/BuildingForIntelligence.html',
    '/gcc/blogs/WhyEnterpriseAIStruggles':          'pages/GCC/GccBlogs/WhyEnterpriseAIStruggles.html',
    '/gcc/case-studies/gen-ai-studio':              'pages/GCC/GccCaseStudies/GenAIStudio.html',
    '/gcc/case-studies/real-time-ai-ops':           'pages/GCC/GccCaseStudies/RealTimeAIOps.html',
    // Resources articles
    '/resources/blogs/the-architecture-that-frees-your-data-engineering-team': 'pages/Resources/blogs/the-architecture-that-frees-your-data-engineering-team.html',
    '/resources/blogs/when-fraud-monitoring-becomes-manual-triage':            'pages/Resources/blogs/when-fraud-monitoring-becomes-manual-triage.html',
    '/resources/blogs/alert-fatigue-is-a-data-architecture-problem':          'pages/Resources/blogs/alert-fatigue-is-a-data-architecture-problem.html',
    '/resources/case-studies/predictive-maintenance':                 'pages/Resources/case-studies/predictive-maintenance.html',
    '/resources/case-studies/stabilizing-global-it-operations':       'pages/Resources/case-studies/stabilizing-global-it-operations.html',
    '/resources/case-studies/unlocking-population-health-insights':   'pages/Resources/case-studies/unlocking-population-health-insights.html',
    '/resources/events/ta-leadership-retreat':                        'pages/Resources/events/ta-leadership-retreat.html',
    '/resources/events/microsoft-mumbai-ai-tour-2025':                'pages/Resources/events/microsoft-mumbai-ai-tour-2025.html',
    '/resources/events/et-gcc-conclave-2025':                         'pages/Resources/events/et-gcc-conclave-2025.html',
    '/resources/webinars/curateai-demo':                              'pages/Resources/webinars/curateai-demo.html',
    '/resources/webinars/building-resilient-cloud-infrastructure-sre':'pages/Resources/webinars/building-resilient-cloud-infrastructure-sre.html',
    '/resources/webinars/end-to-end-api-testing-apac-emea':           'pages/Resources/webinars/end-to-end-api-testing-apac-emea.html',
    '/resources/news/national-technology-day-2024':                   'pages/Resources/news/national-technology-day-2024.html',
    '/resources/news/revolutionizing-it-vectors-vision':              'pages/Resources/news/revolutionizing-it-vectors-vision.html',
    '/resources/news/parkar-digital-vector-2-launch':                 'pages/Resources/news/parkar-digital-vector-2-launch.html',
    // Solutions case studies
    '/solutions/case-studies/unlocking-growth-user-adoption':   'pages/Solutions/case-studies/unlocking-growth-user-adoption.html',
    '/solutions/case-studies/operational-excellence-cloud':     'pages/Solutions/case-studies/operational-excellence-cloud.html',
    '/solutions/case-studies/cost-efficiency-cloud':            'pages/Solutions/case-studies/cost-efficiency-cloud.html',
    '/solutions/case-studies/elevating-database-performance':   'pages/Solutions/case-studies/elevating-database-performance.html',
    '/solutions/case-studies/data-driven-bi':                   'pages/Solutions/case-studies/data-driven-bi.html',
    '/solutions/case-studies/strategic-insight-cloud':          'pages/Solutions/case-studies/strategic-insight-cloud.html',
  };

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

    // Environments that do NOT have server-side URL rewriting.
  // On these, clean URLs (/contact etc.) must be remapped to real file paths.
  // Cloudflare Workers/Pages HAVE server-side routing, so exclude them.
  const _needsFileRemap =
    (window.location.protocol === 'file:' ||             // opened as file
     window.location.hostname === '127.0.0.1' ||         // Live Server
     window.location.hostname === 'localhost' ||          // any local server
     window.location.hostname.endsWith('.github.io')) &&  // GitHub Pages
    !window.location.hostname.endsWith('.workers.dev') && // Cloudflare Workers
    !window.location.hostname.endsWith('.pages.dev');     // Cloudflare Pages
  /* ── Page depth relative to project root ────────────────────────────────── */
  // Always uses _rootUrl when available so the repo-name prefix on GitHub Pages
  // (e.g. /parkar-main-website/) is correctly stripped before counting slashes.
  //
  // Examples:
  //   Live Server  http://127.0.0.1:5500/pages/Solutions/Data.html  → depth 2
  //   GitHub Pages https://user.github.io/repo/pages/Solutions/Data.html → depth 2
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
  // Runs only on environments without URL rewriting (local / GitHub Pages).
  // Converts every  href="/contact"  →  href="../../pages/Contact.html"
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
  document.addEventListener('DOMContentLoaded', async () => {
    rewritePageLinks(); // local dev + GitHub Pages only

    await Promise.all([
      loadComponent('navbar-placeholder', 'components/navbar.html'),
      loadComponent('footer-placeholder', 'components/footer.html'),
    ]);

    highlightActiveNav();
    document.dispatchEvent(new CustomEvent('allComponentsLoaded'));
  });

})();
