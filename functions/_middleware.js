/**
 * Cloudflare Pages Middleware
 * Intercepts all requests to /pages/* and redirects to clean URLs
 */

const PAGES_ROUTES = {
  '/pages/Contact': '/contact',
  '/pages/Platforms/AIONIQ': '/platforms/aioniq',
  '/pages/Vector/Overview': '/platforms/vector',
  '/pages/Vector/Platform': '/platforms/vector-platform',
  '/pages/Vector/Integration': '/platforms/vector-integrations',
  '/pages/Solutions/AgenticAI': '/solutions/agentic-ai',
  '/pages/Solutions/Applications': '/solutions/applications',
  '/pages/Solutions/Data': '/solutions/data',
  '/pages/Solutions/Cloud': '/solutions/cloud',
  '/pages/Solutions/case-studies/unlocking-growth-user-adoption': '/solutions/case-studies/unlocking-growth-user-adoption',
  '/pages/Solutions/case-studies/operational-excellence-cloud': '/solutions/case-studies/operational-excellence-cloud',
  '/pages/Solutions/case-studies/cost-efficiency-cloud': '/solutions/case-studies/cost-efficiency-cloud',
  '/pages/Solutions/case-studies/elevating-database-performance': '/solutions/case-studies/elevating-database-performance',
  '/pages/Solutions/case-studies/data-driven-bi': '/solutions/case-studies/data-driven-bi',
  '/pages/Solutions/case-studies/strategic-insight-cloud': '/solutions/case-studies/strategic-insight-cloud',
  '/pages/GCC/Overview': '/gcc/overview',
  '/pages/GCC/ManagedService': '/gcc/managed-service',
  '/pages/GCC/PayAsYouGo': '/gcc/pay-as-you-go',
  '/pages/GCC/BuildOperateTransfer': '/gcc/build-operate-transfer',
  '/pages/GCC/ThoughtLeadership': '/gcc/thought-leadership',
  '/pages/GCC/GccBlogs/BuildingForIntelligence': '/gcc/blogs/BuildingForIntelligence',
  '/pages/GCC/GccBlogs/WhyEnterpriseAIStruggles': '/gcc/blogs/WhyEnterpriseAIStruggles',
  '/pages/GCC/GccCaseStudies/GenAIStudio': '/gcc/case-studies/gen-ai-studio',
  '/pages/GCC/GccCaseStudies/RealTimeAIOps': '/gcc/case-studies/real-time-ai-ops',
  '/pages/Industries/FinancialServices': '/industries/financial-services',
  '/pages/Industries/Healthcare': '/industries/healthcare',
  '/pages/Industries/Manufacturing': '/industries/manufacturing',
  '/pages/Industries/Media': '/industries/media',
  '/pages/Resources/Insights': '/resources/insights',
  '/pages/Resources/ResourcesHub': '/resources/research',
  '/pages/Resources/CaseStudy': '/resources/case-studies',
  '/pages/Resources/Events': '/resources/events',
  '/pages/Resources/News': '/resources/news',
  '/pages/Resources/blogs/the-architecture-that-frees-your-data-engineering-team': '/resources/blogs/the-architecture-that-frees-your-data-engineering-team',
  '/pages/Resources/blogs/when-fraud-monitoring-becomes-manual-triage': '/resources/blogs/when-fraud-monitoring-becomes-manual-triage',
  '/pages/Resources/blogs/alert-fatigue-is-a-data-architecture-problem': '/resources/blogs/alert-fatigue-is-a-data-architecture-problem',
  '/pages/Resources/case-studies/predictive-maintenance': '/resources/case-studies/predictive-maintenance',
  '/pages/Resources/case-studies/stabilizing-global-it-operations': '/resources/case-studies/stabilizing-global-it-operations',
  '/pages/Resources/case-studies/unlocking-population-health-insights': '/resources/case-studies/unlocking-population-health-insights',
  '/pages/Resources/events/ta-leadership-retreat': '/resources/events/ta-leadership-retreat',
  '/pages/Resources/events/microsoft-mumbai-ai-tour-2025': '/resources/events/microsoft-mumbai-ai-tour-2025',
  '/pages/Resources/events/et-gcc-conclave-2025': '/resources/events/et-gcc-conclave-2025',
  '/pages/Resources/webinars/curateai-demo': '/resources/webinars/curateai-demo',
  '/pages/Resources/webinars/building-resilient-cloud-infrastructure-sre': '/resources/webinars/building-resilient-cloud-infrastructure-sre',
  '/pages/Resources/webinars/end-to-end-api-testing-apac-emea': '/resources/webinars/end-to-end-api-testing-apac-emea',
  '/pages/Resources/news/national-technology-day-2024': '/resources/news/national-technology-day-2024',
  '/pages/Resources/news/revolutionizing-it-vectors-vision': '/resources/news/revolutionizing-it-vectors-vision',
  '/pages/Resources/news/parkar-digital-vector-2-launch': '/resources/news/parkar-digital-vector-2-launch',
  '/pages/Company/About': '/company/about',
  '/pages/Company/OurJourney': '/company/our-journey',
  '/pages/Company/AwardsRecognitions': '/company/awards',
  '/pages/Company/Partners': '/company/partners',
  '/pages/Company/Leadership': '/company/leadership',
  '/pages/Careers/LifeAtParkar': '/careers/life-at-parkar',
  '/pages/Careers/OpenPositions': '/careers/open-positions',
  '/pages/Careers/TeamHighlights': '/careers/team-highlights',
  '/pages/Careers/TeamHighlights/Satyen': '/careers/team-highlights/satyen',
  '/pages/FooterPages/PrivacyPolicy': '/legal/privacy',
  '/pages/FooterPages/TermsOfUse': '/legal/terms',
};

export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Check if the path starts with /pages/
  if (url.pathname.startsWith('/pages/')) {
    // Remove .html extension if present
    const pathWithoutExt = url.pathname.replace(/\.html$/, '');
    
    // Look up the clean URL
    const cleanUrl = PAGES_ROUTES[pathWithoutExt];
    
    if (cleanUrl) {
      // Redirect to clean URL
      return Response.redirect(new URL(cleanUrl, url.origin).toString(), 301);
    }
  }
  
  // Continue to next middleware/handler
  return await context.next();
}
