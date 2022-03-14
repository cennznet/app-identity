import type { AppProps } from "next/app";
import { useBeforeunload } from "react-beforeunload";
import { SessionProvider, signOut } from "next-auth/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/libs/theme";
import Head from "next/head";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	useBeforeunload(async () => await signOut({ redirect: false }));

	return (
		<SessionProvider session={session}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Head>
					<title>CENNZnet Identity App</title>
					<meta name="description" content="Identity App powered by CENNZnet" />
					<link rel="icon" href="/favicon.svg" />
				</Head>
				<Component {...pageProps} />
			</ThemeProvider>
		</SessionProvider>
	);
}

export default MyApp;
