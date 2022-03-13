import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
import { NEXTAUTH_SECRET, TWITTER_ID, TWITTER_SECRET } from "@/libs/constants";

export default NextAuth({
	secret: NEXTAUTH_SECRET,
	providers: [
		Twitter({
			clientId: TWITTER_ID,
			clientSecret: TWITTER_SECRET,
			version: "2.0",
			userinfo: {
				url: "https://api.twitter.com/2/users/me",
				params: { "user.fields": ["created_at", "public_metrics"] },
			},
		}),
	],
});
