import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { useAccount, useWalletClient } from "wagmi";

import GetContract from "./Contract";

const Footer = () => {
    const { address, isConnected } = useAccount();
    const [dataFetched, updateFetched] = useState(false);

    const [rtp, setRtp] = useState("");
	const [bonus, setBonus] = useState("");
	const [totalHead, setTotalHead] = useState(Number);
	const [totalTail, setTotalTail] = useState(Number);

    const [isOwner, setOwner] = useState(false);

    useEffect(()=>{
		getData();
	}, [dataFetched]);

    const getData = async() => {
		if(!isConnected) return;

		try {
			const contract = GetContract();
             
			let tx = await contract.getRtp();
			setRtp(tx.toString());
			let bonus = await contract.getBonus();
			setBonus(bonus.toString());
			let addr = await contract.getOwner();
            let head = await contract.getTotalHead();
            setTotalHead(+head);
            let tail = await contract.getTotalTail();
            setTotalTail(+tail);
			setOwner(addr == address);
			updateFetched(true);
			
		} catch (e) {
			console.log("Not connected");
		}
	}

    return (
        <footer className="p-8 flex gap-4 justify-center items-center fixed bottom-0 left-1/2 -translate-x-1/2">
            <p>RTP: x{+rtp/10}</p>
            <p>Bonus: x{+bonus/10}</p>
            <p>Head: {((totalHead / (totalTail + totalHead))*100).toFixed(2)}%</p>
            <p>Tail: {((totalTail / (totalTail + totalHead))*100).toFixed(2)}%</p>
            {isOwner && <p><Link href="/admin">Settings</Link></p>}
        </footer>
    )
}

export default Footer;