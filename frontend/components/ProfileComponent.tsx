import styles from "../styles/BettingComponent.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { ethers, utils } from 'ethers';
import { useAccount } from "wagmi";
import Link from 'next/link';
import Footer from "./Footer";
import GetPSAContract from "./Contract";
import Image from 'next/image';
import rarityData from '../public/rarity.json';


const ProfileComponent = () => {
	const { address, isConnected } = useAccount();
	const [dataFetched, updateFetched] = useState(false);
	const [userNFTs, setUserNFTs] = useState<{ tokenId: any; tokenURI: any; }[]>([]);
	const [firstLoadDone, setfirstLoad] = useState(false);
	const [isUserConnected, setIsUserConnected] = useState(false);

	const fetchNFTs = useCallback(async () => {
		const contract = GetPSAContract();
		const balanceTX = await contract.balanceOf(address);
		const userNFTIds = [];
		console.log(Number(balanceTX))
		for(let i = 0; i < balanceTX; i++) {
		  const tokenId = await contract.tokenOfOwnerByIndex(address, i);
		  userNFTIds.push(tokenId);
		}

		const userNFTData = await Promise.all(userNFTIds.map(async (id) => {
			const tokenURI = await contract.tokenURI(id);
			return { tokenId: id, tokenURI };
		}));
		console.log(userNFTData)
		setUserNFTs(userNFTData);

	}, [address]); // Dependency is the address variable

	const getData = useCallback(async() => {
		setfirstLoad(true);
		if(!isConnected) return;
	
		try {
			await fetchNFTs();
			updateFetched(true);
			
		} catch (e) {
			console.log("Not connected");
		}
	}, [isConnected, fetchNFTs]);  // Add fetchNFTs here
	
	useEffect(()=>{
		getData();
	}, [dataFetched, getData]);

	useEffect(() => {
		try {
		  setIsUserConnected(isConnected);
		} catch(e) {
		  console.log("Not connected");
		}
	  }, [isConnected]);
	
	const imglink = 'http://gateway.pinata.cloud/ipfs/QmdheM2UEhjs9mStQzGuRfq5SnBaXW6CB5ntvtqFg57wYe/';
	const imgext = '.png';

	const getRank = (tokenId:any) => {
		const rarityItem = rarityData.find(item => item.id === tokenId);
		return rarityItem ? rarityItem.rank : 'Rank not found';
	  };
	
	return (
		firstLoadDone ? isUserConnected?
		<div className={styles.container}>
			<header className={styles.header_container} >
				<div className="flex flex-wrap justify-center">
					{
						userNFTs.map((nft) => (
							<div key={nft.tokenId.toString()} className={styles.card}>
								<Image
								src={imglink + nft.tokenId.toString() + imgext}
								alt="Pulsechain Space Apes"
								width={250}  // specify the width of the image
								height={250} // specify the height of the image
								loading="lazy"
								/>
								
								<p>Ape #{nft.tokenId.toString()}</p>
      							<p>Rank: {getRank(nft.tokenId.toString())}</p>
									
							</div>
						))
					}
				</div>
			</header>
			
			

			<Footer/>
		</div> : 
		<div className={styles.container}>
			<header className={styles.header_container} >
				<h1>- APE PROFILE -</h1>
				<h1>Connect Wallet First ↗</h1>
		</header>
		</div> : <></>
	);
}

export default ProfileComponent;
