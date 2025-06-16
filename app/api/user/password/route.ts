import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { SettingsService } from '@/services/settings.svc';

/**
 * @swagger
 * /api/user/password:
 *   put:
 *     summary: Update password
 *     description: Updates the authenticated user's password
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Current password for verification
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password to set (must be at least 8 characters)
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       400:
 *         description: Bad request - Missing passwords or new password too short
 *       401:
 *         description: Unauthorized - Current password is incorrect or user not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
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
    
    const { currentPassword, newPassword } = await req.json();
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Current password and new password are required' }, { status: 400 });
    }
    
    const settingsService = new SettingsService();
    
    try {
      await settingsService.updatePassword(userId, currentPassword, newPassword);
      return NextResponse.json({ message: 'Password updated successfully' });
    } catch (error) {
      if (error instanceof Error && error.message === 'Current password is incorrect') {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
      }
      if (error instanceof Error && error.message === 'New password must be at least 8 characters long') {
        return NextResponse.json({ message: 'New password must be at least 8 characters long' }, { status: 400 });
      }
      if (error instanceof Error && error.message === 'User not found') {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating password:', error);
    logger.error({
      msg: 'Error updating password',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 