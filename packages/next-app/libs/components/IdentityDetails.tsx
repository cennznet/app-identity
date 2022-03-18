import { FC } from "react";
import { css } from "@emotion/react";

const IdentityDetails: FC = ({}) => (
	<div css={styles.root}>
		<b>CENNZnet&apos;s Identity Module</b>
		<p>
			Here you can link your CENNZnet account with both your Discord and Twitter
			accounts.
		</p>
		<p>
			This will enable you to participate in CENNZnet&apos;s governance system.
		</p>
		<p>
			Use the appropriate buttons to sign in with Discord or Twitter, and the
			button below to connect your CENNZnet account and make the transactions.
		</p>
	</div>
);

export default IdentityDetails;

export const styles = {
	root: css`
		width: 90%;
		margin: 0 auto;
		height: 11em;

		b {
			font-size: 20px;
			letter-spacing: 0.3px;
		}

		p {
			font-size: 16px;
			line-height: 125%;
		}
	`,
};
