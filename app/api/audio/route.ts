import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { logger } from '../../../lib/logger';
import { AudioService } from '@/services/audio.svc';

const audioService = new AudioService();

/**
 * @swagger
 * /api/audio:
 *   get:
 *     summary: Get user's audio files
 *     description: Retrieves all audio files belonging to the authenticated user
 *     tags:
 *       - Audio
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of audio files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 audioFiles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                       filename:
 *                         type: string
 *                       fileSize:
 *                         type: number
 *                       duration:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized - User not authenticated
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const audioFiles = await audioService.getUserAudioFiles((session.user.id));

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