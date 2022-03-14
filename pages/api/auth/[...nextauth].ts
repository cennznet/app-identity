import NextAuth from "next-auth";
import store from "store";
import Twitter from "next-auth/providers/twitter";
import DiscordProvider from "next-auth/providers/discord";
import {
	DISCORD_ID,
	DISCORD_SECRET,
	NEXTAUTH_SECRET,
	TWITTER_ID,
	TWITTER_SECRET,
} from "@/libs/constants";

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
			profile({ data }) {
				store.set("auth-provider", "twitter");

				return {
					id: data.id,
					name: data.username,
				};
			},
		}),
		DiscordProvider({
			clientId: DISCORD_ID,
			clientSecret: DISCORD_SECRET,
			profile(profile) {
				store.set("auth-provider", "discord");

				if (!!profile.avatar) {
					const format = profile.avatar.startsWith("a_") ? "gif" : "png";
					profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
				} else {
					profile.image_url = "images/discord.svg";
				}

				return {
					id: profile.id,
					name: `${profile.username}#${profile.discriminator}`,
					image: profile.image_url,
				};
			},
		}),
	],
	callbacks: {
		async session({ session }) {
			session.authProvider = store.get("auth-provider");

			return session;
		},
	},
});
