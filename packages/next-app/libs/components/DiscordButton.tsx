import { FC, useCallback, useMemo } from "react";
import Image from "next/image";
import { css } from "@emotion/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { DISCORD } from "@/libs/assets";

const DiscordButton: FC<{ switchProvider: Function }> = ({
	switchProvider,
}) => {
	const { data: session } = useSession();
	const activeSession = session?.authProvider === "discord";

	const imageSrc = useMemo(
		() => (!!session?.user?.image ? session.user.image : DISCORD),
		[session]
	);

	const buttonClickHandler = useCallback(async () => {
		if (!!session) {
			switchProvider("discord");
			await signOut({ redirect: false });
		}
		if (!activeSession) await signIn("discord");
	}, [session, activeSession, switchProvider]);

	const avatarLoader = ({ src, width }) => {
		return `${src}?w=${width}`;
	};

	return (
		<button css={styles.buttonContainer(!!session)}>
			<div css={styles.authButton} onClick={buttonClickHandler}>
				<Image
					loader={!!imageSrc ? avatarLoader : null}
					src={imageSrc}
					alt="discord-avatar"
					width={20}
					height={20}
					css={styles.logo}
				/>
				{activeSession && <p>{session.user.name}</p>}
				<b>{activeSession ? "sign out" : "sign in"}</b>
			</div>
		</button>
	);
};

export default DiscordButton;

export const styles = {
	buttonContainer:
		(session: boolean) =>
		({ palette }) =>
			css`
				cursor: pointer;
				display: flex;
				width: ${session ? "auto" : "120px"};
				border-radius: 4px;
				margin: 1.5em;
				background-color: ${palette.primary.discord};
				border: transparent;
				box-shadow: 4px 8px 8px rgb(17 48 255 / 10%);
				@media (max-width: 500px) {
					margin: 0;
				}
			`,
	authButton: css`
		border-radius: 4px;
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
		filter: drop-shadow(2px 2px rgba(0, 0, 0, 0.15));
	`,
};
