import { FC } from "react";
import { css } from "@emotion/react";
import { signOut } from "next-auth/react";

const SignOut: FC<{
	handle: string;
}> = ({ handle }) => {
	return (
		<div css={styles.root}>
			<span onClick={async () => await signOut({ redirect: false })}>
				Sign out {handle}
			</span>
		</div>
	);
};

export default SignOut;

const styles = {
	root: ({ palette }) => css`
		margin: 10px auto;
		width: auto;
		font-size: 14px;
		text-align: center;

		span {
			cursor: pointer;
			font-style: italic;
			text-decoration: underline;
			color: ${palette.text.secondary};
		}
	`,
};
