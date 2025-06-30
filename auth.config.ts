import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Lazy import to avoid database initialization at module load time
          const { getDb } = await import("./db");
          const { users } = await import("./db/schema");
          const { eq } = await import("drizzle-orm");
          const bcrypt = await import("bcrypt");

          const db = getDb();
          const user = await db
            .select()
            .from(users)
            .where(eq(users.username, credentials.username as string))
            .limit(1);

          if (user.length === 0) {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user[0].passwordHash
          );

          if (!isValid) {
            return null;
          }

          if (!user[0].isActive) {
            return null;
          }

          // Update last login timestamp
          try {
            await db
              .update(users)
              .set({ 
                lastLoginAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })
              .where(eq(users.id, user[0].id));
          } catch (updateError) {
            console.error("Failed to update last login:", updateError);
            // Continue with authentication even if last login update fails
          }

          return {
            id: user[0].id,
            username: user[0].username,
            isAdmin: user[0].isAdmin,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
        token.username = user.username;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig; 