import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// NextAuth configuration.
// We use a Credentials provider that authenticates against DummyJSON's
// login API. The returned access token is stored in the NextAuth JWT/session
// and is also mirrored into our Zustand store (see components/AuthSync.js).
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "DummyJSON",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("https://dummyjson.com/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
            expiresInMins: 60,
          }),
        });

        const data = await res.json();

        // DummyJSON returns `accessToken` (older versions used `token`).
        const token = data.accessToken || data.token;
        if (res.ok && token) {
          return {
            id: String(data.id),
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            image: data.image,
            username: data.username,
            accessToken: token,
          };
        }
        // Returning null signals invalid credentials to NextAuth.
        return null;
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/login", // use our custom login page
  },

  callbacks: {
    // Persist extra fields onto the JWT right after sign-in.
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.username = user.username;
        token.picture = user.image;
      }
      return token;
    },
    // Expose those fields to the client via useSession().
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.username = token.username;
        session.user.image = token.picture;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
