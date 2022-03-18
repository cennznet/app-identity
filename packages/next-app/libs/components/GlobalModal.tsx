import { FC, useCallback, useEffect } from "react";
import { css } from "@emotion/react";
import { CircularProgress, SelectChangeEvent } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { ModalStatus } from "@/libs/types";
import { AccountSelect } from "@/libs/components";
import { useCENNZWallet } from "@/libs/providers/CENNZWalletProvider";
import { useCENNZExtension } from "@/libs/providers/CENNZExtensionProvider";

const GlobalModal: FC<{
	isOpen: boolean;
	modalStatus: ModalStatus;
	setIsOpen: Function;
}> = ({ isOpen, modalStatus, setIsOpen }) => {
	const { selectAccount, selectedAccount, wallet, connectWallet } =
		useCENNZWallet();
	const { accounts } = useCENNZExtension();

	useEffect(() => {
		if (!wallet) (async () => await connectWallet())();
	}, [wallet, connectWallet]);

	const onAccountChange = async (event: SelectChangeEvent) => {
		const value = event.target.value;
		selectAccount(value);
	};

	const closeModal = useCallback(() => {
		if (!selectedAccount) selectAccount(accounts[0].meta.name);
		setIsOpen(false);
	}, [accounts, selectAccount, selectedAccount, setIsOpen]);

	return (
		<div css={styles.root(isOpen)}>
			{!!modalStatus && (
				<div css={styles.contentContainer}>
					{modalStatus.status === "in-progress" && (
						<CircularProgress css={styles.status} size="3em" />
					)}
					{modalStatus.status === "success" && (
						<CheckCircleOutlinedIcon
							css={[styles.status, styles.statusSuccess]}
						/>
					)}
					{modalStatus.status === "fail" && (
						<ErrorOutlineOutlinedIcon
							css={[styles.status, styles.statusFail]}
						/>
					)}
					{modalStatus.status === "connect-wallet" && (
						<AccountSelect
							selectedAccount={selectedAccount}
							onAccountChange={onAccountChange}
						/>
					)}

					<div css={styles.title}>
						{modalStatus.status === "in-progress" &&
							"Connection Is In Progress"}
						{modalStatus.status === "success" && "Connection Tx Completed"}
						{modalStatus.status === "fail" && "Connection Tx Failed"}
					</div>
					<div css={styles.message}>{modalStatus.message}</div>
					{modalStatus.status !== "in-progress" && (
						<button css={styles.button} onClick={closeModal}>
							Dismiss
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default GlobalModal;

const styles = {
	root: (show: boolean) =>
		css`
			position: absolute;
			inset: 1px;
			background-color: rgba(255, 255, 255, 0.9);
			z-index: 100;
			opacity: ${show ? 1 : 0};
			pointer-events: ${show ? "all" : "none"};
			transition: opacity 250ms;
			display: flex;
			align-items: center;
			justify-content: center;
			backdrop-filter: blur(2px);
			padding: 5em;
			text-align: center;
			box-sizing: border-box;
			font-size: 14px;
			margin: 0 auto;
		`,
	status: css`
		margin-bottom: 1.5em;
	`,
	statusSuccess: css`
		width: 4em;
		height: 4em;
		font-size: 14px;
		color: green;
	`,
	statusFail: css`
		width: 4em;
		height: 4em;
		font-size: 14px;
		color: red;
	`,
	contentContainer: css`
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	`,
	title: ({ palette }) => css`
		font-weight: bold;
		font-size: 20px;
		line-height: 1;
		text-align: center;
		text-transform: uppercase;
		color: ${palette.primary.main};
	`,
	message: css`
		margin-top: 1em;
		line-height: 1.5;
		pre {
			font-weight: bold;
		}
	`,
	button: ({ palette }) => css`
		margin-top: 2em;
		text-align: center;
		border-radius: 4px;
		border: transparent;
		background-color: ${palette.primary.main};
		color: white;
		letter-spacing: 0.5px;
		justify-content: center;
		align-items: center;
		height: 40px;
		width: 100px;
		cursor: pointer;
		display: flex;
		font-weight: bold;
	`,
};
