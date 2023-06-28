import React, { useEffect, useState } from "react";
import Link from 'next/link';


const Footer = () => {

    return (
        <footer className="p-8 flex gap-4 justify-center items-center fixed bottom-0 left-1/2 -translate-x-1/2 bg-black">
           <Link href="https://pulsespaceapes.com" target="blank"><p>HOME</p></Link>
				<Link href="/mint"><p>MINT</p></Link>
				<Link href="/apes"><p>APES</p></Link>
				<Link href="#"><p>MARKETPLACE</p></Link>
            
        </footer>
    )
}

export default Footer;