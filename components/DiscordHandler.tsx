import { FC, useEffect } from "react";
import { css } from "@emotion/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const DiscordHandler: FC = () => {
	const { data: session } = useSession();

	useEffect(() => {
		if (!session) return;

		console.log("session", session);
	}, [session]);

	const avatarLoader = ({ src, width }) => {
		return `${src}?w=${width}`;
	};

	return (
		<div>
			{session?.authProvider === "discord" && (
				<div css={styles.username}>
					<p>{session?.user?.name}</p>
				</div>
			)}
			<button css={styles.buttonContainer}>
				{session?.authProvider === "discord" ? (
					<div css={styles.authButton} onClick={async () => await signOut()}>
						{session?.user?.image ? (
							<Image
								loader={avatarLoader}
								src={session?.user?.image}
								alt="discord-avatar"
								width={20}
								height={20}
							/>
						) : (
							<Image
								src={"/images/discord.svg"}
								width={20}
								height={20}
								alt="discord-logo"
								css={styles.logo}
							/>
						)}
						<p>Sign out</p>
					</div>
				) : (
					<div
						css={styles.authButton}
						onClick={async () => await signIn("discord")}
					>
						<Image
							src={"/images/discord.svg"}
							width={20}
							height={20}
							alt="discord-logo"
							css={styles.logo}
						/>
						<p>Sign in</p>
					</div>
				)}
			</button>
		</div>
	);
};

export default DiscordHandler;

export const styles = {
	username: css`
		position: absolute;
		top: 40px;
		right: 150px;
		width: 120px;
		text-align: center;
		margin: 20px;
		@media (max-width: 500px) {
			margin: 0;
		}
		p {
			font-size: 14px;
			font-weight: bold;
			overflow: scroll;
		}
	`,
	buttonContainer: css`
		cursor: pointer;
		position: absolute;
		top: 15px;
		right: 150px;
		border-radius: 5px;
		display: flex;
		width: 120px;
		box-sizing: border-box;
		margin: 20px;
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
		padding: 5px 5px;
		margin: 0 auto;

		p {
			margin-left: 5px;
			margin-top: 2px;
			text-transform: uppercase;
			line-height: 125%;
			font-weight: bold;
		}
	`,
	logo: css`
		padding-left: 15px;
		margin-left: 50px;
	`,
};
