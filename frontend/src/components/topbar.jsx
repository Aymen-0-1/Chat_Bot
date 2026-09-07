import {Sun, Moon, LogOut} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Topbar = ({setCurrentPage}) => {
    const {isDarkMode, toggleTheme} = useTheme();
    return(
        <header className="h-16
                            bg-white
                            dark:bg-gray-800
                            border-b
                            dark:border-gray-700
                            px-6
                            flex
                            items-center
                            justify-between
                            transition-colors
                            duration-200">
            <div className="text-gray-500 
                             dark:text-gray-400
                             text-sm
                             font-mediem">
            Hello Again!
            </div>

            <div className="flex items-center gap-3">
                                {/* Toggle Theme */}
                                <button 
                                    onClick={toggleTheme}
                                    className="p-2.5
                                                 rounded-lg
                                                 text-gray-600
                                                 dark:text-gray-300
                                                 hover:bg-gray-100
                                                 dark:hover:bg-gray-700
                                                 transition-colors"
                                    title="change theme">
                                        {isDarkMode ? 
                                        <Sun className="w-5 h-5 text-amber-400"/> :<Moon className="w-5 h-5 text-gray-600"/>}
                                    </button>
                                {/* Topbar Logout */}
                                <button
                                    onClick={() => setCurrentPage('login')}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg font-medium transition-colors"
                                    >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                    </button>
                             </div>
        </header>
    );
};

export default Topbar;