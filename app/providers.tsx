'use client';

import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

import outputs from "@/amplify_outputs.json";
import AccountProvider from "../contexts/account"
import ServerProvider from "../contexts/server"

Amplify.configure(outputs);

export function Providers({ children }: any) {

    return (
        <AccountProvider>
            <ServerProvider>
                {children}
            </ServerProvider>
        </AccountProvider>
    )
}

