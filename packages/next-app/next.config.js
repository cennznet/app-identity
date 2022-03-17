/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	webpack: (config) => {
		config.module.rules.push({
			test: /\.(svg)$/i,
			type: "asset/resource",
		});
		return config;
	},
	eslint: {
		dirs: ["pages", "libs/components", "libs/providers"],
	},
};
