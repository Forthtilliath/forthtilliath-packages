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

interface RenderProps {
  href: string;
  children: React.ReactNode;
}
interface Props {
  logo?: React.ReactNode;
  render: ({ href, children }: RenderProps) => React.ReactNode;
  items: {
    id: string | number;
    href: string;
    label: string;
  }[];
}

export function Navbar01({ logo, render, items }: Props) {
  return (
    <div className="min-h-screen bg-muted">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {logo}

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" render={render} items={items} />

          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button>Get Started</Button>

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
    </div>
  );
}

type NavMenuProps = NavigationMenuProps & Pick<Props, "items" | "render">;
const NavMenu = ({ render, items, ...props }: NavMenuProps) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
      <NavigationMenuItem>
        <NavigationMenuLink asChild></NavigationMenuLink>
      </NavigationMenuItem>

      {items.map((item) => (
        <NavigationMenuItem key={item.id}>
          <NavigationMenuLink asChild>
            {render({ href: item.href, children: item.label })}
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);

export default Navbar01;
