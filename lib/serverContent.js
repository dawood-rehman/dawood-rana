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
      personalInfo: { ...DEFAULT_DATA.personalInfo, ...(data.personalInfo || {}) },
    };
  } catch (error) {
    console.error('Failed to retrieve portfolio content from database:', error.message);
    return { ...DEFAULT_DATA };
  }
}
