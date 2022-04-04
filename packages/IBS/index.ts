import * as dotenv from "dotenv";
dotenv.config();
import { Api } from "@cennznet/api";
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady, blake2AsHex } from "@polkadot/util-crypto";
import dbConnect from "@/libs/db/dbConnect";
import { initialiseBot, assignIdentityRole } from "discordBot";
import CennznetClaims from "@/libs/db/models/cennznetclaims";
import AccountClaims from "@/libs/db/models/accountclaims";
import { CENNZ_PROVIDER, REG_INDEX_DISCORD, REG_INDEX_TWITTER } from "@/libs/constants";

let api;
let keyring;
// TODO change to CENNZnet account using private key
let eve; // Discord signing
let ferdie; // Twitter signing

async function initialise() {
	// Create account key pair
	const types = {
		IdentityInfo: {
			additional: "Vec<(Data, Data)>",
			legal: "Data",
			web: "Data",
			discord: "Data",
			email: "Data",
			pgp_fingerprint: "Option<[u8; 20]>",
			image: "Data",
			twitter: "Data",
		}
	};
	await cryptoWaitReady();
	api = await Api.create({ provider: CENNZ_PROVIDER, types });
	keyring = new Keyring({ type: "sr25519" });
	console.log(`Connected to CENNZnet network ${CENNZ_PROVIDER}`);
	eve = keyring.addFromUri("//Eve");
	ferdie = keyring.addFromUri("//Ferdie");
}

// Add a new CENNZnet identity claim to the database (Or update existing)
async function addCENNZnetClaim(identity: {
	cennznet_account: string;
	account_hash: string;
	account_type: string;
}) {
	await dbConnect();
	console.log("connected");
	try {
		// Filter includes CENNZnet account AND account_type
		// This is because a user can verify different account types so we need to distinguish both.
		const filter = {
			cennznet_account: identity.cennznet_account,
			account_type: identity.account_type,
		};
		const existingCennznetClaim = await CennznetClaims.findOne(filter);
		if (!!existingCennznetClaim) {
			// Claim already exists, Check if hash is different and if it has NOT been verified already
			if (
				existingCennznetClaim.account_hash !== identity.account_hash &&
				!existingCennznetClaim.verified
			) {
				await CennznetClaims.updateOne(filter, {
					account_hash: identity.account_hash,
				});
				console.log(
					`Updated CENNZnet account: ${identity.cennznet_account}\n` +
						`For account type: ${identity.account_type}\n` +
						`With new hash: ${identity.account_hash}\n`
				);
			} else {
				console.log("Claim already exists");
			}
		} else {
			// Create new entry in DB
			await CennznetClaims.create({
				cennznet_account: identity.cennznet_account,
				account_hash: identity.account_hash,
				account_type: identity.account_type,
				verified: false,
			});
			console.log(
				`Successfully added CENNZnet account to file: ${identity.cennznet_account} `
			);
		}
	} catch (err) {
		// TODO better error handling
		console.log(err);
	}
}

async function findMatch() {
	console.log("-- Searching for matches");

	// Get all un verified claims from cennznetclaims DB
	const cennznetClaims = await CennznetClaims.find({ verified: false });

	for (let i = 0; i < cennznetClaims.length; i++) {
		const claim = cennznetClaims[i];
		// Check if there are matches in accountclaims DB
		const filter = {
			cennznet_account: claim.cennznet_account,
			account_type: claim.account_type,
		};
		const accountMatch = await AccountClaims.findOne(filter);
		if (accountMatch && blake2AsHex(accountMatch.username) === claim.account_hash) {
			if (await submitJudgement(claim.cennznet_account, claim.account_type)) {
				await CennznetClaims.updateOne(filter, {
					verified: true,
				});
				if (claim.account_type === "discord"){
					assignIdentityRole(accountMatch.username);
				}
			}
		}
	}
}

async function submitJudgement(target: string, account_type: string) {
	if (!api) {
		console.log("API not connected, judgement couldn't be made");
		return false;
	}
	try {
		let signer;
		let reg_index;
		if (account_type === "discord") {
			signer = eve;
			reg_index = REG_INDEX_DISCORD;
		} else if (account_type === "twitter") {
			signer = ferdie;
			reg_index = REG_INDEX_TWITTER;
		} else {
			return false;
		}

		const judgement = "KnownGood";
		const extrinsic = api.tx.identity.provideJudgement(
			reg_index,
			target,
			judgement
		);
		extrinsic.signAndSend(signer);
		console.log("++ Judgement given for account: " + target);
	} catch (err) {
		console.log(err);
	}
	return true;
}

async function processDataAtBlockHash(blockHash) {
	const block = await api.rpc.chain.getBlock(blockHash);
	if (block) {
		const extrinsics = block.block.extrinsics.toHuman();
		const filteredExtrinsics = extrinsics.filter(
			(ext) => ext.isSigned && ext.method.section === "identity"
		);
		if(!filteredExtrinsics?.length) return;
		filteredExtrinsics.forEach(async (filteredExtrinsic) => {
			if (filteredExtrinsic.method.method !== "setIdentity") {
				return;
			}
			console.log("-- New CENNZnet identity transaction");
			const args = filteredExtrinsic.method.args["info"];
			if (args["discord"] !== "None") {
				const key = Object.keys(args["discord"])[0];
				if (key === "BlakeTwo256") {
					const discord_hash = args["discord"][key];
					const identity = {
						cennznet_account: filteredExtrinsic.signer,
						account_hash: discord_hash,
						account_type: "discord",
					};
					await addCENNZnetClaim(identity);
				} else {
					console.log("Err: Account needs to be encoded with BlakeTwo256");
				}
			}
			if (args["twitter"] !== "None") {
				const key = Object.keys(args["twitter"])[0];
				if (key === "BlakeTwo256") {
					const twitter_hash = args["twitter"][key];
					const identity = {
						cennznet_account: filteredExtrinsic.signer,
						account_hash: twitter_hash,
						account_type: "twitter",
					};
					await addCENNZnetClaim(identity);
				} else {
					console.log("Err: Account needs to be encoded with BlakeTwo256");
				}
			}
		});
	} else {
		console.log(
			`Retrieving block details from rpc.chain.getBlock failed for hash ${blockHash}`
		);
	}
}

async function main() {
	// Scan the finalized block and store it in db
	await api.rpc.chain.subscribeFinalizedHeads(async (head) => {
		const finalizedBlockAt = head.number.toNumber();
		console.log(
			"\n===== Block Number: " + finalizedBlockAt.toString() + " ====="
		);
		const blockHash = await api.rpc.chain.getBlockHash(
			finalizedBlockAt.toString()
		);
		await processDataAtBlockHash(blockHash);
		await findMatch();
	});
}

initialise().then(() => {
	// assignIdentityRole("JasonT#0425");
	initialiseBot();
	main().catch((error) => {
		console.error(error);
	});
});
