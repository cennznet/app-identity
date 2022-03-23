export type AuthProvider = "discord" | "twitter";

export interface ModalStatus {
	status: "connect-wallet" | "in-progress" | "success" | "fail";
	message: string;
}

export {
	InjectedExtension,
	InjectedAccountWithMeta,
} from "@polkadot/extension-inject/types";

export type { IdentityProps } from "@polkadot/react-identicon/types";

export type * as Extension from "@polkadot/extension-dapp";

export type { IBrowser, IOS, IDevice } from "ua-parser-js";
