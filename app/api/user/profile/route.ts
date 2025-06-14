import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { SettingsService } from '@/services/settings.svc';

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from session
    const userId = (session.user as any).id;
    
    if (!userId) {
      return NextResponse.json({ message: 'Invalid user session' }, { status: 401 });
    }
    
    const settingsService = new SettingsService();
    
    try {
      const profile = await settingsService.getUserProfile(userId);
      return NextResponse.json(profile);
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    logger.error({
      msg: 'Error fetching user profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from session
    const userId = (session.user as any).id;
    
    if (!userId) {
      return NextResponse.json({ message: 'Invalid user session' }, { status: 401 });
    }
    
    const { firstName, lastName } = await req.json();
    
    const settingsService = new SettingsService();
    
    try {
      await settingsService.updateUserProfile(userId, { firstName, lastName });
      return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    logger.error({
      msg: 'Error updating user profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 