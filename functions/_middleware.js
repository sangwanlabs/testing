/**
 * Cloudflare Workers Middleware
 * Handles URL routing: redirects /pages/* and rewrites clean URLs to serve files
 */

// Map clean URLs to file paths
const CLEAN_URL_TO_FILE = {
  '/contact': '/Contact.html',
  '/platforms/aioniq': '/Platforms/AIONIQ.html',
  '/platforms/vector': '/Vector/Overview.html',
  '/platforms/vector-platform': '/Vector/Platform.html',
  '/platforms/vector-integrations': '/Vector/Integration.html',
  '/solutions/agentic-ai': '/Solutions/AgenticAI.html',
  '/solutions/applications': '/Solutions/Applications.html',
  '/solutions/data': '/Solutions/Data.html',
  '/solutions/cloud': '/Solutions/Cloud.html',
  '/solutions/case-studies/unlocking-growth-user-adoption': '/Solutions/case-studies/unlocking-growth-user-adoption.html',
  '/solutions/case-studies/operational-excellence-cloud': '/Solutions/case-studies/operational-excellence-cloud.html',
  '/solutions/case-studies/cost-efficiency-cloud': '/Solutions/case-studies/cost-efficiency-cloud.html',
  '/solutions/case-studies/elevating-database-performance': '/Solutions/case-studies/elevating-database-performance.html',
  '/solutions/case-studies/data-driven-bi': '/Solutions/case-studies/data-driven-bi.html',
  '/solutions/case-studies/strategic-insight-cloud': '/Solutions/case-studies/strategic-insight-cloud.html',
  '/gcc/overview': '/GCC/Overview.html',
  '/gcc/managed-service': '/GCC/ManagedService.html',
  '/gcc/pay-as-you-go': '/GCC/PayAsYouGo.html',
  '/gcc/build-operate-transfer': '/GCC/BuildOperateTransfer.html',
  '/gcc/thought-leadership': '/GCC/ThoughtLeadership.html',
  '/gcc/blogs/BuildingForIntelligence': '/GCC/GccBlogs/BuildingForIntelligence.html',
  '/gcc/blogs/WhyEnterpriseAIStruggles': '/GCC/GccBlogs/WhyEnterpriseAIStruggles.html',
  '/gcc/case-studies/gen-ai-studio': '/GCC/GccCaseStudies/GenAIStudio.html',
  '/gcc/case-studies/real-time-ai-ops': '/GCC/GccCaseStudies/RealTimeAIOps.html',
  '/industries/financial-services': '/Industries/FinancialServices.html',
  '/industries/healthcare': '/Industries/Healthcare.html',
  '/industries/manufacturing': '/Industries/Manufacturing.html',
  '/industries/media': '/Industries/Media.html',
  '/resources/insights': '/Resources/Insights.html',
  '/resources/research': '/Resources/ResourcesHub.html',
  '/resources/case-studies': '/Resources/CaseStudy.html',
  '/resources/events': '/Resources/Events.html',
  '/resources/news': '/Resources/News.html',
  '/resources/blogs/the-architecture-that-frees-your-data-engineering-team': '/Resources/blogs/the-architecture-that-frees-your-data-engineering-team.html',
  '/resources/blogs/when-fraud-monitoring-becomes-manual-triage': '/Resources/blogs/when-fraud-monitoring-becomes-manual-triage.html',
  '/resources/blogs/alert-fatigue-is-a-data-architecture-problem': '/Resources/blogs/alert-fatigue-is-a-data-architecture-problem.html',
  '/resources/case-studies/predictive-maintenance': '/Resources/case-studies/predictive-maintenance.html',
  '/resources/case-studies/stabilizing-global-it-operations': '/Resources/case-studies/stabilizing-global-it-operations.html',
  '/resources/case-studies/unlocking-population-health-insights': '/Resources/case-studies/unlocking-population-health-insights.html',
  '/resources/events/ta-leadership-retreat': '/Resources/events/ta-leadership-retreat.html',
  '/resources/events/microsoft-mumbai-ai-tour-2025': '/Resources/events/microsoft-mumbai-ai-tour-2025.html',
  '/resources/events/et-gcc-conclave-2025': '/Resources/events/et-gcc-conclave-2025.html',
  '/resources/webinars/curateai-demo': '/Resources/webinars/curateai-demo.html',
  '/resources/webinars/building-resilient-cloud-infrastructure-sre': '/Resources/webinars/building-resilient-cloud-infrastructure-sre.html',
  '/resources/webinars/end-to-end-api-testing-apac-emea': '/Resources/webinars/end-to-end-api-testing-apac-emea.html',
  '/resources/news/national-technology-day-2024': '/Resources/news/national-technology-day-2024.html',
  '/resources/news/revolutionizing-it-vectors-vision': '/Resources/news/revolutionizing-it-vectors-vision.html',
  '/resources/news/parkar-digital-vector-2-launch': '/Resources/news/parkar-digital-vector-2-launch.html',
  '/company/about': '/Company/About.html',
  '/company/our-journey': '/Company/OurJourney.html',
  '/company/awards': '/Company/AwardsRecognitions.html',
  '/company/partners': '/Company/Partners.html',
  '/company/leadership': '/Company/Leadership.html',
  '/careers/life-at-parkar': '/Careers/LifeAtParkar.html',
  '/careers/open-positions': '/Careers/OpenPositions.html',
  '/careers/team-highlights': '/Careers/TeamHighlights.html',
  '/careers/team-highlights/satyen': '/Careers/TeamHighlights/Satyen.html',
  '/legal/privacy': '/FooterPages/PrivacyPolicy.html',
  '/legal/terms': '/FooterPages/TermsOfUse.html',
};

// Reverse map: /pages/* paths to clean URLs
const FILE_TO_CLEAN_URL = {};
Object.entries(CLEAN_URL_TO_FILE).forEach(([cleanUrl, filePath]) => {
  const pathWithoutExt = filePath.replace(/\.html$/, '');
  FILE_TO_CLEAN_URL[pathWithoutExt] = cleanUrl;
  FILE_TO_CLEAN_URL[filePath] = cleanUrl;
});

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  
  // Case 1: Someone is accessing /pages/* - redirect to clean URL
  if (pathname.startsWith('/pages/')) {
    const pathWithoutExt = pathname.replace(/\.html$/, '');
    const cleanUrl = FILE_TO_CLEAN_URL[pathWithoutExt];
    
    if (cleanUrl) {
      return Response.redirect(new URL(cleanUrl, url.origin).toString(), 301);
    }
  }
  
  // Case 2: Someone is accessing a clean URL - rewrite to serve the actual file
  const filePath = CLEAN_URL_TO_FILE[pathname];
  if (filePath) {
    // Rewrite the URL to serve the file but keep the clean URL in browser
    const newUrl = new URL(context.request.url);
    newUrl.pathname = filePath;
    
    // Create a new request with the rewritten URL
    const newRequest = new Request(newUrl.toString(), context.request);
    
    // Fetch the file
    return context.env.ASSETS.fetch(newRequest);
  }
  
  // Case 3: Everything else - pass through
  return await context.next();
}
