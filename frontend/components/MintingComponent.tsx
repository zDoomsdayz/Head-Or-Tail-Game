import styles from "../styles/BettingComponent.module.css";
import React, { useEffect, useState, useCallback } from "react";
import { ethers, utils } from 'ethers';
import { useAccount } from "wagmi";
import Footer from "./Footer";
import GetPSAContract from "./Contract";
import Image from 'next/image';


const MintingComponent = () => {
	const { address, isConnected } = useAccount();

	const [dataFetched, updateFetched] = useState(false);
	const [eventInfo, setEventInfo] = useState<any[]>([]);
	const [openBetWindow, setOpenBetWindow] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isWinner, setIsWinner] = useState(false);
	const [isError, setError] = useState(false);
	const [mintAmount, setmintAmount] = useState("");
	const [supply, setTotalSupply] = useState("");
	const [num, setNum] = useState(1);
	const [errorMsg, setErrorMsg] = useState("");

	const [firstLoadDone, setfirstLoad] = useState(false);

	const [isUserConnected, setIsUserConnected] = useState(false);

	const getData = async() => {
		setfirstLoad(true);
		if(!isConnected) return;

		try {			
			await apeData();
			updateFetched(true);
			
		} catch (e) {
			console.log("Not connected");
		}
	}
	const apeData = useCallback(async () => {
		if(!isConnected) return;
	  
		try {
		  const contract = GetPSAContract();
		  const _totalsupply = await contract.totalSupply();
		  setTotalSupply(_totalsupply.toString());
		  console.log(_totalsupply.toString());
		} catch (e) {
		  console.log(e);
		}
	  }, [isConnected]);
	  

	useEffect(() => {
		const getData = async () => {
			setfirstLoad(true);
			if(!isConnected) return;
	
			try {			
				await apeData();
				updateFetched(true);
			} catch (e) {
				console.log("Not connected");
			}
		}
		getData();
	}, [dataFetched, isConnected, apeData]); // Add apeData here

	useEffect(() => {
		try {
		  setIsUserConnected(isConnected);
		} catch(e) {
		  console.log("Not connected");
		}
	  }, [isConnected]);

	

	  

	const mintape = async() => {
		if(!isConnected) return;

		try {
			const contract = GetPSAContract();
			const value = utils.parseEther((num * 1).toString());
			console.log(value.toString());

			setOpenBetWindow(true);
			setLoading(true);

			const transaction = await contract.mint(num,{ value: value.toString() });
			const tx = await transaction.wait();
			
			setIsWinner(true);
			setLoading(false);
			setmintAmount(num.toString());
		} catch (e) {
			setLoading(false);
			setIsWinner(false);
			setmintAmount("");
			setError(true);
			
		}
	}

	const closePopUpWindow = () => {
		setOpenBetWindow(false);
		setIsWinner(false);
		setmintAmount("");
		
		setError(false);
	}


	const incNum = () => {
		if (num < 30) {
		  setNum(Number(num) + 1);
		}
	  };
	const decNum = () => {
		if (num > 1) {
			setNum(num - 1);
		}
	};

	return (
		firstLoadDone ? isUserConnected?
		<div className={styles.container}>
			<header className={styles.header_container} >
			<Image
			src='https://pulsespaceapes.com/img/front.gif'
			alt="Pulsechain Space Apes"
			width={250}  // specify the width of the image
			height={250} // specify the height of the image
			loading="lazy"
			/>
				<h1>- MINT APE -</h1>
				<p>{supply} / 3000</p>
				<div className="flex flex-row gap-4 justify-between items-center">
				<button
					className="flex items-center justify-center h-8 w-8 rounded-full outline outline-1"
					onClick={decNum}
				>
					-
				</button>

				<input 
				type="number"
				min="1"
				max="30"
				value={num}
				onChange={(e) => {
					const value = parseInt(e.target.value);
					if (!isNaN(value) && value >= 1 && value <= 30) {
						setNum(value);
					}
				}}
		className="bg-slate-700 rounded-2xl w-48 h-10 font-minecraft items-center justify-center flex text-center"
	/>

				<button
					className="flex items-center justify-center h-8 w-8 rounded-full outline outline-1"
					onClick={incNum}
				>
					+
				</button>
			</div>
							<br></br>
				<p>{(num * 300000).toLocaleString()} $PLS</p>

				{
					openBetWindow? <div className="p-8">
						

						{loading ? 
							<button disabled={loading} className="button bg-gray-700 px-8" id="list-button">
								<p>Loading TX...</p>
							</button>
							: 
							<>

							{isError? <p className="text-red-500">Transaction Error, Please Try Again</p> 
							: isWinner ? 
							<p className="text-green-500">{mintAmount} Ape(s) minted! Check APES page!</p>
							:<p className="text-yellow-500"></p>
							}

							<button onClick={closePopUpWindow} className="button" id="list-button">
								<p>Try Again</p>
							</button>
							</>
						}
						</div>
					:<div className="flex justify-center items-center gap-5">
							<button onClick={()=>mintape()} className="play" id="list-button">
								<p>MINT</p>
							</button>

						
					</div>
				}
			</header>
			
			

			<Footer/>
		</div> : 
		<div className={styles.container}>
			<header className={styles.header_container} >
				<h1>- Pulse Space Apes -</h1>
				<h1>Connect Wallet First ↗</h1>
		</header>
		</div> : <></>
	);
}

export default MintingComponent;
