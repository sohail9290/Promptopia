"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
    const { data: session } = useSession();
    const [providers, setProviders] = useState(null);
    const [toggleDropdown, setToggleDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const setUpProviders = async () => {
            try {
                const response = await getProviders();
                setProviders(response);
            } catch (error) {
                console.error("Error fetching providers:", error);
            }
        };
        setUpProviders();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setToggleDropdown(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        if (session) {
            sessionStorage.setItem("sessionActive", "true");
        }
    }, [session]);
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                signOut({ redirect: false });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        sessionStorage.removeItem("sessionActive");
        document.cookie = "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "next-auth.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/";
    };

    return (
        <nav className="flex-between w-full mb-16 pt-3">
            <Link href="/" className="flex gap-2 flex-center">
                <Image src="/assets/images/logo.svg" alt="Promptopia Logo" width={30} height={30} className="object-contain" />
                <p className="logo_text">Promptopia</p>
            </Link>

            <div className="sm:flex hidden">
                {session?.user ? (
                    <div className="flex gap-3 md:gap-5">
                        <Link href="/create-prompt" className="black_btn">Create Post</Link>
                        <button type="button" onClick={handleSignOut} className="outline_btn">Sign Out</button>
                        <Link href="/profile">
                            <Image src={session?.user.image || "/default-profile.png"} width={37} height={37} className="rounded-full profile-image" alt="profile" />
                        </Link>
                    </div>
                ) : (
                    providers &&
                    Object.values(providers).map((provider) => (
                        <button type="button" key={provider.name} onClick={() => signIn(provider.id)} className="black_btn">
                            Sign In
                        </button>
                    ))
                )}
            </div>

            <div className="sm:hidden flex relative">
                {session?.user ? (
                    <div className="flex">
                        <Image
                            src={session?.user.image || "/default-profile.png"}
                            width={37}
                            height={37}
                            className="rounded-full profile-image"
                            alt="profile"
                            onClick={() => setToggleDropdown((prev) => !prev)}
                        />
                        {toggleDropdown && (
                            <div ref={dropdownRef} className="dropdown">
                                <Link href="/profile" className="dropdown_link" onClick={() => setToggleDropdown(false)}>My Profile</Link>
                                <Link href="/create-prompt" className="dropdown_link" onClick={() => setToggleDropdown(false)}>Create Prompt</Link>
                                <button type="button" onClick={() => { setToggleDropdown(false); handleSignOut(); }} className="mt-5 w-full black_btn">Sign Out</button>
                            </div>
                        )}
                    </div>
                ) : (
                    providers &&
                    Object.values(providers).map((provider) => (
                        <button type="button" key={provider.name} onClick={() => signIn(provider.id)} className="black_btn">
                            Sign In
                        </button>
                    ))
                )}
            </div>
        </nav>
    );
};

export default Nav;
