import { FC, useState } from "react";
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
import useLocalStorage from "@/libs/hooks/useLocalStorage";

const Home: FC = () => {
	const { data: session } = useSession();
	const [authProvider] = useLocalStorage<AuthProvider>(
		"authProvider",
		!!session
	);
	const [modalOpen, setModalOpen] = useState<boolean>();
	const [modalStatus, setModalStatus] = useState<ModalStatus>();

	return (
		<div css={styles.root(authProvider, !!session)}>
			<div css={styles.container}>
				<GlobalModal
					isOpen={modalOpen}
					modalStatus={modalStatus}
					setIsOpen={setModalOpen}
				/>
				<div css={styles.auth}>
					<DiscordButton />
					<TwitterButton />
				</div>

				<IdentityDetails />

				<TxButton setModalOpen={setModalOpen} setModalStatus={setModalStatus} />
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

				@media (max-width: 500px) {
					width: 20em;
				}
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
