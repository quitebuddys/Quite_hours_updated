import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { defaultContent, SiteContent } from '../../../lib/defaultContent';

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'content.json');

function ensureDataFile(): SiteContent {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(fileData);
      return { ...defaultContent, ...parsed };
    }
  } catch (err) {
    console.error('Error reading content file:', err);
  }
  return defaultContent;
}

export async function GET() {
  const content = ensureDataFile();
  return NextResponse.json(content, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const updatedContent: Partial<SiteContent> = await req.json();

    if (!updatedContent || typeof updatedContent !== 'object') {
      return NextResponse.json({ error: 'Invalid content payload' }, { status: 400 });
    }

    const currentContent = ensureDataFile();
    const mergedContent: SiteContent = {
      ...currentContent,
      ...updatedContent,
      brand: { ...currentContent.brand, ...(updatedContent.brand || {}) },
      hero: { ...currentContent.hero, ...(updatedContent.hero || {}) },
      experience: {
        ...currentContent.experience,
        ...(updatedContent.experience || {}),
        chapters: updatedContent.experience?.chapters || currentContent.experience.chapters,
      },
      ticker: { ...currentContent.ticker, ...(updatedContent.ticker || {}) },
      intro: { ...currentContent.intro, ...(updatedContent.intro || {}) },
      services: {
        ...currentContent.services,
        ...(updatedContent.services || {}),
        items: updatedContent.services?.items || currentContent.services.items,
      },
      process: {
        ...currentContent.process,
        ...(updatedContent.process || {}),
        steps: updatedContent.process?.steps || currentContent.process.steps,
      },
      pricing: {
        ...currentContent.pricing,
        ...(updatedContent.pricing || {}),
        plans: updatedContent.pricing?.plans || currentContent.pricing.plans,
      },
      contact: { ...currentContent.contact, ...(updatedContent.contact || {}) },
      footer: { ...currentContent.footer, ...(updatedContent.footer || {}) },
    };

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(mergedContent, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      data: mergedContent,
    });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    if (fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2), 'utf-8');
    }
    return NextResponse.json({
      success: true,
      message: 'Content reset to defaults',
      data: defaultContent,
    });
  } catch (error) {
    console.error('Error resetting content:', error);
    return NextResponse.json({ error: 'Failed to reset content' }, { status: 500 });
  }
}
