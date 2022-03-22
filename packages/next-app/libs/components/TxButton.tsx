import { FC, useCallback, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { useSession } from "next-auth/react";
import { blake2AsHex } from "@polkadot/util-crypto";
import { AuthProvider } from "@/libs/types";
import { useCENNZWallet } from "@/libs/providers/CENNZWalletProvider";
import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import useLocalStorage from "@/libs/hooks/useLocalStorage";

interface IdentityInfo {
	twitter?: string | { BlakeTwo256: string };
	riot?: string | { BlakeTwo256: string };
}

const TxButton: FC<{
	setModalOpen: Function;
	setModalStatus: Function;
}> = ({ setModalOpen, setModalStatus }) => {
	const { data: session } = useSession();
	const [authProvider] = useLocalStorage<AuthProvider>(
		"authProvider",
		!!session
	);
	const [extrinsic, setExtrinsic] =
		useState<SubmittableExtrinsic<"promise", any>>();
	const { api } = useCENNZApi();
	const { selectedAccount, wallet } = useCENNZWallet();
	const signer = wallet?.signer;

	const selectCENNZAccount = () => {
		setModalStatus({ status: "connect-wallet", message: "" });
		setModalOpen(true);
	};

	useEffect(() => {
		if (!api || !session?.user.name || !authProvider || !selectedAccount)
			return;

		(async () => {
			const identity = (
				await api.query.identity.identityOf(selectedAccount.address)
			).toHuman();

			let info: IdentityInfo = {};
			if (identity) info = (identity as any).info;
			let tx: SubmittableExtrinsic<"promise", any>;

			if (authProvider === "discord") {
				info.riot = { BlakeTwo256: blake2AsHex(session.user.name) };
			}

			if (authProvider === "twitter") {
				info.twitter = {
					BlakeTwo256: blake2AsHex(session.user.name.split("@")[1]),
				};
			}

			tx = api.tx.identity.setIdentity({ info });
			setExtrinsic(tx);
		})();
	}, [authProvider, api, session, setExtrinsic, selectedAccount]);

	const signAndSendTx = useCallback(async () => {
		if (!api || !selectedAccount || !signer || !extrinsic || !authProvider)
			return;

		return new Promise((resolve, reject) => {
			extrinsic
				.signAndSend(
					selectedAccount.address,
					{ signer },
					async ({ status, events }: any) => {
						setModalStatus({
							status: "in-progress",
							message:
								`Linking \`${selectedAccount.meta.name}\` with ${authProvider}`.toUpperCase(),
						});
						setModalOpen(true);
						if (status.isInBlock) {
							for (const {
								event: { method, section },
							} of events) {
								if (section === "system" && method === "ExtrinsicSuccess") {
									setModalStatus({
										status: "success",
										message:
											`Successfully linked \`${selectedAccount.meta.name}\` with ${authProvider}`.toUpperCase(),
									});
								}
							}
						}
					}
				)
				.catch((err) => {
					setModalStatus({ status: "fail", message: err.message });
					reject(err);
				});
		});
	}, [
		api,
		selectedAccount,
		signer,
		extrinsic,
		authProvider,
		setModalOpen,
		setModalStatus,
	]);

	if (selectedAccount) {
		if (session?.validAccount)
			return (
				<div>
					<div css={styles.button(authProvider)} onClick={signAndSendTx}>
						<p>
							link `{selectedAccount.meta.name}` with {authProvider}
						</p>
					</div>
					<div css={styles.changeAccount}>
						<span onClick={selectCENNZAccount}>Switch CENNZnet Account</span>
					</div>
				</div>
			);

		return (
			<div>
				<div css={styles.notButton}>
					<p>PLEASE SIGN IN WITH A VALID PROVIDER</p>
				</div>
				<div css={styles.changeAccount}>
					<span onClick={selectCENNZAccount}>
						Switch from `{selectedAccount.meta.name}`
					</span>
				</div>
			</div>
		);
	}

	return (
		<div css={styles.button(authProvider, true)} onClick={selectCENNZAccount}>
			<p>CONNECT CENNZnet WALLET</p>
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
