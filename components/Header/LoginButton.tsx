import { getCurrentUser, signIn } from 'aws-amplify/auth';
import { useState, useEffect } from "react"
import Link from 'next/link';

const LoginButton = () => {

    const [user, setUser] = useState<any>(undefined)

    useEffect(() => {
        (async () => {
            try {
                const { username, userId, signInDetails } = await getCurrentUser();
                setUser({
                    username,
                    userId,
                    ...signInDetails
                })
            } catch (e) {
                setUser(undefined)
            }
        })()
    }, [])

    return (
        <>
            <Link href="/dashboard" className="bg-white px-4 py-2 rounded-lg font-medium  text-slate-900 transition">
              { user ? "Dashboard" : "Sign In"}   
            </Link>

        </>

    )
}

export default LoginButton