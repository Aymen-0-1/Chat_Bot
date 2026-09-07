import Sidebar from "./sidebar";
import Topbar from "./topbar";

const Layout = ({children, currentPage, setCurrentPage}) => {
    return (
         <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200" dir="ltr">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <div className="flex-1 flex flex-col">
                <Topbar setCurrentPage={setCurrentPage} />
                <main className="p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}
export default Layout;