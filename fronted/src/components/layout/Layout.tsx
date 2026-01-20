import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

import { Toaster } from "react-hot-toast"

export function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
}
