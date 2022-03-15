import { FC } from "react";
import {
	ThemeProvider as MuiThemeProvider,
	createTheme,
	Theme,
} from "@mui/material/styles";

declare module "@mui/material/styles/createPalette" {
	export interface TypeText {
		highlight?: string;
	}

	export interface TypeBackground {
		main?: string;
	}

	export interface SimplePaletteColorOptions {
		discord?: string;
		twitter?: string;
	}

	export interface PaletteColor {
		discord?: string;
		twitter?: string;
	}
}

const config = {
	palette: {
		primary: {
			main: "#1130FF",
			discord: "#738ADB",
			twitter: "#1DA1F2",
		},
		secondary: {
			main: "#B3BDFF",
		},
		info: {
			main: "#E4E7FF",
		},
		background: {
			main: "rgba(228, 231, 255, 0.4)",
		},
		text: {
			primary: "#020202",
			secondary: "#979797",
			highlight: "#1130FF",
			disabled: "rgba(151, 151, 151, 0.25)",
		},
	},
	typography: {
		fontFamily: ["Roboto", "sans-serif"].join(","),
	},
	shape: {
		borderRadius: 0,
	},
	transitions: {
		duration: {
			shortest: 150,
		},
	},
	components: {
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true,
			},
		},
	},
} as Partial<Theme>;

const ThemeProvider: FC = (props) => {
	const theme = createTheme({
		...config,
		palette: {
			...config.palette,
			primary: {
				...config.palette.primary,
				main: config.palette.primary.main,
			},

			secondary: {
				...config.palette.secondary,
				main: config.palette.secondary.main,
			},

			info: {
				...config.palette.info,
				main: config.palette.info.main,
			},

			background: {
				...config.palette.background,
				main: config.palette.background.main,
			},
		},
		shadows: [
			"none",
			"4px 8px 8px rgba(0, 0, 0, 0.1)",
			...new Array(23).fill("4px 8px 8px rgba(0, 0, 0, 0.1)"),
		] as any,
	});

	return <MuiThemeProvider {...props} theme={theme} />;
};

export default ThemeProvider;
