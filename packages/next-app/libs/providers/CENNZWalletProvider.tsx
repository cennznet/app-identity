import { InjectedExtension, InjectedAccountWithMeta } from "@/libs/types";
import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import store from "store";
import { useCENNZExtension } from "@/libs/providers/CENNZExtensionProvider";
import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";

type WalletContext = {
	selectedAccount: InjectedAccountWithMeta;
	wallet: InjectedExtension;
	connectWallet: (callback?: () => void) => Promise<void>;
	disconnectWallet: () => void;
	selectAccount: (accountName: string) => void;
};

const CENNZWalletContext = createContext<WalletContext>({
	selectedAccount: null,
	wallet: null,
	connectWallet: null,
	disconnectWallet: null,
	selectAccount: null,
});

type ProviderProps = {};

export default function CENNZWalletProvider({
	children,
}: PropsWithChildren<ProviderProps>) {
	const { api } = useCENNZApi();
	const { promptInstallExtension, extension, accounts } = useCENNZExtension();
	const [wallet, setWallet] = useState<InjectedExtension>(null);
	const [selectedAccount, setAccount] = useState<InjectedAccountWithMeta>(null);

	const connectWallet = useCallback(
		async (callback) => {
			if (!api) return;

			if (!extension) {
				callback?.();
				return promptInstallExtension();
			}

			callback?.();
			setWallet(extension);
			store.set("CENNZNET-EXTENSION", extension);
		},
		[promptInstallExtension, extension, api]
	);

	const disconnectWallet = useCallback(() => {
		store.remove("CENNZNET-EXTENSION");
		store.remove("CENNZNET-ACCOUNT");
		setWallet(null);
		setAccount(null);
	}, []);

	const selectAccount = useCallback(
		(accountName: string) => {
			if (!accounts) return;
			const account = accounts.find(
				(account) => account.meta.name === accountName
			);
			setAccount(account);
			store.set("CENNZNET-ACCOUNT", account);
		},
		[accounts]
	);

	// 1. Restore the wallet from the store if it exists
	useEffect(() => {
		if (extension === null) return disconnectWallet();
		const storedWallet = store.get("CENNZNET-EXTENSION");
		if (!storedWallet) return;
		setWallet(extension);
	}, [extension, disconnectWallet]);

	return (
		<CENNZWalletContext.Provider
			value={{
				selectedAccount,
				wallet,
				connectWallet,
				disconnectWallet,
				selectAccount,
			}}
		>
			{children}
		</CENNZWalletContext.Provider>
	);
}

export function useCENNZWallet(): WalletContext {
	return useContext(CENNZWalletContext);
}
