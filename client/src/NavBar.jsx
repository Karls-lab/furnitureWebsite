import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from './firebase.ts';
import { notify } from './utils/toast';
import { useAuthState } from "react-firebase-hooks/auth";

export const NavBar = () => {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [customClaims, setCustomClaims] = useState({});


  useEffect(() => {
      if (user) {
          user.getIdTokenResult()
          .then((idTokenResult) => {
              console.log("User's custom claims:", idTokenResult.claims);
              setCustomClaims(idTokenResult.claims);
          })
          .catch((error) => {
              console.error("Error getting custom claims:", error);
          });
      }
  }, [user]);



  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User signed out successfully');
      notify('Logged out successfully', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      notify('Error signing out', 'error');
    }
  }


  const navigationItems = [
    {
      title: "Home",
      to: "/",
    },
    {
      title: "Dashboard",
      description: "View your order history and track your orders.",
      items: [

        ...(customClaims.role === undefined
        ? [
            {
              title: "Shopping Cart",
              to: "/cart",
            },
          ]
        : []),

        ...(customClaims.role === undefined
        ? [
            {
              title: "My Orders",
              to: "/my_orders",
            },
          ]
        : []),

        ...(customClaims.role === "Editor"
        ? [
            {
              title: "Inventory",
              to: "/dashboard",
            },
          ]
        : []),

        ...(customClaims.role === "Editor"
        ? [
            {
              title: "Order Management",
              to: "/orders",
            },
          ]
        : []),
        {
          title: "Store",
          to: "/store",
        }
      ],
    },

    {
      title: "Info",
      description: "Founded in 1986, our mission has always been to strive for excellence.",
      items: [
        {
          title: "About",
          to: "/about",
        },
        {
          title: "Profile",
          to: "/profile",
        },
        {
          title: "Contact",
          to: "/contact",
        }
      ],
    },
  ];

  return (
    <header className="text-white text-lg shadow-lg w-full z-40 sticky top-0 left-0 bg-navBar">
      <div className="container relative mx-auto min-h-20 flex flex-row lg:grid lg:grid-cols-3 items-center">
        <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
          <NavigationMenu className="flex justify-start items-start">
            <NavigationMenuList className="flex justify-start gap-4 flex-row">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.to ? (
                    <NavigationMenuLink to={item.to}>
                      <Button 
                        className="hover:bg-highlight"
                        variant="ghost"
                        onClick={() => item.title === "Home" ? navigate(item.to) : null}
                      >
                        {item.title}</Button>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="font-medium text-sm">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[450px] p-4 bg-subMenu">
                        <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                          <div className="flex flex-col h-full justify-between">
                            <div className="flex flex-col">
                              <p className="text-base">{item.title}</p>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                            {/* <Button size="sm" className="mt-10"> */}
                              {/* Book a call today */}
                            {/* </Button> */}
                          </div>
                          <div className="flex flex-col text-sm h-full justify-start">
                            {item.items?.map((subItem) => (
                              <NavigationMenuLink
                                to={subItem.to}
                                key={subItem.title}
                                onClick={() => navigate(subItem.to)}
                                className="flex flex-row justify-between items-center 
                                  hover:bg-subMenuHover py-2 px-4 rounded"
                              >
                                <span>{subItem.title}</span>
                                <MoveRight className="w-4 h-4 text-muted-foreground" />
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex lg:justify-center">
          <p className="font-semibold">Custom Furniture</p>
        </div>

        <div className="flex justify-end w-full gap-4">
          <div className="border-r hidden md:inline"></div>
          <Button 
            variant="outline"
            onClick={() => navigate("/login")}
            >Login
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleLogout()}
            >Sign Out
          </Button>
        </div>

        {/* Logic for mobile screens */}
        <div className="flex w-12 shrink lg:hidden items-end justify-center">

          {/* Mobile menu button */}
          <div className="flex justify-center items-center lg:hidden flex-grow">
            <Button variant="ghost" onClick={() => setOpen(!isOpen)} className="flex items-center">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="my-20 w-10 h-10" />}
            </Button>
          </div>

          {isOpen && (
            <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    {item.to ? (
                      <button
                        className="flex justify-between items-center"
                        onClick={() => { navigate(item.to); setOpen(false) }}
                      >
                        <span className="text-lg">{item.title}</span>
                        <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                      </button>
                    ) : (
                      <p className="text-lg">{item.title}</p>
                    )}
                    {item.items &&
                      item.items.map((subItem) => (
                        <button
                          key={subItem.title}
                          className="flex justify-between items-center"
                          onClick={() => { navigate(subItem.to); setOpen(false) }}
                        >
                          <span className="text-muted-foreground">
                            {subItem.title}
                          </span>
                          <MoveRight className="w-4 h-4 stroke-1" />
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </header>
  );
};

export default NavBar;
