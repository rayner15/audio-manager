import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../../../lib/services/user.svc';
import { logger } from '../../../lib/logger';

const userService = new UserService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, firstName, lastName } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    const user = await userService.registerUser({ 
      username, 
      email, 
      password,
      firstName,
      lastName
    });

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    }, { status: 201 });

  } catch (error) {
    logger.error({
      msg: 'Error in POST /api/register',
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