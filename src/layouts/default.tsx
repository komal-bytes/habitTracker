import { Link } from "@nextui-org/link";
import { CheckCircle2, ListTodo, BarChart2, Settings, Heart, Clock, BookOpen, Leaf } from "lucide-react"
import { Navbar } from "@/components/common/navbar";
import { useEffect, useState } from "react";
import { Avatar, Image } from "@nextui-org/react";
import { userIcon, userIcons } from "@/utils/icons";
import { useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { isBase64Image } from "@/utils/habitFunctions";

interface DefaultLayoutProps {
  children: React.ReactNode;
  userInfo: { name: String, avatar: String },
}

export default function DefaultLayout({ children, userInfo }: DefaultLayoutProps) {
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

      <div className={`flex p-2 flex items-center ${theme === "light" ? "bg-white" : "bg-black"}`}>
        <Image src={isBase64Image(userInfo?.avatar) ? userInfo?.avatar : userIcons[userInfo?.avatar] || userIcons.user} className={`m-2 w-[45px] h-[45px] object-contain border-1 border-neutral-300 rounded-full`} />
        <div>
          <h1 className="text-xl font-bold">Hello, {userInfo?.name || "Mate"}</h1>
          <p className="text-sm text-gray-600">{today}</p>
        </div>
      </div>

      <main className="relative flex-grow overflow-y-scroll">
        <div className="py-2 px-5 w-full h-[100%] overflow-y-scroll flex-grow [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>
      </ main >

      <nav className={`w-full p-4 m-2 flex justify-around ${theme === "light" ? "bg-white" : "bg-black"} rounded-full  ${theme === "dark" ? "shadow-custom-white" : "shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.1)]"}`}>
        {[
          { id: "daily", link: '/daily', icon: CheckCircle2, label: "Daily" },
          { id: "habits", link: '/habits', icon: ListTodo, label: "Habits" },
          { id: "logs", link: '/logs', icon: BarChart2, label: "Logs" },
          { id: "settings", link: '/settings', icon: Settings, label: "Settings" },
        ].map((tab) => (
          <Link
            key={tab.id}
            href={tab.link}>
            <tab.icon size={30} className={`${activeTab === tab.id ? "text-primary" : "text-grey"}`} />
          </Link>
        ))}
      </nav>

    </div >
  );
}
