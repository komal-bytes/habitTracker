import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
import { LuSearch } from "react-icons/lu";
import { LuSearchX } from "react-icons/lu";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/common/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
} from "@/components/common/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export const Navbar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [searching, setSearching] = useState(false);

  const submitSearch = (e: any) => {
    e.preventDefault();
    setSearching(false);
  }

  return (
    <NextUINavbar maxWidth="xl" position="sticky"
      className="bg-transparent"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            href="/"
          >
            <p className="fascinate-inline text-xl text-black">TRACKmyHABIT</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
    </NextUINavbar>
    // <div className="sticky p-5 pl-20 bg-transparent ">
    //   <Link
    //     className="flex justify-start items-center gap-1"
    //     href="/"
    //   >
    //     <p className="fascinate-inline text-xl text-black">TRACKmyHABIT</p>
    //   </Link>
    // </div>
  );
};
