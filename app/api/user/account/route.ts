import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { SettingsService } from '@/services/settings.svc';

export async function DELETE(req: NextRequest) {
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
    
    const { password } = await req.json();
    
    // Validate input
    if (!password) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }
    
    const settingsService = new SettingsService();
    
    try {
      await settingsService.deleteUserAccount(userId, password);
      return NextResponse.json({ message: 'Account deleted successfully' });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid password') {
        return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
      }
      if (error instanceof Error && error.message === 'User not found') {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    logger.error({
      msg: 'Error deleting account',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 