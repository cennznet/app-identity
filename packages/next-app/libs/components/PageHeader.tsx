import { FC } from "react";
import { css } from "@emotion/react";

const Home: FC = () => {
	return (
		<div css={styles.root}>
			<div css={styles.container}>
				<img src={"/images/cennznet_blue.svg"} alt={"CENNZnet-blue-logo"} />
				<h1 css={styles.heading}>CENNZnet Identity</h1>
			</div>
		</div>
	);
};

export default Home;

export const styles = {
	root: css`
		width: 50%;
		margin: 2em auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	`,
	container: css`
		display: flex;
		flex-direction: row;

		img {
			margin-right: 0.3em;
			filter: drop-shadow(2px 2px rgba(0, 0, 0, 0.15));
		}
	`,
	heading: css`
		color: #1130ff;
		text-align: center;
		text-shadow: 2px 2px rgba(0, 0, 0, 0.15);
		@media (max-width: 500px) {
			font-size: 22px;
		}
	`,
};
