import type { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { Menu } from "lucide-react";

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

export interface Item {
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
    <nav className="fixed top-6 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
      <div className="h-full flex items-center justify-between mx-auto px-4">
        {logo}

        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" render={render} items={items} />

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="hidden sm:inline-flex rounded-full"
          >
            Sign In
          </Button>
          <Button className="rounded-full">Get Started</Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
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
