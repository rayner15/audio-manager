import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { logger } from '../../../lib/logger';
import { AudioService } from '@/services/audio.svc';

const audioService = new AudioService();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const audioFiles = await audioService.getUserAudioFiles(parseInt(session.user.id));

    return NextResponse.json({
      audioFiles
    });

  } catch (error) {
    logger.error({
      msg: 'Error in GET /api/audio',
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 