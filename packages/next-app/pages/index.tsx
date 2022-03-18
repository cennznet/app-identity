import { FC, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { useSession } from "next-auth/react";
import {
	DiscordButton,
	IdentityDetails,
	TwitterButton,
	TxButton,
} from "@/libs/components";
import { AuthProvider, ModalStatus } from "@/libs/types";
import GlobalModal from "@/libs/components/GlobalModal";
import { useCENNZWallet } from "@/libs/providers/CENNZWalletProvider";

const Home: FC = () => {
	const { data: session } = useSession();
	const { selectedAccount } = useCENNZWallet();
	const [authProvider, setAuthProvider] = useState<AuthProvider>();
	const [modalOpen, setModalOpen] = useState<boolean>();
	const [modalStatus, setModalStatus] = useState<ModalStatus>();

	useEffect(() => {
		if (!session) return setAuthProvider("discord");

		session.user.name.includes("@")
			? setAuthProvider("twitter")
			: setAuthProvider("discord");
	}, [session]);

	return (
		<>
			{modalOpen && (
				<GlobalModal
					isOpen={modalOpen}
					modalStatus={modalStatus}
					setIsOpen={setModalOpen}
				/>
			)}
			<div css={styles.root(authProvider, !!session, !!selectedAccount)}>
				<div css={styles.auth}>
					<DiscordButton switchProvider={setAuthProvider} />
					<TwitterButton switchProvider={setAuthProvider} />
				</div>

				<IdentityDetails />

				<TxButton
					authProvider={authProvider}
					CENNZnetAddress={selectedAccount?.address}
					sendTx={() => alert("linking account")}
					setModalOpen={setModalOpen}
					setModalStatus={setModalStatus}
				/>
				<br />
			</div>
		</>
	);
};

export default Home;

const styles = {
	root:
		(authProvider: string, session: boolean, selectedAccount: boolean) =>
		({ palette, shadows }) =>
			css`
				margin: 2em auto;
				border: 1.5px solid
					${session ? palette.primary[authProvider] : palette.primary.main};
				border-radius: 4px;
				width: 50%;
				box-shadow: ${shadows[1]};
				height: ${selectedAccount && session ? "23em" : "21.5em"};
			`,
	auth: css`
		width: 100%;
		display: inline-flex;
		justify-content: space-between;
	`,
};
