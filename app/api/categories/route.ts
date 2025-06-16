import { NextResponse } from 'next/server';
import { logger } from '../../../lib/logger';
import { AudioService } from '@/services/audio.svc';

const audioService = new AudioService();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all audio categories
 *     description: Retrieves a list of all available audio categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
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