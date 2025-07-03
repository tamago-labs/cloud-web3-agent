'use client';

import { useEffect, useState } from 'react';

import { Authenticator, useTheme, View, Heading, Image, Text, Button, ThemeProvider, Theme } from '@aws-amplify/ui-react';
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";


import outputs from "@/amplify_outputs.json";
import { usePathname } from 'next/navigation'
import Link from "next/link"

// import CloudAgentProvider from "../hooks/useCloudAgent"

Amplify.configure(outputs);

const components = {
    Header() {
        const { tokens } = useTheme();

        return (
            <View textAlign="center" padding={tokens.space.large}>
                <Link href="/" className="inline-flex mb-[20px] mt-[20px]">
                    <span className="text-gray-900 text-xl font-bold font-mono">
                        [tamago_labs]
                    </span>
                </Link> 
            </View>
        );
    },
    Footer() {
        const { tokens } = useTheme();

        return (
            <View textAlign="center" padding={tokens.space.large}>
                <Text color={tokens.colors.black}>
                    Secured by AWS Cognito
                </Text>
            </View>
        );
    },
};

export function Providers({ children }: any) {


    const { tokens } = useTheme()

    const theme: Theme = {
        name: 'Auth Theme',
        tokens: {
            components: {
                authenticator: {
                    router: {
                        boxShadow: `0 0 16px ${tokens.colors.overlay['10']}`,
                        borderWidth: '0'
                    }
                },
                tabs: {
                    item: {
                        backgroundColor: "#08111566",
                        borderColor: "#08111566"
                    },
                },
            },
        },
    }

    return (
        <ThemeProvider theme={theme} >
            <View className="min-h-screen relative ">
                <Authenticator components={components}>
                    {children}
                </Authenticator>
            </View>
        </ThemeProvider>
    );
}

