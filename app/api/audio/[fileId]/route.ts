import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import fs from 'fs/promises';
import { stat } from 'fs/promises';
import path from 'path';
import { AudioService } from '@/services/audio.svc';

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
    const fileId = parseInt(resolvedParams.fileId);
    if (isNaN(fileId)) {
      return NextResponse.json(
        { error: 'Invalid file ID' },
        { status: 400 }
      );
    }

    const audioService = new AudioService();
    const audioFile = await audioService.getAudioFile(
      fileId,
      parseInt(session.user.id)
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
    const fileId = parseInt(resolvedParams.fileId);
    if (isNaN(fileId)) {
      return NextResponse.json(
        { error: 'Invalid file ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { description, categoryId } = body;

    const audioService = new AudioService();
    const updatedFile = await audioService.updateAudioFile(
      fileId,
      parseInt(session.user.id),
      {
        description: description?.trim() || undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined
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
    const fileId = parseInt(resolvedParams.fileId);
    if (isNaN(fileId)) {
      return NextResponse.json(
        { error: 'Invalid file ID' },
        { status: 400 }
      );
    }

    const audioService = new AudioService();
    const success = await audioService.deleteAudioFile(
      fileId,
      parseInt(session.user.id)
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