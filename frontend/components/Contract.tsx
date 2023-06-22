import { providers, Contract } from 'ethers';
import artifact from '../abi/HeadOrTailGame.json';

const GetContract = () => {
	const provider = new providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();

	const v1 = '0x995d0a24B65BBc4FbF23905B617817B680D88d19';
	const v2 = '0xae5F7aa4c0ca8708D0f683C83E9648B873F01720';
	const v3 = '0xF807a640698f021C1ce2f2Ee8deCE5038192Ec2A';
	const v4 = '0xb97aA2A0Ca589a1f7078FD996A97B2E9Fb21968c';

	const v5 = '0x05B698C46a2dfC9c9eEB1Fd305fB7c6EC46d0C8D';
	return new Contract(v5, artifact.abi, signer);
}

export default GetContract;