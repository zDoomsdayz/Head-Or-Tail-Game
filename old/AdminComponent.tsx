import styles from "../styles/BettingComponent.module.css";
import React, { useEffect, useState } from "react";
import { utils } from 'ethers';
import { useAccount } from "wagmi";
import GetContract from "./Contract";

const AdminComponent = () => {
	const [dataFetched, updateFetched] = useState(false);
	const { address, isConnected } = useAccount();
	const [isOwner, setOwner] = useState(false);

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

	const getData = async() => {
		if(!isConnected) return;

		try {
			const contract = GetContract();
			let addr = await contract.getOwner();
			setOwner(addr == address);
			updateFetched(true);

		} catch (e) {
			console.log("Not connected");
		}
	}

	const topUpBalance = async(e:any) => {
		if(!isConnected) return;
		e.preventDefault();

		const contract = GetContract();
		const value = utils.parseEther("0.3");

		const transaction = await contract.topUpBalance({ value: value.toString() })
        const tx = await transaction.wait()

		console.log("Top Up Done", tx.transactionHash);
	}

	const withdrawFunds = async(e:any) => {
		if(!isConnected) return;
		e.preventDefault();

		const contract = GetContract();

		const transaction = await contract.withdrawFunds()
        const tx = await transaction.wait()

		console.log("Withdraw Done", tx.transactionHash);
	}

	return (
		<div className={styles.container}>
			<header className={styles.header_container} >
				{isUserConnected ? isOwner ? <>
					<h1>Settings</h1>

					<button onClick={topUpBalance} className="button" id="list-button">
						<p>topUp</p>
					</button>

					<button onClick={withdrawFunds} className="button" id="list-button">
						<p>withdraw</p>
					</button>
				</> : <h1>404 NOT FOUND</h1> : <><h1>Please connect your wallet.</h1></>
				}
			</header>
		</div>
	);
}

export default AdminComponent;
