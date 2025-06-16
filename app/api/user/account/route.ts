import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { processEncryptedPasswords } from '@/lib/password-utils';
import { SettingsService } from '@/services/settings.svc';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/user/account:
 *   delete:
 *     summary: Delete user account
 *     description: Permanently deletes the authenticated user's account
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
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Current password for verification
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account deleted successfully
 *       400:
 *         description: Bad request - Missing password
 *       401:
 *         description: Unauthorized - Invalid password or user not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
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
    
    const encryptedData = await req.json();
    const requestData = processEncryptedPasswords(encryptedData);
    const { password } = requestData;
    
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