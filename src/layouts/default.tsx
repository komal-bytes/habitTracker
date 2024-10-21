import { Link } from "@nextui-org/link";
import { CheckCircle2, ListTodo, BarChart2, Settings, Heart, Clock, BookOpen, Leaf } from "lucide-react"
import { Navbar } from "@/components/common/navbar";
import { useEffect, useState } from "react";
import { Avatar, Image } from "@nextui-org/react";
import { userIcon, userIcons } from "@/utils/icons";
import { useLocation } from "react-router-dom";
import { useTheme } from "next-themes";

interface DefaultLayoutProps {
  children: React.ReactNode;
  userInfo: { name: String, avatar: String },
}

export default function DefaultLayout({ children, userInfo }: DefaultLayoutProps) {
  console.log(userInfo)
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("daily");
  const today = calculateCurrentdate();
  const location = useLocation();

  useEffect(() => {
    usePathAfterSlash();
  }, [location])

  const usePathAfterSlash = () => {
    const path = location.pathname;
    const parts = path.split('/');
    setActiveTab(parts.slice(1).join('/'));
  };

  function calculateCurrentdate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    const finalDate = formattedDate.replace(',', '').replace(/(\d+)\s(\w+)/, '$1 $2').replace(' ', ' ');
    return finalDate;
  }

  return (
    <div className="relative flex flex-col h-screen">

      <div className={`sticky top-0 z-50 flex p-3 flex items-center ${theme === "light" ? "bg-white" : "bg-black"}`}>
        <Image src={userIcons[userInfo?.avatar] || userIcons.user} className={`m-2 w-[45px] h-[45px] `} />
        <div>
          <h1 className="text-xl font-bold">Hello, {userInfo?.name || "Mate"}</h1>
          <p className="text-sm text-gray-600">{today}</p>
        </div>
      </div>

      < main className="w-full py-2 px-5 w-full h-full flex-grow" >
        {children}
      </ main >
      <nav className={`fixed w-full bottom-0 left-0 z-50 p-4 m-2 flex justify-around ${theme === "light" ? "bg-white" : "bg-black"} rounded-full  ${theme === "dark" ? "shadow-custom-white" : "shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.1)]"}`}>
        {[
          { id: "daily", link: '/daily', icon: CheckCircle2, label: "Daily" },
          { id: "habits", link: '/habits', icon: ListTodo, label: "Habits" },
          { id: "logs", link: '/logs', icon: BarChart2, label: "Logs" },
          { id: "settings", link: '/settings', icon: Settings, label: "Settings" },
        ].map((tab) => (
          <Link
            key={tab.id}
            // onClick={() => {
            //   setActiveTab(tab.id)
            // }}
            href={tab.link}>
            <tab.icon size={30} className={`${activeTab === tab.id ? "text-primary" : "text-grey"}`} />
          </Link>
        ))}
      </nav>
      {/* <p className="text-sm">Made with ❤️ by <span className="text-primary">Komal Tolambia</span></p> */}

    </div >
  );
}
