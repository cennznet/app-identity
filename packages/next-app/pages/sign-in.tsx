import { VFC, useEffect } from "react";
import { css } from "@emotion/react";
import { signIn, useSession } from "next-auth/react";
import { CircularProgress } from "@mui/material";
import useLocalStorage from "@/libs/hooks/useLocalStorage";

const SignInPage: VFC = () => {
	const { data: session, status } = useSession();
	const [authProvider] = useLocalStorage("authProvider", "");

	useEffect(() => {
		if (status !== "loading" && !session) void signIn(authProvider);
		if (status === "authenticated" && session) window.close();
	}, [session, status, authProvider]);

	return (
		<div css={styles.root}>
			<CircularProgress size={"3em"} />
		</div>
	);
};

export default SignInPage;

const styles = {
	root: css`
		margin: 2em auto;
		text-align: center;
	`,
};
