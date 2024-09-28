import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.echosync.ai";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Company Email",
          type: "email",
          placeholder: "company@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const response = await fetch(`${apiUrl}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              isGoogleUser: false,
            }),
          });

          const data = await response.json();

          if (response.ok && data.user) {
            return { ...data.user, token: data.token };
          } else {
            throw new Error(data.message || "Authentication failed");
          }
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Authentication failed. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const isNewUser = await checkIfNewUser(profile?.email);
          user.isNewUser = isNewUser;

          if (isNewUser) {
            const payload = {
              email: profile.email,
              password: "",
              agreeToPolicy: true,
              isGoogleUser: true,
            };

            try {
              const response = await fetch(
                "https://api.echosync.ai/users/register",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                },
              );

              const result = await response.json();

              console.log(result, "Registration Result");
            } catch (error) {
              console.log("An error occurred. Please try again.");
            }

            user.googleProfile = {
              email: profile?.email,
              name: profile?.name,
            };
            user.needsBusinessInfo = true;
            user.googleBusinessProfileConnected = false;
          } else {
            const existingUser = await fetchExistingUser(profile?.email);
            console.log("Existing user:", existingUser);
            user.googleBusinessProfileConnected =
              existingUser?.googleBusinessProfile;
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return "/auth/error?error=SignInCallbackError";
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.user = user;
        token.accessToken = account?.access_token || user.token;
        token.googleProfile = user.googleProfile;
        token.needsBusinessInfo = user.needsBusinessInfo;
        token.isNewUser = user.isNewUser;
        token.googleBusinessProfileConnected =
          user.googleBusinessProfileConnected;
        token.needsBusinessInfo = user.isNewUser ? true : false;
      }

      // if (token.isNewUser && token.needsBusinessInfo) {
      //   token.redirectUrl = "/business-info";
      // } else if (!token.googleBusinessProfileConnected) {
      //   token.redirectUrl = "/connect-google-business";
      // } else {
      //   token.redirectUrl = "/dashboard";
      // }

      console.log("JWT token:", token);

      return token;
    },

    async session({ session, token }) {
      console.log("Session token:", token);
      let status = "";
      let latestUser = token.user;
      try {
        const res = await fetchStatus(token.user.email);
        status = res.status;
        latestUser = res.user;
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
      return {
        ...session,
        user: {
          ...session.user,
          ...token.user,
          accessToken: token.accessToken,
          googleProfile: token.googleProfile,
          needsBusinessInfo: token.needsBusinessInfo,
          date: new Date(),
          status: status,
          ...latestUser,
        },
        redirectUrl: token.redirectUrl,
      };
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  events: {
    async signIn(message) {
      if (message.user.email) {
        // You can add any additional logic here that needs to run on successful sign in
        console.log(`User signed in: ${message.user.email}`);
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
};

async function fetchExistingUser(email: string | null | undefined) {
  console.log("Fetching existing user:", email);
  if (!email) return null;

  try {
    // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.echosync.ai";
    const response = await fetch(`${apiUrl}/users/get-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log("Existing user data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching existing user:", error);
    return null;
  }
}
async function fetchStatus(email: string | null | undefined) {
  console.log("Fetching Status user:", email);
  if (!email) return null;

  try {
    // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.echosync.ai";
    const response = await fetch(`https://api.echosync.ai/users/user-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log("Status:", data);
    return data;
  } catch (error) {
    console.error("Error fetching Status user:", error);
    return null;
  }
}

// This function should be implemented to check if the user exists in your database
async function checkIfNewUser(
  email: string | null | undefined,
): Promise<boolean> {
  console.log("Checking if user exists:", email);
  if (!email) return true;

  try {
    // const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.echosync.ai";
    const response = await fetch(`${apiUrl}/users/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log("User existence data:", data);
    return data.isNewUser;
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false; // Assume existing user in case of error
  }
}

export async function connectGoogleBusiness() {
  const response = await fetch(`${apiUrl}/reviews/connect-google-business`);

  const result = await response.json();
  return result;
}
