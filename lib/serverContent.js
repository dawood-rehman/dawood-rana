import PortfolioContent from '@/models/PortfolioContent';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { DEFAULT_DATA } from '@/lib/storage';

export async function getPortfolioContent() {
  if (!isMongoConfigured()) {
    return { ...DEFAULT_DATA };
  }

  try {
    await connectToDatabase();
    const content = await PortfolioContent.findOne({ singleton: 'main' })
      .select('-resume.data')
      .lean();

    if (!content) {
      return { ...DEFAULT_DATA };
    }

    const { _id, singleton, createdAt, updatedAt, ...data } = content;
    return {
      ...DEFAULT_DATA,
      ...data,
      personalInfo: {
        ...DEFAULT_DATA.personalInfo,
        ...(data.personalInfo || {}),
        ctaPrimary: {
          ...DEFAULT_DATA.personalInfo.ctaPrimary,
          ...(data.personalInfo?.ctaPrimary || {}),
        },
        ctaSecondary: {
          ...DEFAULT_DATA.personalInfo.ctaSecondary,
          ...(data.personalInfo?.ctaSecondary || {}),
        },
      },
      sectionHeadings: {
        ...DEFAULT_DATA.sectionHeadings,
        ...(data.sectionHeadings || {}),
      },
      navbarConfig: {
        ...DEFAULT_DATA.navbarConfig,
        ...(data.navbarConfig || {}),
        navItems:
          data.navbarConfig?.navItems && data.navbarConfig.navItems.length > 0
            ? data.navbarConfig.navItems
            : DEFAULT_DATA.navbarConfig.navItems,
        ctaButton: {
          ...DEFAULT_DATA.navbarConfig.ctaButton,
          ...(data.navbarConfig?.ctaButton || {}),
        },
      },
      footerConfig: {
        ...DEFAULT_DATA.footerConfig,
        ...(data.footerConfig || {}),
        legalLinks: data.footerConfig?.legalLinks ?? DEFAULT_DATA.footerConfig.legalLinks,
      },
      seoConfig: {
        ...DEFAULT_DATA.seoConfig,
        ...(data.seoConfig || {}),
      },
      sectionsConfig:
        data.sectionsConfig && data.sectionsConfig.length > 0
          ? data.sectionsConfig
          : DEFAULT_DATA.sectionsConfig,
      particleConfig: {
        ...DEFAULT_DATA.particleConfig,
        ...(data.particleConfig || {}),
      },
      soundConfig: {
        ...DEFAULT_DATA.soundConfig,
        ...(data.soundConfig || {}),
      },
      analyticsConfig: {
        ...DEFAULT_DATA.analyticsConfig,
        ...(data.analyticsConfig || {}),
      },
    };
  } catch (error) {
    console.error('Failed to retrieve portfolio content from database:', error.message);
    return { ...DEFAULT_DATA };
  }
}
