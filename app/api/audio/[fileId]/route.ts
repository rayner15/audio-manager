import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import fs from 'fs/promises';
import { stat } from 'fs/promises';
import path from 'path';
import { AudioService } from '@/services/audio.svc';

/**
 * @swagger
 * /api/audio/{fileId}:
 *   get:
 *     summary: Get audio file
 *     description: Retrieve a specific audio file by ID. Add ?download=true query parameter to download the file.
 *     tags:
 *       - Audio
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the audio file to retrieve
 *       - in: query
 *         name: download
 *         schema:
 *           type: boolean
 *         description: Set to true to download the file with attachment header
 *     responses:
 *       200:
 *         description: Audio file streamed successfully
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           audio/wav:
 *             schema:
 *               type: string
 *               format: binary
 *           audio/mp4:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Audio file not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update audio file metadata
 *     description: Update the description or category of an audio file
 *     tags:
 *       - Audio
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the audio file to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: New description for the audio file
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 description: New category ID for the audio file
 *     responses:
 *       200:
 *         description: Audio file updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 description:
 *                   type: string
 *                 categoryId:
 *                   type: string
 *                   format: uuid
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Audio file not found or access denied
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete audio file
 *     description: Delete an audio file by ID
 *     tags:
 *       - Audio
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the audio file to delete
 *     responses:
 *       200:
 *         description: Audio file deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Audio file deleted successfully
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Audio file not found or access denied
 *       500:
 *         description: Internal server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const fileId = resolvedParams.fileId;
    
    const audioService = new AudioService();
    const audioFile = await audioService.getAudioFile(
      fileId,
      session.user.id
    );

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file not found' },
        { status: 404 }
      );
    }

    const isDownload = request.nextUrl.searchParams.get('download') === 'true';
    
    if (!isDownload) {
      try {
        const fileStat = await stat(audioFile.filePath);
        
        const fileBuffer = await fs.readFile(audioFile.filePath);
        
        const ext = path.extname(audioFile.fileName).toLowerCase();
        let contentType = 'audio/mpeg';
        
        if (ext === '.wav') {
          contentType = 'audio/wav';
        } else if (ext === '.m4a') {
          contentType = 'audio/mp4';
        }
        
        const response = new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Length': fileStat.size.toString(),
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-cache, no-store'
          }
        });
        
        return response;
      } catch (error) {
        console.error('Error serving audio file:', error);
        return NextResponse.json(
          { error: 'Error serving audio file' },
          { status: 500 }
        );
      }
    }
    
    try {
      const fileStat = await stat(audioFile.filePath);
      
      const fileBuffer = await fs.readFile(audioFile.filePath);
      
      const ext = path.extname(audioFile.fileName).toLowerCase();
      let contentType = 'audio/mpeg';
      
      if (ext === '.wav') {
        contentType = 'audio/wav';
      } else if (ext === '.m4a') {
        contentType = 'audio/mp4';
      }
      
      const response = new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': fileStat.size.toString(),
          'Content-Disposition': `attachment; filename="${audioFile.fileName}"`,
          'Cache-Control': 'no-cache, no-store'
        }
      });
      
      return response;
    } catch (error) {
      console.error('Error serving audio file for download:', error);
      return NextResponse.json(
        { error: 'Error serving audio file for download' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching audio file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const fileId = resolvedParams.fileId;

    const body = await request.json();
    const { description, categoryId } = body;

    const audioService = new AudioService();
    const updatedFile = await audioService.updateAudioFile(
      fileId,
      session.user.id,
      {
        description: description?.trim() || undefined,
        categoryId: categoryId || undefined
      }
    );

    if (!updatedFile) {
      return NextResponse.json(
        { error: 'Audio file not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error('Error updating audio file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const fileId = resolvedParams.fileId;

    const audioService = new AudioService();
    const success = await audioService.deleteAudioFile(
      fileId,
      session.user.id
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Audio file not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Audio file deleted successfully' });
  } catch (error) {
    console.error('Error deleting audio file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}