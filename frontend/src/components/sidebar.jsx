import {Settings, Home, LogOut, LayoutDashboard} from 'lucide-react';
const Sidebar = ({currentPage, setCurrentPage}) => {
    const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'settings', label: 'Settings', icon: Settings }
];

    return (
        <aside className='w-64 bg-white 
                dark:bg-gray-800 
                border-l 
                dark:border-gray-700 
                min-h-screen 
                p-4 
                flex 
                flex-col 
                justify-between 
                transition-colors 
                duration-200'>
            <div>
                {/*logo*/}
                <div className='flex
                                items-center
                                gap-3
                                px-3
                                py-4
                                mb-6
                                border-b
                                dark:border-gray-700'>
                    <LayoutDashboard className='w-8
                                                h-8
                                                text-blue-600
                                                dark:text-blue-400' />
                    <h1 className='text-xl
                                font-bold
                                text-gray-800
                                dark:text-white'>Dashboard</h1>                     
                </div>
                {/*navigation item*/}
                <nav className='space-y-1'>
                    {menuItems.map((item)=>{
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                            <button
                                key = {item.id}
                                onClick={() => setCurrentPage(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                                    isActive
                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}>
                                    <Icon className='w-5 h-5' />
                                    <span>{item.label}</span>
                                </button>
                        );
                    })}
                </nav> 
                </div>  
                {/* Sidebar Logout */}
                <button 
                    onClick={() => setCurrentPage('login')}
                    className="flex 
                                items-center 
                                gap-3 
                                px-4 
                                py-3 
                                text-red-600 
                                dark:text-red-400 
                                hover:bg-red-50 
                                dark:hover:bg-red-950/30 
                                rounded-lg 
                                font-medium 
                                transition-colors 
                                w-full">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>    
        </aside>
        );
        };

export default Sidebar;