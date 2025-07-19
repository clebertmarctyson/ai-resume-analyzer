import React, {useEffect} from 'react'

import { usePuterStore } from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";

export const meta = () => {
    return [
        { title: "Resumind | Auth" },
        { name: "description", description: "Log in to your account" }
    ]
}

const Auth = () => {

    const { isLoading, auth } = usePuterStore();
    const navigate = useNavigate();
    const location = useLocation();
    const next = location.search.split("next=")[1];

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover flex flex-col gap-4 items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div>
                        {isLoading ? (<button className="auth-button animate-pulse">Signing you in ...</button>) : (
                            <>
                                {!auth.isAuthenticated ? (
                                    <div className="flex flex-col gap-8">
                                        <div className="flex flex-col items-center gap-2 text-center">
                                            <h1>Welcome</h1>
                                            <h2>Log In To Continue Your Job Journey</h2>
                                        </div>
                                        <button className="auth-button" onClick={auth.signIn}>Sign In</button>
                                    </div>
                                ) : (
                                    <button className="auth-button" onClick={auth.signOut}>Sign Out</button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}
export default Auth
