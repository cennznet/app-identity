import { FC } from "react";
import Image from "next/image";
import { css } from "@emotion/react";
import { CENNZnetBlue } from "@/libs/assets/vectors";

const Home: FC = () => {
	return (
		<div css={styles.root}>
			<div css={styles.container}>
				<Image
					src={CENNZnetBlue}
					alt={"CENNZnet-blue-logo"}
					width={35}
					height={35}
					css={styles.logo}
				/>
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
	`,
	logo: css`
		filter: drop-shadow(2px 2px rgba(0, 0, 0, 0.15));
	`,
	heading: css`
		color: #1130ff;
		text-align: center;
		text-shadow: 2px 2px rgba(0, 0, 0, 0.15);
		padding-left: 0.3em;
		@media (max-width: 500px) {
			font-size: 22px;
		}
	`,
};
