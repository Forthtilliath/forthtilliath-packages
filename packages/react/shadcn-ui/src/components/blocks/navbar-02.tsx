import type { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { Menu, SunIcon } from "lucide-react";

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

interface Item {
  href: string;
  label: React.ReactNode;
}
interface Props {
  logo?: React.ReactNode;
  render: (item: Item) => React.ReactNode;
  items: Item[];
}

export function Navbar({ logo, render, items }: Props) {
  return (
    <nav className="h-16 bg-background border-b">
      <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          {logo}

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" render={render} items={items} />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:inline-flex">
            Sign In
          </Button>
          <Button size="icon" variant="outline">
            <SunIcon />
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

      {items.map((item, i) => (
        <NavigationMenuItem key={i}>
          <NavigationMenuLink asChild>
            {render({ href: item.href, label: item.label })}
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);

export default Navbar;
