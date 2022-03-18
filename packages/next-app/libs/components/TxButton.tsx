import { FC, MouseEventHandler } from "react";
import { css } from "@emotion/react";
import { useSession } from "next-auth/react";
import { AuthProvider } from "@/libs/types";
import { useCENNZWallet } from "@/libs/providers/CENNZWalletProvider";

const TxButton: FC<{
	authProvider: AuthProvider;
	CENNZnetAddress: string;
	sendTx: MouseEventHandler<HTMLDivElement>;
	setModalOpen: Function;
	setModalStatus: Function;
}> = ({ authProvider, sendTx, setModalOpen, setModalStatus }) => {
	const { data: session } = useSession();
	const { selectedAccount } = useCENNZWallet();

	const selectCENNZAccount = () => {
		setModalStatus({ status: "connect-wallet", message: "" });
		setModalOpen(true);
	};

	if (session?.validAccount) {
		if (selectedAccount)
			return (
				<div>
					<div css={styles.button(authProvider)} onClick={sendTx}>
						<p>
							link {authProvider} with `{selectedAccount.meta.name}`
						</p>
					</div>
					<div css={styles.changeAccount}>
						<span onClick={selectCENNZAccount}>Switch CENNZnet Account</span>
					</div>
				</div>
			);

		return (
			<>
				<div
					css={styles.button(authProvider, true)}
					onClick={selectCENNZAccount}
				>
					<p>CONNECT CENNZnet WALLET</p>
				</div>
			</>
		);
	}

	return (
		<div css={styles.notButton}>
			<p>PLEASE SIGN IN WITH A VALID ACCOUNT</p>
		</div>
	);
};

export default TxButton;

export const styles = {
	button:
		(authProvider?: string, cennznet?: boolean) =>
		({ palette }) =>
			css`
				cursor: ${!!authProvider ? "pointer" : "initial"};
				width: 90%;
				height: 40px;
				margin: 1em auto;
				text-align: center;
				border-radius: 5px;
				background-color: ${cennznet
					? palette.primary.main
					: palette.primary[authProvider]};
				color: white;
				letter-spacing: 0.5px;
				justify-content: center;
				align-items: center;
				display: flex;
				font-weight: bold;
				text-shadow: 2px 2px rgba(0, 0, 0, 0.15);

				p {
					font-size: 14px;
					text-transform: ${cennznet ? "none" : "uppercase"};
					@media (max-width: 500px) {
						font-size: 10px;
					}
				}

				&:hover {
					background-color: white;
					border: 1px solid
						${cennznet ? palette.primary.main : palette.primary[authProvider]};
					color: ${cennznet
						? palette.primary.main
						: palette.primary[authProvider]};
					transition-duration: 0.3s;
					text-shadow: none;
				}
			`,
	notButton: ({ palette }) => css`
		cursor: not-allowed;
		width: 90%;
		height: 40px;
		margin: 1em auto;
		text-align: center;
		border-radius: 5px;
		background-color: ${palette.primary.main};
		color: white;
		letter-spacing: 0.5px;
		justify-content: center;
		align-items: center;
		display: flex;
		font-weight: bold;
		text-shadow: 2px 2px rgba(0, 0, 0, 0.15);

		p {
			font-size: 14px;
			@media (max-width: 500px) {
				font-size: 10px;
			}
		}
	`,
	changeAccount: ({ palette }) => css`
		margin: 0 auto;
		width: auto;
		font-size: 14px;
		text-align: center;

		span {
			cursor: pointer;
			font-style: italic;
			text-decoration: underline;
			color: ${palette.text.secondary};
		}
	`,
};
