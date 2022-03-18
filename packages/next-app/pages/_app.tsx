import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@/libs/providers/ThemeProvider";
import { CssGlobal, PageHeader } from "@/libs/components";
import UserAgentProvider from "@/libs/providers/UserAgentProvider";
import CENNZExtensionProvider from "@/libs/providers/CENNZExtensionProvider";
import CENNZApiProvider from "@/libs/providers/CENNZApiProvider";
import { CENNZ_API_URL } from "@/libs/constants";
import { FAVICON } from "@/libs/assets";
import CENNZWalletProvider from "@/libs/providers/CENNZWalletProvider";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session}>
			<CssBaseline />
			<ThemeProvider>
				<CssGlobal />
				<UserAgentProvider>
					<CENNZExtensionProvider>
						<CENNZApiProvider endpoint={CENNZ_API_URL}>
							<CENNZWalletProvider>
								<Head>
									<title>CENNZnet Identity App</title>
									<meta
										name="description"
										content="Identity App powered by CENNZnet"
									/>
									<link rel="icon" href={FAVICON} />
								</Head>
								<PageHeader />
								<Component {...pageProps} />
							</CENNZWalletProvider>
						</CENNZApiProvider>
					</CENNZExtensionProvider>
				</UserAgentProvider>
			</ThemeProvider>
		</SessionProvider>
	);
}

export default MyApp;
