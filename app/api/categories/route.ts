import { NextResponse } from 'next/server';
import { AudioService } from '../../../lib/services/audio.svc';
import { logger } from '../../../lib/logger';

const audioService = new AudioService();

export async function GET() {
  try {
    const categories = await audioService.getCategories();

    return NextResponse.json({
      categories
    });

  } catch (error) {
    logger.error({
      msg: 'Error in GET /api/categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 