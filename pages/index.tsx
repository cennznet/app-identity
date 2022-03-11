import { FC } from "react";
import { css } from "@emotion/react";
import TwitterHandler from "@/components/TwitterHandler";

const Home: FC = () => {
	return (
		<div css={styles.container}>
			<div css={styles.headerContainer}>
				<img src={"/images/cennznet_blue.svg"} alt={""} />
				<h1 css={styles.heading}>CENNZnet Identity</h1>
			</div>
			<TwitterHandler />
		</div>
	);
};

export default Home;

export const styles = {
	headerContainer: css`
		display: flex;
		flex-direction: row;

		img {
			margin-right: 10px;
		}
	`,
	heading: css`
		color: #1130ff;
		text-align: center;
		@media (max-width: 500px) {
			font-size: 22px;
		}
	`,
	container: css`
		width: 50%;
		margin: 15px auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	`,
};
