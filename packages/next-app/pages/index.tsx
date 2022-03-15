import { FC, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { signOut, useSession } from "next-auth/react";
import { AccountInput, AuthTxButton, SignOut } from "@/libs/components";
import { AuthProvider } from "@/types";

const Discord: FC = () => {
	const { data: session } = useSession();
	const [address, setAddress] = useState<string>();
	const [authProvider, setAuthProvider] = useState<AuthProvider>();

	useEffect(() => {
		if (!session) return setAuthProvider("discord");

		session.user.name.includes("@")
			? setAuthProvider("twitter")
			: setAuthProvider("discord");
	}, [session]);

	const switchProvider = async (provider: AuthProvider) => {
		await signOut({ redirect: false });
		setAuthProvider(provider);
	};

	return (
		<div css={styles.root(authProvider)}>
			<div css={styles.discord}>
				<span onClick={() => switchProvider("discord")}>discord</span>
			</div>
			<div css={styles.twitter}>
				<span onClick={() => switchProvider("twitter")}>twitter</span>
			</div>

			<div css={styles.input}>
				<p>Enter your CENNZnet Address:</p>
				<AccountInput setAddress={setAddress} address={address} />
			</div>

			<AuthTxButton
				authProvider={authProvider}
				CENNZnetAddress={address}
				sendTx={() => alert("linking account")}
			/>
			{!!session && <SignOut handle={session.user.name} />}
			<br />
		</div>
	);
};

export default Discord;

const styles = {
	root:
		(authProvider: string) =>
		({ palette, shadows }) =>
			css`
				margin: 2em auto;
				border: 1.5px solid ${palette.primary[authProvider]};
				border-radius: 4px;
				width: 50%;
				box-shadow: ${shadows[1]};
			`,
	discord: ({ palette }) => css`
		margin-left: 1em;
		font-size: 20px;
		cursor: pointer;
		width: 80px;
		margin-top: 0.8em;

		span {
			color: ${palette.primary.discord};
			font-weight: bold;
			letter-spacing: 0.3px;
			line-height: 125%;
			text-transform: uppercase;
		}
	`,
	twitter: ({ palette }) => css`
		margin-right: 1em;
		font-size: 20px;
		float: right;
		cursor: pointer;
		margin-top: -1.25em;

		span {
			color: ${palette.primary.twitter};
			font-weight: bold;
			letter-spacing: 0.3px;
			line-height: 125%;
			text-transform: uppercase;
		}
	`,
	input: css`
		width: 90%;
		margin: 2em auto;
		padding-bottom: 1em;
		font-size: 18px;

		p {
			font-weight: bold;
			letter-spacing: 0.3px;
			line-height: 125%;
		}
	`,
};
