import { FC } from "react";
import Image from "next/image";
import { css } from "@emotion/react";
import { AccountIdenticon } from "@/libs/components";

const AccountInput: FC<{ setAddress: Function; address: string }> = ({
	setAddress,
	address,
}) => {
	return (
		<div css={styles.addressInputContainer}>
			{address ? (
				<AccountIdenticon
					css={styles.accountIdenticon}
					theme="beachball"
					size={28}
					value={address}
				/>
			) : (
				<Image
					src="/images/cennznet_blue.svg"
					width={28}
					height={28}
					alt="cennz-logo"
				/>
			)}
			<input
				type="text"
				value={address}
				onChange={(e) => setAddress(e.target.value)}
			/>
		</div>
	);
};

export default AccountInput;

export const styles = {
	addressInputContainer: css`
		background: #ffffff;
		border: 1px solid #979797;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 0 15px;
		height: 60px;
		width: 100%;
		border-radius: 4px;

		input {
			margin-left: 10px;
			width: 100%;
			height: 100%;
			background: transparent;
			border: none;
			text-overflow: ellipsis;
			font-style: normal;
			font-weight: bold;
			font-size: 16px;
			line-height: 124%;
			&:focus-visible {
				outline: none;
			}
		}
	`,
	accountIdenticon: css`
		align-self: center;
		margin-right: 5px;
	`,
};
