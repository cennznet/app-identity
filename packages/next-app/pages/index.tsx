import { FC, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { useSession } from "next-auth/react";
import {
	AccountInput,
	DiscordButton,
	TxButton,
	TwitterButton,
} from "@/libs/components";
import { AuthProvider } from "@/types";

const Home: FC = () => {
	const { data: session } = useSession();
	const [address, setAddress] = useState<string>();
	const [authProvider, setAuthProvider] = useState<AuthProvider>();

	useEffect(() => {
		if (!session) return setAuthProvider("discord");

		session.user.name.includes("@")
			? setAuthProvider("twitter")
			: setAuthProvider("discord");
	}, [session]);

	return (
		<div css={styles.root(authProvider, !!session)}>
			<div css={styles.auth}>
				<DiscordButton switchProvider={setAuthProvider} />
				<TwitterButton switchProvider={setAuthProvider} />
			</div>

			<div css={styles.input}>
				<p>Enter your CENNZnet Address:</p>
				<AccountInput setAddress={setAddress} address={address} />
			</div>

			<TxButton
				authProvider={authProvider}
				CENNZnetAddress={address}
				sendTx={() => alert("linking account")}
			/>
			<br />
		</div>
	);
};

export default Home;

const styles = {
	root:
		(authProvider: string, session: boolean) =>
		({ palette, shadows }) =>
			css`
				margin: 2em auto;
				border: 1.5px solid
					${session ? palette.primary[authProvider] : palette.primary.main};
				border-radius: 4px;
				width: 50%;
				box-shadow: ${shadows[1]};
			`,
	auth: css`
		width: 100%;
		display: inline-flex;
		justify-content: space-between;
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
