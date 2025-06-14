import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { logger } from '../../../../lib/logger';
import { writeFile } from 'fs/promises';
import path from 'path';
import { AudioService } from '@/services/audio.svc';

const audioService = new AudioService();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    let files = formData.getAll('files') as File[];
    if (files.length === 0) {
      const singleFile = formData.get('file') as File;
      if (singleFile) files = [singleFile];
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No file(s) provided' },
        { status: 400 }
      );
    }

    const descriptions: string[] = [];
    const categoryIds: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const description = formData.get(`descriptions[${i}]`) as string;
      descriptions.push(description || '');
      
      const categoryId = formData.get(`categoryIds[${i}]`) as string;
      if (!categoryId) {
        const singleCategoryId = formData.get('categoryId') as string;
        if (!singleCategoryId) {
          return NextResponse.json(
            { error: `Category is required for file: ${files[i].name}` },
            { status: 400 }
          );
        }
        categoryIds.push(singleCategoryId);
      } else {
        categoryIds.push(categoryId);
      }
    }

    const uploadDir = await audioService.ensureUploadDirectory();

    const uploadedFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const description = descriptions[i];
      const categoryId = categoryIds[i];

      const uniqueFileName = audioService.generateUniqueFileName(
        file.name,
        (session.user.id)
      );
      const filePath = path.join(uploadDir, uniqueFileName);
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      const audioFile = await audioService.uploadAudioFile({
        accountId: (session.user.id),
        categoryId: (categoryId),
        fileName: file.name,
        filePath,
        description: description || undefined,
        mimeType: file.type,
        sizeBytes: file.size
      });
      
      uploadedFiles.push({
        id: audioFile.id,
        fileName: audioFile.fileName,
        description: audioFile.description,
        category: audioFile.category,
        sizeBytes: audioFile.sizeBytes,
        uploadedAt: audioFile.uploadedAt
      });
    }

    return NextResponse.json({
      message: 'Audio file(s) uploaded successfully',
      audioFiles: uploadedFiles
    }, { status: 201 });

  } catch (error) {
    logger.error({
      msg: 'Error in POST /api/audio/upload',
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 