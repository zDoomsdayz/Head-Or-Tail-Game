import { providers, Contract } from 'ethers';
import artifact3 from '../abi/PSA.json';

const GetPSAContract = () => {
	const provider = new providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();

	const v1 = '0x0805aE035fCeA6276741eA4e3250592504E99699';
	return new Contract(v1, artifact3, signer);
}

export default GetPSAContract;