import { VFC, useEffect } from "react";
import { css } from "@emotion/react";
import { signIn, useSession } from "next-auth/react";
import { CircularProgress } from "@mui/material";
import useLocalStorage from "@/libs/hooks/useLocalStorage";
import { AuthProvider } from "@/libs/types";

const SignInPage: VFC = () => {
	const { data: session, status } = useSession();
	const [authProvider] = useLocalStorage<AuthProvider>(
		"authProvider",
		!!session
	);

	useEffect(() => {
		if (status !== "loading" && !session) void signIn(authProvider);
		if (status === "authenticated" && session) window.close();
	}, [session, status, authProvider]);

	return (
		<div css={styles.root}>
			{authProvider && (
				<div css={styles.authProvider(authProvider)}>
					<p>Connecting to {authProvider}...</p>
					<CircularProgress size="3.5em" color="inherit" />
				</div>
			)}
		</div>
	);
};

export default SignInPage;

const styles = {
	root: css`
		margin: 0 auto;
		text-align: center;
	`,
	authProvider:
		(authProvider: AuthProvider) =>
		({ palette }) =>
			css`
				color: ${palette.primary[authProvider]};

				p {
					margin-bottom: 2em;
					font-size: 20px;
					text-transform: uppercase;
					font-weight: bold;
					text-shadow: 1px 1px rgba(0, 0, 0, 0.15);
				}
			`,
};
