import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { logger } from './logger';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          logger.warn({ msg: 'Login attempt with missing credentials' });
          return null;
        }

        try {
          const account = await prisma.account.findUnique({
            where: { username: credentials.username },
            include: { profile: true }
          });

          if (!account) {
            logger.warn({ 
              msg: 'Login attempt with non-existent username', 
              username: credentials.username 
            });
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            account.password_hash
          );

          if (!isPasswordValid) {
            logger.warn({ 
              msg: 'Login attempt with invalid password', 
              username: credentials.username,
              accountId: account.id
            });
            return null;
          }

          logger.info({ 
            msg: 'Successful login', 
            username: account.username,
            accountId: account.id
          });

          return {
            id: account.id.toString(),
            username: account.username,
            email: account.email,
            name: account.profile ? 
              `${account.profile.firstName || ''} ${account.profile.lastName || ''}`.trim() : 
              account.username
          };
        } catch (error) {
          logger.error({ 
            msg: 'Error during authentication', 
            error: error instanceof Error ? error.message : 'Unknown error',
            username: credentials.username
          });
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
          async jwt({ token, user }: { token: any; user?: any }) {
        if (user) {
          token.id = user.id;
          token.username = user.username;
        }
        return token;
      },
      async session({ session, token }: { session: any; token: any }) {
        if (token) {
          session.user.id = token.id as string;
          session.user.username = token.username as string;
        }
        return session;
      },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 