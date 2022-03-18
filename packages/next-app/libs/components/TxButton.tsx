import { FC, MouseEventHandler } from "react";
import { css } from "@emotion/react";
import { signIn, useSession } from "next-auth/react";
import { AuthProvider } from "@/types";

const TxButton: FC<{
	authProvider: AuthProvider;
	CENNZnetAddress: string;
	sendTx: MouseEventHandler<HTMLDivElement>;
}> = ({ authProvider, CENNZnetAddress, sendTx }) => {
	const { data: session } = useSession();

	if (session?.validAccount) {
		if (CENNZnetAddress)
			return (
				<div css={styles.button(authProvider)} onClick={sendTx}>
					<p>link account</p>
				</div>
			);

		return (
			<div css={styles.button(authProvider, true)}>
				<p>PLEASE ENTER A CENNZnet ADDRESS</p>
			</div>
		);
	}

	return (
		<div
			css={styles.button(authProvider)}
			onClick={async () => await signIn(authProvider)}
		>
			<p>please sign in with a valid {authProvider} account</p>
		</div>
	);
};

export default TxButton;

export const styles = {
	button:
		(authProvider: string, cennznet?: boolean) =>
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
					text-transform: ${cennznet ? "none" : "uppercase"};
					@media (max-width: 500px) {
						font-size: 10px;
					}
				}
			`,
};
