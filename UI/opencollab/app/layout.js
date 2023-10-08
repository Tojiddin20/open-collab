'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <DndProvider backend={HTML5Backend}>
                <body className={inter.className}>{children}</body>
            </DndProvider>
        </html>
    )
}
