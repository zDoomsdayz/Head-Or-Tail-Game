import styles from "../styles/BettingComponent.module.css";
import React, { useEffect, useState } from "react";
import { ethers, utils } from 'ethers';
import { useAccount } from "wagmi";
import Link from 'next/link';
import Footer from "./Footer";
import GetContract from "./Contract";
import GetPEPEContract from "./Contract"; 

const PEPE_CONTRACT = '0x6982508145454ce325ddbe47a25d4ec3d2311933';
const PEPE_ABI = [
	{
	  "constant": false,
	  "inputs": [
		{
		  "name": "_spender",
		  "type": "address"
		},
		{
		  "name": "_value",
		  "type": "uint256"
		}
	  ],
	  "name": "approve",
	  "outputs": [
		{
		  "name": "",
		  "type": "bool"
		}
	  ],
	  "payable": false,
	  "stateMutability": "nonpayable",
	  "type": "function"
	}
  ];
  

const BettingComponent = () => {
	const { address, isConnected } = useAccount();

	const [dataFetched, updateFetched] = useState(false);
	const [eventInfo, setEventInfo] = useState<any[]>([]);
	const [openBetWindow, setOpenBetWindow] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isWinner, setIsWinner] = useState(false);
	const [isError, setError] = useState(false);
	const [winAmount, setWinAmount] = useState("");
	const [betType, setBetType] = useState("");
	const [num, setNum] = useState(250000000);

	const [firstLoadDone, setfirstLoad] = useState(false);

	const [isUserConnected, setIsUserConnected] = useState(false);

	useEffect(()=>{
		getData();
	}, [dataFetched]);

	useEffect(() => {
		try {
		  setIsUserConnected(isConnected);
		} catch(e) {
		  console.log("Not connected");
		}
	  }, [isConnected]);

	const retrievePastEvent = async() => {
		const contract = GetContract();
		const filterFrom = contract.filters.GameResult(null, null, null);
		const event = await contract.queryFilter(filterFrom);
		setEventInfo([]);
		event.forEach((i) => {
			setEventInfo((eventInfo) => [...eventInfo, i]);
		});
	}

	const listenToEvent = () => {
		const contract = GetContract();
		contract.on("GameResult", ()=>{
			retrievePastEvent();
		});
	}

	const getData = async() => {
		setfirstLoad(true);
		if(!isConnected) return;

		try {
			await retrievePastEvent();
			listenToEvent();

			updateFetched(true);
			
		} catch (e) {
			console.log("Not connected");
		}
	}

	const play = async(isHead:boolean) => {
		if(!isConnected) return;

		try {
			const contract = GetContract();
			const pepeContract = GetPEPEContract();
			//const value = utils.parseEther(num.toString());
			const value = num.toString();

			const approvalTx = await pepeContract.approve(contract.address, value);
    		await approvalTx.wait();
			console.log("Approved Bet Value: ", value, " $PEPE")

			setOpenBetWindow(true);
			setLoading(true);
			setBetType(isHead ? "Head" : "Tail");
			const transaction = await contract.play(isHead);
			const tx = await transaction.wait();

			setIsWinner(tx.events[0].args.isWinner);
			setLoading(false);
			setWinAmount(utils.formatEther(ethers.BigNumber.from(tx.events[0].args.amountWon)));
		} catch (e) {
			setBetType("");
			setLoading(false);
			setIsWinner(false);
			setWinAmount("");
			setError(true);
		}
	}

	const closePopUpWindow = () => {
		setOpenBetWindow(false);
		setIsWinner(false);
		setWinAmount("");
		setBetType("");
		setError(false);
	}

	const Tx = ({value}:any) => {
		return <tr className={`${value.args.player == address ? "text-green-400" : "text-orange-400"}`}>
			<td><Link href={`https://scan.v4.testnet.pulsechain.com/tx/${value.transactionHash}`} target="_blank"><p>#{value.args.gameId.toString()}</p></Link></td>
			<td><Link href={`https://scan.v4.testnet.pulsechain.com/address/${value.args.player}`} target="_blank"><p>{value.args.player}</p></Link></td>
			<td><p>{value.args.isHead? "Head": "Tail"}</p></td>
			<td>{value.args.isWinner ? 
			<p className="text-green-400">+ {utils.formatEther(ethers.BigNumber.from(value.args.amountWon))} PEPE {value.args.bonus && "🔥"}</p>
			:<p className="text-red-400">- {utils.formatEther(ethers.BigNumber.from(value.args.betAmount))} PEPE</p>}</td>
			
		</tr>
	}

	const values = [250000000, 500000000, 1000000000, 10000000000];

	const incNum = () => {
	const currentIndex = values.indexOf(num);
	if (currentIndex < values.length - 1) {
		setNum(values[currentIndex + 1]);
	}
	};

	const decNum = () => {
	const currentIndex = values.indexOf(num);
	if (currentIndex > 0) {
		setNum(values[currentIndex - 1]);
	}
	};
	/*
	const incNum = () => {
		if (num < 5) {
		  setNum(Number(num) + 1);
		}
	  };
	const decNum = () => {
		if (num > 1) {
			setNum(num - 1);
		}
	};
	*/
	return (
		firstLoadDone ? isUserConnected?
		<div className={styles.container}>
			<header className={styles.header_container} >
				<h1>- Heads Or Tails -</h1>

				<div className="flex flex-row gap-4 justify-between items-center">
					<button
						className="flex items-center justify-center h-8 w-8 rounded-full outline outline-1"
						onClick={decNum}
					>
						-
					</button>

					<div className="bg-slate-700 rounded-2xl w-48 h-10 font-minecraft items-center justify-center flex">
					{` ( ${num.toLocaleString()} PEPE )`}
					
					</div>

					<button
						className="flex items-center justify-center h-8 w-8 rounded-full outline outline-1"
						onClick={incNum}
					>
						+
					</button>
					<div>
					</div>
				</div>

				{
					openBetWindow? <div className="p-8">
						{!isError && <p>You bet on {betType}</p>}

						{loading ? 
							<button disabled={loading} className="button bg-gray-700 px-8" id="list-button">
								<p>Loading TX...</p>
							</button>
							: 
							<>

							{isError? <p className="text-red-500">Transaction Error, Please Try Again</p> 
							: isWinner ? 
							<p className="text-green-500">You Won {winAmount} PEPE</p>
							:<p className="text-yellow-500">Too Bad</p>
							}

							<button onClick={closePopUpWindow} className="button" id="list-button">
								<p>Try Again</p>
							</button>
							</>
						}
						</div>
					:<div className="flex justify-center items-center gap-5">
							<button onClick={()=>play(true)} className="play" id="list-button">
								<p>Head</p>
							</button>

							<button onClick={()=>play(false)} className="play" id="list-button">
								<p>Tail</p>
							</button>
					</div>
				}
			</header>
			
			<table className="table-auto border-separate border-spacing-x-4 border-spacing-y-1">
                <thead>
					<tr>
						<th>Round</th>
						<th>Player</th>
						<th>Result</th>
						<th>Amount</th>
					</tr>
                </thead>
                <tbody>
                {
					eventInfo?.slice(-10).reverse().map((value) => (
                        <React.Fragment key={`${value.blockNumber}`}>
                        <Tx value={value} />
                        </React.Fragment>
                    ))
                }
                </tbody>
            </table>

			<Footer/>
		</div> : 
		<div className={styles.container}>
			<header className={styles.header_container} >
				<h1>- Head Or Tail -</h1>
				<h1>Connect Wallet First ↗</h1>
		</header>
		</div> : <></>
	);
}

export default BettingComponent;
