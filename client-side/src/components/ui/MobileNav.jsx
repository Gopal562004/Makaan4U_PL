import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, Calendar, User } from "lucide-react";
import { useShortlist } from "../../contexts/ShortlistContext";

const MobileNav = () => {
  const location = useLocation();
  const { savedProperties, siteVisits } = useShortlist();

  const navItems = [
    { label: "Discover", href: "/", icon: Home },
    { label: "Search", href: "/properties", icon: Search },
    {
      label: "Saved",
      href: "/account/saved",
      icon: Heart,
      badge: savedProperties.length > 0 ? savedProperties.length : null
    },
    {
      label: "Visits",
      href: "/account/visits",
      icon: Calendar,
      badge: siteVisits.length > 0 ? siteVisits.length : null
    },
    { label: "Account", href: "/account", icon: User }
  ];

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/" || location.pathname === "/home-page";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)] border-t border-[var(--color-border)] shadow-lg pb-safe">
      <nav className="flex items-center justify-around h-14 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors ${
                active
                  ? "text-[var(--color-foreground)] font-semibold"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? "text-[var(--color-terracotta)]" : ""}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] bg-[var(--color-terracotta)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNav;
