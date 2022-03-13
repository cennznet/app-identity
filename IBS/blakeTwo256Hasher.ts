// Helper function for testing, simply hashes a string
const { blake2AsHex } = require("@polkadot/util-crypto");

const str: string = "JasonT#0425";
console.log(blake2AsHex(str));
// 0xc06a383c3b432d4f1d6fc4bc4e3f4555a767d9455d81ca380a3e1b9a5f932026
