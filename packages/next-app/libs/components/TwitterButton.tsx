import { FC, useCallback, useState } from "react";
import Image from "next/image";
import { css } from "@emotion/react";
import { signOut, useSession } from "next-auth/react";
import { TWITTER } from "@/libs/assets";
import useLocalStorage from "@/libs/hooks/useLocalStorage";
import NewWindow from "react-new-window";

const TwitterButton: FC<{ switchProvider: Function }> = ({
	switchProvider,
}) => {
	const { data: session } = useSession();
	const [popup, setPopup] = useState<boolean>(false);
	const [authProvider, setAuthProvider] = useLocalStorage("authProvider", "");
	const activeSession = session?.authProvider === "twitter";

	const buttonClickHandler = useCallback(async () => {
		if (!!session) {
			switchProvider(authProvider);
			await signOut({ redirect: false });
		}
		if (!activeSession) {
			setAuthProvider("twitter");
			await setPopup(true);
		}
	}, [session, activeSession, switchProvider, authProvider, setAuthProvider]);

	return (
		<div>
			{popup && !session && (
				<NewWindow url="/sign-in" onUnload={() => setPopup(false)} />
			)}
			<button css={styles.buttonContainer(!!session)}>
				<div css={styles.authButton} onClick={buttonClickHandler}>
					<Image
						src={TWITTER}
						width={20}
						height={20}
						alt="twitter-logo"
						css={styles.logo}
					/>
					{activeSession && <p>{session.user.name}</p>}
					<b>{activeSession ? "sign out" : "sign in"}</b>
				</div>
			</button>
		</div>
	);
};

export default TwitterButton;

export const styles = {
	buttonContainer:
		(session: boolean) =>
		({ palette }) =>
			css`
				cursor: pointer;
				float: right;
				border-radius: 4px;
				display: flex;
				width: ${session ? "auto" : "120px"};
				box-sizing: border-box;
				margin: 1.5em;
				background-color: ${palette.primary.twitter};
				border: transparent;
				box-shadow: 4px 8px 8px rgb(17 48 255 / 10%);
			`,
	authButton: css`
		display: inline-flex;
		height: 3em;
		font-size: 12px;
		letter-spacing: 0.3px;
		padding: 1em 1em;
		margin: 0 auto;
		text-shadow: 2px 2px rgba(0, 0, 0, 0.15);
		color: white;
		align-items: center;

		p {
			margin-left: 0.5em;
			line-height: 125%;
		}

		b {
			margin-left: 0.5em;
			text-transform: uppercase;
			line-height: 125%;
		}
	`,
	logo: css`
		padding-left: 15px;
		margin-left: 50px;
		filter: drop-shadow(2px 2px rgba(0, 0, 0, 0.15));
	`,
};
