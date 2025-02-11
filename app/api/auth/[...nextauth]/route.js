import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 5 * 60,
    },
    callbacks: {
        async session({ session, token }) {
            try {
                await connectToDB();
                const sessionUser = await User.findOne({ email: session.user.email });

                if (sessionUser) {
                    session.user.id = sessionUser._id.toString();
                }

                return session;
            } catch (error) {
                console.error("Error fetching session user:", error);
                return session;
            }
        },
        async signIn({ account, profile }) {
            try {
                await connectToDB();
                const userExists = await User.findOne({ email: profile.email });

                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.toLowerCase().replace(/\s+/g, ""),
                        image: profile.picture || profile.image,
                    });
                }
                return true;
            } catch (error) {
                console.error("Error during signIn:", error);
                return false;
            }
        },
    }
});

export { handler as GET, handler as POST };
