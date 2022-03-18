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
		<div css={styles.root(authProvider, !!session)}>
			<div css={styles.container}>
				<GlobalModal
					isOpen={modalOpen}
					modalStatus={modalStatus}
					setIsOpen={setModalOpen}
				/>
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
		</div>
	);
};

export default Home;

const styles = {
	root:
		(authProvider: string, session: boolean) =>
		({ palette, shadows }) =>
			css`
				margin: 2em auto;
				border: 1.5px solid
					${session ? palette.primary[authProvider] : palette.primary.main};
				border-radius: 4px;
				width: 40em;
				box-shadow: ${shadows[1]};
			`,
	container: css`
		width: 100%;
		margin: 0 auto;
		position: relative;
	`,
	auth: css`
		width: 100%;
		display: inline-flex;
		justify-content: space-between;
	`,
};
