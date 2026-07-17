import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Navbar,
  NavbarMobileMenu,
} from "@forthtilliath/forth-ui/components/navbar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@forthtilliath/shadcn-ui/components/navigation-menu";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Docs", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
];

/**
 * A fixed, floating page header that shrinks and gains a background/border
 * once the page scrolls — pairs with `NavigationMenu` (desktop) and
 * `NavbarMobileMenu` (mobile).
 */
const meta = {
  title: "forth-ui/Navbar",
  component: Navbar,
} satisfies Meta<typeof Navbar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Scroll the canvas to see the navbar shrink and gain a background/border
 * (`data-scrolled="true"`).
 */
export const Default: Story = {
  render: () => (
    <div className="h-[150vh]">
      <Navbar>
        <span className="font-semibold">Forth UI</span>
        <NavigationMenu className="hidden md:flex" viewport={false}>
          <NavigationMenuList>
            {NAV_ITEMS.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink href={item.href}>
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <NavbarMobileMenu items={NAV_ITEMS} />
      </Navbar>
      <p className="text-muted-foreground pt-24 text-center text-sm">
        Scroll down to see the navbar shrink.
      </p>
    </div>
  ),
};
