/**
 * Cloudflare Workers Middleware
 * Handles URL routing: redirects /pages/* and rewrites clean URLs to serve files
 */

// Map clean URLs to file paths
const CLEAN_URL_TO_FILE = {
  '/contact': '/pages/Contact.html',
  '/platforms/aioniq': '/pages/Platforms/AIONIQ.html',
  '/platforms/vector': '/pages/Vector/Overview.html',
  '/platforms/vector-platform': '/pages/Vector/Platform.html',
  '/platforms/vector-integrations': '/pages/Vector/Integration.html',
  '/solutions/agentic-ai': '/pages/Solutions/AgenticAI.html',
  '/solutions/applications': '/pages/Solutions/Applications.html',
  '/solutions/data': '/pages/Solutions/Data.html',
  '/solutions/cloud': '/pages/Solutions/Cloud.html',
  '/solutions/case-studies/unlocking-growth-user-adoption': '/pages/Solutions/case-studies/unlocking-growth-user-adoption.html',
  '/solutions/case-studies/operational-excellence-cloud': '/pages/Solutions/case-studies/operational-excellence-cloud.html',
  '/solutions/case-studies/cost-efficiency-cloud': '/pages/Solutions/case-studies/cost-efficiency-cloud.html',
  '/solutions/case-studies/elevating-database-performance': '/pages/Solutions/case-studies/elevating-database-performance.html',
  '/solutions/case-studies/data-driven-bi': '/pages/Solutions/case-studies/data-driven-bi.html',
  '/solutions/case-studies/strategic-insight-cloud': '/pages/Solutions/case-studies/strategic-insight-cloud.html',
  '/gcc/overview': '/pages/GCC/Overview.html',
  '/gcc/managed-service': '/pages/GCC/ManagedService.html',
  '/gcc/pay-as-you-go': '/pages/GCC/PayAsYouGo.html',
  '/gcc/build-operate-transfer': '/pages/GCC/BuildOperateTransfer.html',
  '/gcc/thought-leadership': '/pages/GCC/ThoughtLeadership.html',
  '/gcc/blogs/BuildingForIntelligence': '/pages/GCC/GccBlogs/BuildingForIntelligence.html',
  '/gcc/blogs/WhyEnterpriseAIStruggles': '/pages/GCC/GccBlogs/WhyEnterpriseAIStruggles.html',
  '/gcc/case-studies/gen-ai-studio': '/pages/GCC/GccCaseStudies/GenAIStudio.html',
  '/gcc/case-studies/real-time-ai-ops': '/pages/GCC/GccCaseStudies/RealTimeAIOps.html',
  '/industries/financial-services': '/pages/Industries/FinancialServices.html',
  '/industries/healthcare': '/pages/Industries/Healthcare.html',
  '/industries/manufacturing': '/pages/Industries/Manufacturing.html',
  '/industries/media': '/pages/Industries/Media.html',
  '/resources/insights': '/pages/Resources/Insights.html',
  '/resources/research': '/pages/Resources/ResourcesHub.html',
  '/resources/case-studies': '/pages/Resources/CaseStudy.html',
  '/resources/events': '/pages/Resources/Events.html',
  '/resources/news': '/pages/Resources/News.html',
  '/resources/blogs/the-architecture-that-frees-your-data-engineering-team': '/pages/Resources/blogs/the-architecture-that-frees-your-data-engineering-team.html',
  '/resources/blogs/when-fraud-monitoring-becomes-manual-triage': '/pages/Resources/blogs/when-fraud-monitoring-becomes-manual-triage.html',
  '/resources/blogs/alert-fatigue-is-a-data-architecture-problem': '/pages/Resources/blogs/alert-fatigue-is-a-data-architecture-problem.html',
  '/resources/case-studies/predictive-maintenance': '/pages/Resources/case-studies/predictive-maintenance.html',
  '/resources/case-studies/stabilizing-global-it-operations': '/pages/Resources/case-studies/stabilizing-global-it-operations.html',
  '/resources/case-studies/unlocking-population-health-insights': '/pages/Resources/case-studies/unlocking-population-health-insights.html',
  '/resources/events/ta-leadership-retreat': '/pages/Resources/events/ta-leadership-retreat.html',
  '/resources/events/microsoft-mumbai-ai-tour-2025': '/pages/Resources/events/microsoft-mumbai-ai-tour-2025.html',
  '/resources/events/et-gcc-conclave-2025': '/pages/Resources/events/et-gcc-conclave-2025.html',
  '/resources/webinars/curateai-demo': '/pages/Resources/webinars/curateai-demo.html',
  '/resources/webinars/building-resilient-cloud-infrastructure-sre': '/pages/Resources/webinars/building-resilient-cloud-infrastructure-sre.html',
  '/resources/webinars/end-to-end-api-testing-apac-emea': '/pages/Resources/webinars/end-to-end-api-testing-apac-emea.html',
  '/resources/news/national-technology-day-2024': '/pages/Resources/news/national-technology-day-2024.html',
  '/resources/news/revolutionizing-it-vectors-vision': '/pages/Resources/news/revolutionizing-it-vectors-vision.html',
  '/resources/news/parkar-digital-vector-2-launch': '/pages/Resources/news/parkar-digital-vector-2-launch.html',
  '/company/about': '/pages/Company/About.html',
  '/company/our-journey': '/pages/Company/OurJourney.html',
  '/company/awards': '/pages/Company/AwardsRecognitions.html',
  '/company/partners': '/pages/Company/Partners.html',
  '/company/leadership': '/pages/Company/Leadership.html',
  '/careers/life-at-parkar': '/pages/Careers/LifeAtParkar.html',
  '/careers/open-positions': '/pages/Careers/OpenPositions.html',
  '/careers/team-highlights': '/pages/Careers/TeamHighlights.html',
  '/careers/team-highlights/satyen': '/pages/Careers/TeamHighlights/Satyen.html',
  '/legal/privacy': '/pages/FooterPages/PrivacyPolicy.html',
  '/legal/terms': '/pages/FooterPages/TermsOfUse.html',
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
