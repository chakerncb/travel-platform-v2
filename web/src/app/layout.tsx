import 'react-perfect-scrollbar/dist/css/styles.css'
import "/public/assets/css/style.css"
import './globals.css'
import type { Metadata } from "next"
import { Manrope, Merienda } from "next/font/google"
import AuthSessionProvider from '@/src/components/providers/SessionProvider'
import FloatingChat from '@/src/components/chat/FloatingChat'

const manrope_init = Manrope({
    weight: ['300', '400', '500', '600', '700','800'],
    subsets: ['latin'],
    variable: "--manrope",
    display: 'swap',
})
const merienda_init = Merienda({
    weight: ['300', '400', '500', '600', '700','800'],
    subsets: ['latin'],
    variable: "--merienda",
    display: 'swap',
})

export const metadata: Metadata = {
    title: "T7wisa - Travel Platform ",
    description: "Multipurpose Travel Platform",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={`${manrope_init.variable} ${merienda_init.variable}`}>
            <body>
                <AuthSessionProvider>
                    {children}
                    <FloatingChat />
                </AuthSessionProvider>
            </body>
        </html>
    )
}
