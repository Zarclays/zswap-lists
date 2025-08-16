const { version } = require("../package.json");
const { sortTokens } = require("builder");

const fs = require('fs');
const path = require('path');

// Get all JSON files from the tokens directory
const tokenFiles = fs.readdirSync(path.join(__dirname, '../tokens'))
  .filter(file => file.endsWith('.json') && file !== 'tokens.json');

// Dynamically require all token files
const tokenData = tokenFiles.reduce((acc, file) => {
  const chainName = file.replace('.json', '');
  acc[chainName] = require(`../tokens/${file}`);
  return acc;
}, {});

// Get the list of all chains
const chains = tokenFiles.map(file => file.replace('.json', ''));

// Generate the tokens object with all chains
const tokens = chains.reduce((acc, chain) => {
  acc[chain] = tokenData[chain];
  return acc;
}, {});

module.exports = function buildList() {
  const parsed = version.split(".");
  return {
    name: "ZSwap Menu",
    timestamp: new Date().toISOString(),
    version: {
      major: +parsed[0],
      minor: +parsed[1],
      patch: +parsed[2],
    },
    tags: {},
    logoURI:
      "https://github.com/Zarclays/zswap-lists/blob/master/logos/token-logos/token/zswap.jpg?raw=true",
    keywords: ["zswap", "default"],
    tokens: sortTokens(
      Object.entries(tokens).reduce((acc, [chain, tokens]) => {
        return acc.concat(tokens);
      }, [])
    )
  };
};
