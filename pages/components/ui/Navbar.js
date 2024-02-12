import React from 'react'
import Link from 'next/link'

const NavbarUI = ({ web3Handler, accounts }) => {
    return (
        <div className="navbar bg-base-500 shadow-lg ">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link href="/" >Home </Link></li>
                        <li><Link href="/create" >Create</Link></li>
                        <li><Link href="/my-listed-items" >My Listed Items</Link></li>
                        <li><Link href="/my-purchases" >My Purchases</Link></li>
                    </ul>
                </div>
                {/* <img src="./market.png" width="40" height="40" className="" alt="" /> */}
                <a className="btn btn-square btn-ghost">
                    <img src="./market.png" width="30" height="30" className="" alt="" />
                </a>
                <a className="btn btn-ghost text-xl">nftMarketplace</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {/* <li><a>Home</a></li>
                    <li><a>Create</a></li>
                    <li><a>My Listed Items</a></li>
                    <li><a>My Purchases</a></li> */}
                    <li><Link href="/" >Home </Link></li>
                    <li><Link href="/create" >Create</Link></li>
                    <li><Link href="/my-listed-items" >My Listed Items</Link></li>
                    <li><Link href="/my-sold-items" >Items Sold</Link></li>
                    <li><Link href="/my-purchases" >My Purchases</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                {accounts ? (
                    <button className="btn btn-primary btn-outline">
                        {accounts[0].slice(0, 5) + '...' + accounts[0].slice(38, 42)}
                    </button>
                ) : (
                    <>
                        <button onClick={web3Handler} className="btn btn-primary btn-outline">
                            Connect Wallet
                        </button>

                    </>
                )}
            </div>
        </div>
    )
}

export default NavbarUI
