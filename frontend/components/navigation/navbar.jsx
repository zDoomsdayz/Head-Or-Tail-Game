import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../styles/Navbar.module.css";
import Link from 'next/link';

export default function Navbar() {
	return (
		<nav className={styles.navbar}>
			<div className={styles.navItems}>
				<Link href="https://pulsespaceapes.com" target="blank">HOME</Link>
				<Link href="/mint">MINT</Link>
				<Link href="/apes">APES</Link>
				<Link href="#">MARKETPLACE</Link>
				{/* Add more links here as per your need */}
			</div>
			<ConnectButton/>
		</nav>
	);
}
