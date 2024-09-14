import React, { useState } from "react";
import "./sidepanel.css";
import { NavLink, useLocation } from "react-router-dom";
import {
  SVGIconBrand,
  SVGIconCreate,
  SVGIconDirect,
  SVGIconHome,
  SVGIconSearch,
} from "../../utils/IconsManager/IconsManager";
import { useSelector } from "react-redux";
import { selectUsers } from "../../store/slices/users/usersSlice";
import Search from "../Search/Search";

function SidePanel() {
  const { currentUser } = useSelector(selectUsers);
  const [searchVisible, setSearchVisible] = useState(false);

  const NavItems = {
    None: {
      icon: () => "",
    },
    NavItemHome: {
      text: "Home",
      pathname: "/",
      icon: (active) => <SVGIconHome active={active} />,
    },
    NavItemSearch: {
      text: "Search",
      pathname: "/search",
      icon: (active) => <SVGIconSearch active={active} />,
      onclick: true,
    },
    NavItemDirect: {
      text: "Direct",
      pathname: "/direct",
      icon: (active) => <SVGIconDirect active={active} />,
    },
    NavItemCreate: {
      text: "Create",
      pathname: "/create",
      icon: (active) => <SVGIconCreate active={active} />,
    },
    NavItemProfile: {
      text: "Profile",
      pathname: `/user/${currentUser?.userName}`,
      icon: () => currentUser?.userInfo?.profileImage,
    },
  };

  const pathname = useLocation().pathname;

  return (
    <div className="sidepanel_page">
      <div className="sidepanel">
        <div className="brand">
          <button className="menu">
            <SVGIconBrand />
          </button>
        </div>
        <nav>
          {Object.keys(NavItems).map(
            (n) =>
              NavItems[n].pathname && (
                <NavLink
                  key={n}
                  to={NavItems[n].pathname}
                  onClick={(e) => {
                    if (NavItems[n].onclick) {
                      e.preventDefault();
                      setSearchVisible(!searchVisible);
                    }
                  }}
                >
                  {n === "NavItemProfile" ? (
                    <img src={currentUser?.userInfo?.profileImage} alt="" />
                  ) : (
                    NavItems[n].icon(pathname === NavItems[n].pathname)
                  )}
                  {NavItems[n].text}
                </NavLink>
              )
          )}
        </nav>
      </div>
      <div className={searchVisible ? "visible" : "hiden"}>
        {searchVisible ? <Search setSearchVisible={setSearchVisible} /> : ""}
      </div>
    </div>
  );
}

export default SidePanel;
