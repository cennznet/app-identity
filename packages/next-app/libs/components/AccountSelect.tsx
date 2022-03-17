import { FC } from "react";
import { css } from "@emotion/react";
import { Select, SelectChangeEvent, MenuItem, Theme } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { AccountIdenticon } from "@/libs/components/index";

const accounts = [
	{ name: "dev", address: "5DVHuiWPrWomw1GxgXx6XuDCURPdDcv6YjLchobf156kwnZx" },
	{ name: "dev2", address: "5HBGv1nW59xtp4yMZ6482DW6H4VgnfRY1ZkrEmv2L8qUWDkM" },
];

const NetworkSelect: FC<{
	selectedAccount: string;
	onAccountChange: (event: SelectChangeEvent) => void;
}> = ({ selectedAccount, onAccountChange }) => {
	return (
		<div css={styles.root}>
			<Select
				css={styles.select}
				value={selectedAccount}
				onChange={onAccountChange}
				MenuProps={{ sx: styles.selectDropdown as any }}
				IconComponent={ExpandMore}
				autoWidth={false}
			>
				{accounts.map((account, i) => (
					<MenuItem key={i} value={account.name} css={styles.selectItem}>
						<AccountIdenticon
							css={styles.accountIdenticon}
							theme="beachball"
							size={28}
							value={account.address}
						/>
						<span>{account.name}</span>
					</MenuItem>
				))}
			</Select>
		</div>
	);
};

export default NetworkSelect;

export const styles = {
	root: css`
		width: auto;
		border: 1px solid black;
		border-radius: 4px;
		overflow: hidden;
		display: flex;
		align-items: center;
		transition: border-color 0.2s;
		margin-top: 10px;

		.MuiOutlinedInput-notchedOutline {
			border: none;
		}

		.MuiSelect-select {
			display: flex;
			align-items: center;
			padding-top: 0.75em;
			padding-bottom: 0.75em;
			> img {
				width: 2em;
				height: 2em;
				object-fit: contain;
				margin-right: 0.5em;
			}

			> span {
				font-size: 0.875em;
				font-weight: bold;
				flex: 1;
			}
		}
	`,
	select: ({ palette, transitions }: Theme) => css`
		border: none;
		min-width: 8.5em;
		height: 3em;

		&:hover,
		& .MuiSelect-select[aria-expanded="true"] {
			color: ${palette.text.highlight};

			.MuiSvgIcon-root {
				color: ${palette.text.highlight};
			}
		}

		.MuiList-root {
			padding: 0;
		}

		.MuiSvgIcon-root {
			transition: transform ${transitions.duration.shortest}ms
				${transitions.easing.easeInOut};
		}

		.MuiSelect-iconOpen {
			color: ${palette.primary.main};
		}
	`,
	selectDropdown: ({ palette, shadows }: Theme) => css`
		.MuiPaper-root {
			border-radius: 4px;
			overflow: hidden;
			transform: translate(-1px, 5px) !important;
			box-shadow: ${shadows[1]};
			border: 1px solid ${palette.secondary.main};
		}

		.MuiMenu-list {
			padding: 0;
		}
	`,
	selectItem: css`
		display: flex;
		padding-top: 0.75em;
		padding-bottom: 0.75em;

		> img {
			width: 2em;
			height: 2em;
			object-fit: contain;
			margin-right: 0.5em;
		}

		> span {
			font-size: 0.875em;
			font-weight: bold;
			flex: 1;
		}
	`,
	accountIdenticon: css`
		align-self: center;
		margin-right: 5px;
	`,
};
