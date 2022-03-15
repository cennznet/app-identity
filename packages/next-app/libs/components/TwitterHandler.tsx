import { FC, useCallback } from "react";
import { css } from "@emotion/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const TwitterHandler: FC = () => {
	const { data: session } = useSession();
	const activeSession = session?.authProvider === "twitter"

	const buttonClickHandler = useCallback(async () => {
		if (!!session) return await signOut({ redirect: false });
		await signIn("twitter");
	}, [session]);

	return (
			<button css={styles.buttonContainer(!!session)}>
					<div css={styles.authButton} onClick={buttonClickHandler}>
						<Image
							src={"/images/twitter.svg"}
							width={20}
							height={20}
							alt="twitter-logo"
							css={styles.logo}
						/>
						{activeSession && (<p>@{session.user.name}</p>)}
						<b>{activeSession ? "sign out" : "sign in"}</b>
					</div>
			</button>
	);
};

export default TwitterHandler;

export const styles = {
	buttonContainer: (session: boolean) => css`
		cursor: pointer;
		position: absolute;
		top: 4.5em;
		right: 1em;
		border-radius: 4px;
		display: flex;
		width: ${session ? "auto" : "120px"};
		box-sizing: border-box;
		margin: 1.5em;
		border: transparent;
		box-shadow: 4px 8px 8px rgb(17 48 255 / 10%);
		@media (max-width: 500px) {
			margin: 0;
		}
	`,
	authButton: css`
		display: inline-flex;
		height: 30px;
		font-size: 12px;
		letter-spacing: 0.3px;
		padding: 0.5em 0.5em;
		margin: 0 auto;

		p {
			margin: 0.15em 0.3em 0 1em;
			line-height: 125%;
		}

		b {
			margin: 0.15em 0 0 0.5em;
			text-transform: uppercase;
			line-height: 125%;
		}
	`,
	logo: css`
		padding-left: 15px;
		margin-left: 50px;
	`,
};
