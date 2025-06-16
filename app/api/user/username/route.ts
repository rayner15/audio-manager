import { authOptions } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { processEncryptedPasswords } from '@/lib/password-utils';
import { SettingsService } from '@/services/settings.svc';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/user/username:
 *   put:
 *     summary: Update username
 *     description: Updates the authenticated user's username
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
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: New username to set
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Current password for verification
 *     responses:
 *       200:
 *         description: Username updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username updated successfully
 *       400:
 *         description: Bad request - Missing username or password
 *       401:
 *         description: Unauthorized - Invalid password or user not authenticated
 *       404:
 *         description: User not found
 *       409:
 *         description: Conflict - Username is already taken
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
    
    const encryptedData = await req.json();
    const requestData = processEncryptedPasswords(encryptedData);
    const { username, password } = requestData;
    
    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }
    
    const settingsService = new SettingsService();
    
    try {
      await settingsService.updateUsername(userId, username, password);
      return NextResponse.json({ message: 'Username updated successfully' });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid password') {
        return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
      }
      if (error instanceof Error && error.message === 'Username is already taken') {
        return NextResponse.json({ message: 'Username is already taken' }, { status: 409 });
      }
      if (error instanceof Error && error.message === 'User not found') {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating username:', error);
    logger.error({
      msg: 'Error updating username',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 