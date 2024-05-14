"use client"
import { useState } from "react"

export function SideMenu({}) {
    const [showSideMenu, setShowSideMenu] = useState(false)
    return (
        <>
            <div className="flex flex-col gap-4 h-screen">
                <button onClick={() => setShowSideMenu(!showSideMenu)}>
                    MENU
                </button>
            </div>
            <div className={`fixed flex flex-col gap-4 h-screen bg-gray-500 overflow-hidden z-10 ${showSideMenu ? "w-32" : "w-0"}`}>
                <button onClick={() => setShowSideMenu(!showSideMenu)}>Hide</button>
                <a href="/profile">Profile</a>
            </div>
        </>
    )
}