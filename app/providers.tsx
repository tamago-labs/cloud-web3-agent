'use client';

import { useEffect, useState } from 'react';

import AOS from 'aos';
import 'aos/dist/aos.css';

import { Authenticator, useTheme, View, Heading, Image, Text, Button, ThemeProvider, Theme } from '@aws-amplify/ui-react';
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

import { Divide, Menu, X } from "react-feather"
import { PropsWithChildren } from 'react';

import Loading from '@/components/Loading';
import outputs from "@/amplify_outputs.json";
import { usePathname } from 'next/navigation'
import Link from "next/link"

Amplify.configure(outputs);

const components = {
    Header() {
        const { tokens } = useTheme();

        return (
            <View textAlign="center" padding={tokens.space.large}>
                <Link href="/" className="font-bold text-white text-2xl mb-[40px] ">
                    Copy<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Trade</span>
                </Link> 
            </View>
        );
    },
    Footer() {
        const { tokens } = useTheme();

        return (
            <View textAlign="center" padding={tokens.space.large}>
                <Text color={tokens.colors.neutral[80]}>
                    <span className='hidden md:inline-flex'>Copyright</span>© {new Date().getFullYear() + ' '}
                </Text>
            </View>
        );
    },

};

export function Providers({ children }: any) {

    const [showLoader, setShowLoader] = useState(true);

    const pathname = usePathname()

    useEffect(() => {
        AOS.init({
            once: true,
        });
    }, []);

    useEffect(() => {

        const screenLoader = document.getElementsByClassName('screen_loader');
        if (screenLoader?.length) {
            setTimeout(() => {
                setShowLoader(false);
            }, 200);
        }

    });

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
        <>
            {pathname === "/account" ?
                <ThemeProvider theme={theme} >
                    <View backgroundColor={"#030712"} className="min-h-screen">
                        <Authenticator components={components}>
                            {children}
                        </Authenticator>
                    </View>
                </ThemeProvider>
                :
                <>
                    {/* screen loader  */}
                    {showLoader && (
                        <Loading />
                    )}
                    {children}
                </>

            }
        </>
    );
}

