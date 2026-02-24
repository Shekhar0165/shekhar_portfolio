import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RootLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <Outlet />
            </main>
            <footer className="w-full py-8 text-center text-muted-foreground border-t border-border mt-auto">
                <p>© {new Date().getFullYear()} Shekhar Kashyap. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default RootLayout;
