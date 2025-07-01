import React from "react";
import type { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { ArrowUpRight, type LucideIcon, Menu } from "lucide-react";

import { Button } from "@forthtilliath/shadcn-ui/components/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@forthtilliath/shadcn-ui/components/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@forthtilliath/shadcn-ui/components/sheet";

interface BaseItem {
  label: string;
}
type ParentItem = BaseItem & { items: SubItem[] };
type LinkItem = BaseItem & { href: string };
export type Item = ParentItem | LinkItem;
interface SubItem extends LinkItem {
  icon: LucideIcon;
  description: string;
}
interface Props {
  logo?: React.ReactNode;
  render: (item: LinkItem) => React.ReactNode;
  renderSubItem: (subItem: SubItem) => React.ReactNode;
  items: Item[];
}

export function Navbar({ logo, render, renderSubItem, items }: Props) {
  return (
    <nav className="h-16 bg-background border-b">
      <div className="h-full flex items-center justify-between max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          {logo}

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" render={render} items={items} />
        </div>

        <div className="flex items-center gap-3">
          <Button>
            Get Started <ArrowUpRight />
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent>
                {logo}

                <div className="mt-12 text-base space-y-4">
                  {items.map((item, iItem) => {
                    if ("items" in item) {
                      return (
                        <div key={iItem}>
                          <div className="font-bold">{item.label}</div>
                          <ul className="mt-2 space-y-3 ml-1 pl-4 border-l">
                            {item.items.map((subItem, iSubItem) => (
                              <li key={iSubItem}>{renderSubItem(subItem)}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }

                    return (
                      <React.Fragment key={iItem}>
                        {render({ href: item.href, label: item.label })}
                      </React.Fragment>
                    );
                  })}

                  {/* <div>
                    <div className="font-bold">Food</div>
                    <ul className="mt-2 space-y-3 ml-1 pl-4 border-l">
                      {foods.map((foodItem) => (
                        <li key={foodItem.title}>
                          <Link href="#" className="flex items-center gap-2">
                            <foodItem.icon className="h-5 w-5 mr-2 text-muted-foreground" />
                            {foodItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="font-bold">Travel</div>
                    <ul className="mt-2 space-y-3 ml-1 pl-4 border-l">
                      {travelMenuItems.map((item) => (
                        <li key={item.title}>
                          <Link href="#" className="flex items-center gap-2">
                            <item.icon className="h-5 w-5 mr-2 text-muted-foreground" />
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div> */}
                </div>

                <NavMenu
                  orientation="vertical"
                  className="mt-12"
                  render={render}
                  items={items}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

type NavMenuProps = NavigationMenuProps & Pick<Props, "items" | "render">;
const NavMenu = ({ render, items, ...props }: NavMenuProps) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
      <NavigationMenuItem>
        <NavigationMenuLink asChild></NavigationMenuLink>
      </NavigationMenuItem>
      {items.map((item, iItem) => {
        if ("items" in item) {
          return (
            <div key={iItem}>
              <div className="font-bold">{item.label}</div>
              <ul className="mt-2 space-y-3 ml-1 pl-4 border-l">
                {/* {item.items.map((subItem, iSubItem) => (
                  <li key={iSubItem}>{renderSubItem(subItem)}</li>
                ))} */}
              </ul>
            </div>
          );
        }

        return (
          <React.Fragment key={iItem}>
            {render({ href: item.href, label: item.label })}
          </React.Fragment>
        );
      })}
      <NavigationMenuItem>
        <Button variant="ghost" className="text-[15px] font-normal" asChild>
          {/* {render()} */}
        </Button>
      </NavigationMenuItem>

      {/* {items.map((item) => (
        <NavigationMenuItem key={item.id}>
          <NavigationMenuLink asChild>
            {render({ href: item.href, label: item.label })}
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))} */}
    </NavigationMenuList>
  </NavigationMenu>
);

export default Navbar;

// const NavMenu2 = (props: NavigationMenuProps) => (
//   <NavigationMenu {...props}>
//     <NavigationMenuList className="gap-0 space-x-0 text-sm">
//       <NavigationMenuItem>
//         <Button variant="ghost" className="text-[15px] font-normal" asChild>
//           <Link href="#">Home</Link>
//         </Button>
//       </NavigationMenuItem>
//       <NavigationMenuItem>
//         <NavigationMenuTrigger className="text-[15px] font-normal">
//           Food
//         </NavigationMenuTrigger>
//         <NavigationMenuContent>
//           <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
//             {foods.map((food) => (
//               <ListItem
//                 key={food.title}
//                 title={food.title}
//                 icon={food.icon}
//                 href="#"
//               >
//                 {food.description}
//               </ListItem>
//             ))}
//           </ul>
//         </NavigationMenuContent>
//       </NavigationMenuItem>
//       <NavigationMenuItem>
//         <NavigationMenuTrigger className="text-[15px] font-normal">
//           Travel
//         </NavigationMenuTrigger>
//         <NavigationMenuContent>
//           <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
//             {travelMenuItems.map((menuItem) => (
//               <ListItem
//                 key={menuItem.title}
//                 title={menuItem.title}
//                 icon={menuItem.icon}
//                 href="#"
//               >
//                 {menuItem.description}
//               </ListItem>
//             ))}
//           </ul>
//         </NavigationMenuContent>
//       </NavigationMenuItem>
//     </NavigationMenuList>
//   </NavigationMenu>
// );

//         <Link
//           ref={ref}
//           className={cn(
//             "block select-none space-y-2 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//             className
//           )}
//           {...props}
//         >
//           <props.icon className="mb-4 h-6 w-6" />
//           <div className="text-sm font-semibold leading-none">{title}</div>
//           <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//             {children}
//           </p>
//         </Link>

// <Link href="#" className="flex items-center gap-2">
//                     <foodItem.icon className="h-5 w-5 mr-2 text-muted-foreground" />
//                     {foodItem.title}
//                   </Link>
