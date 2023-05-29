require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config()

module.exports = {
	solidity: {
		version: "0.8.18",
		settings: {
			optimizer: {
				enabled: true
			}
		}
	},
	allowUnlimitedContractSize: true,
	networks: {
		mumbai: {
			url: process.env.MUMBAI_URL,
			accounts: [process.env.PRIVATE_KEY]
		},
		sepolia: {
			url: process.env.SEPOLIA_URL,
			accounts: [process.env.PRIVATE_KEY]
		}
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_KEY
	  }
}