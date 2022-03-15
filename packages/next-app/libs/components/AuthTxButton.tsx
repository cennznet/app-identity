import { FC, MouseEventHandler } from "react";
import { css } from "@emotion/react";
import { signIn, useSession } from "next-auth/react";
import { AuthProvider } from "@/types";

const AuthTxButton: FC<{
	authProvider: AuthProvider;
	CENNZnetAddress: string;
	sendTx: MouseEventHandler<HTMLDivElement>;
}> = ({ authProvider, CENNZnetAddress, sendTx }) => {
	const { data: session } = useSession();

	if (session?.validAccount) {
		if (CENNZnetAddress)
			return (
				<div css={styles.button(String(authProvider))} onClick={sendTx}>
					<p>link account</p>
				</div>
			);

		return (
			<div css={styles.button(String(authProvider))}>
				<p>PLEASE ENTER A CENNZnet ADDRESS</p>
			</div>
		);
	}

	return (
		<div
			css={styles.button(String(authProvider))}
			onClick={async () => await signIn(authProvider)}
		>
			<p>PLEASE SIGN IN WITH A VALID {authProvider} ACCOUNT</p>
		</div>
	);
};

export default AuthTxButton;

export const styles = {
	button:
		(authProvider: string) =>
		({ palette }) =>
			css`
				cursor: pointer;
				width: 90%;
				height: 40px;
				margin: 1em auto;
				text-align: center;
				border-radius: 5px;
				background-color: ${palette.primary[authProvider]};
				color: white;
				letter-spacing: 0.5px;
				justify-content: center;
				align-items: center;
				display: flex;
				font-weight: bold;
				p {
					font-size: 14px;
					text-transform: uppercase;
					@media (max-width: 500px) {
						font-size: 10px;
					}
				}
			`,
};
