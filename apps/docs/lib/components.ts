import { CHART_USAGE } from "./chart-recipes";

export type Prop = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

/** The long-form text for a component page. Title and section live in component-index.ts. */
export type ComponentDoc = {
  description: string;
  usage: string;
  props: Prop[];
};

/**
 * What the docs say about each component, keyed by its manifest name. Server only: this is
 * too much text for a client bundle. Files and npm dependencies come from the manifest.
 */
export const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  button: {
    description:
      "Primary action element with 4 variants, 3 sizes, 3 square icon sizes and a loading state. An icon goes in as a child, before or after the label. buttonVariants lives in its own file with no use client, so a server component can style a link as a button.",
    usage: `import { Button } from "@/components/entrepta/button"
import { ArrowRightIcon, GearIcon, RocketLaunchIcon } from "@phosphor-icons/react"

<Button>./projects.sh →</Button>
<Button><RocketLaunchIcon aria-hidden size={14} /> deploy</Button>
<Button variant="secondary">docs <ArrowRightIcon aria-hidden size={14} /></Button>
<Button variant="ghost" size="icon-md" aria-label="Settings">
  <GearIcon aria-hidden size={16} />
</Button>
<Button variant="secondary">$ npx @entrepta/cli@latest init</Button>
<Button variant="ghost">cat contact.txt</Button>
<Button variant="command">npx @entrepta/cli@latest add button</Button>
<Button size="sm" loading>Loading…</Button>`,
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "ghost" | "command"',
        default: '"primary"',
        description: "Visual style variant",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "icon-sm" | "icon-md" | "icon-lg"',
        default: '"md"',
        description:
          "Height and padding. The icon sizes are square: name the button with aria-label",
      },
      {
        name: "loading",
        type: "boolean",
        default: "false",
        description: "Shows spinner and disables the button",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description: "Delegates rendering to child via Radix Slot",
      },
    ],
  },
  badge: {
    description:
      "Inline status chip in 3 variants, 6 colors and 2 sizes, with a dot or an icon. Every variant uses an ink measured for its fill.",
    usage: `import { Badge } from "@/components/entrepta/badge"
import { CheckIcon, GitBranchIcon } from "@phosphor-icons/react"

<Badge variant="soft" color="success" icon={CheckIcon}>passing</Badge>
<Badge variant="outline" color="brand" icon={GitBranchIcon}>main</Badge>
<Badge variant="solid" color="brand">FEATURED</Badge>
<Badge variant="soft" color="success" dot>open to work</Badge>
<Badge variant="outline" color="error">deprecated</Badge>
<Badge variant="soft" color="warning" dot>partial</Badge>`,
    props: [
      {
        name: "variant",
        type: '"solid" | "soft" | "outline"',
        default: '"soft"',
        description: "Fill style",
      },
      {
        name: "color",
        type: '"neutral" | "brand" | "success" | "warning" | "error" | "info"',
        default: '"neutral"',
        description: "Semantic color token",
      },
      {
        name: "size",
        type: '"sm" | "md"',
        default: '"md"',
        description: "Height and padding",
      },
      {
        name: "dot",
        type: "boolean",
        default: "false",
        description: "Renders a colored status dot before the label",
      },
      {
        name: "icon",
        type: "Icon | ReactElement",
        description:
          "A Phosphor icon, or an icon element, before the label, sized to the badge. Wins over dot",
      },
    ],
  },
  avatar: {
    description:
      "A person or a thing, as an image over its initials. The initials are in the server HTML and the image covers them once it loads, so there is no empty circle and no broken image. A presence dot, a square for things, and a group that folds the rest into +N.",
    usage: `import { Avatar, AvatarGroup } from "@/components/entrepta/avatar"
import { RobotIcon } from "@phosphor-icons/react"

<Avatar name="Anna Maria" src="/me.jpg" />
<Avatar name="Anna Maria" size="lg" status="online" />
<Avatar name="Anna Maria" size="xl" emphasis="ring" />
<Avatar name="deploy bot" shape="square" color="brand" icon={RobotIcon} />

// next to a written name, hide it so the name is read once
<Avatar name="Anna Maria" size="sm" aria-hidden /> anna maria

<AvatarGroup max={4} aria-label="contributors">
  {people.map((p) => <Avatar key={p.login} name={p.name} src={p.avatar} />)}
</AvatarGroup>

// on a card, the dot and the overlaps cut out of the card's color
<Card className="[--cutout:var(--bg-card)]">…</Card>`,
    props: [
      {
        name: "name",
        type: "string",
        description:
          "Who or what it is. Gives the initials and the name screen readers hear. Required",
      },
      {
        name: "src",
        type: "string",
        description: "An image. The initials show until it loads, and stay if it fails",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl"',
        default: '"md"',
        description: "24, 32, 48 or 96px. In a group, the group's size unless set here",
      },
      {
        name: "shape",
        type: '"circle" | "square"',
        default: '"circle"',
        description: "A circle for people, a square for things: a team, a bot, a repo",
      },
      {
        name: "color",
        type: '"neutral" | "brand"',
        default: '"neutral"',
        description: "The fill behind the initials. Brand is for you, or what you feature",
      },
      {
        name: "status",
        type: '"online" | "away" | "busy" | "offline"',
        description: "A presence dot in the corner, announced with the name",
      },
      {
        name: "icon",
        type: "Icon | ReactElement",
        description: "A glyph in place of the initials, for a thing rather than a person",
      },
      {
        name: "emphasis",
        type: '"none" | "ring"',
        default: '"none"',
        description: "A brand ring for the active profile, or the person the page is about",
      },
      {
        name: "max",
        type: "number",
        description:
          "How many show before the rest fold into +N. The row never wraps, so set it when the list can grow (AvatarGroup)",
      },
    ],
  },
  input: {
    description:
      "Text field in 3 variants: plain, search (magnifier icon), and command ($ prefix + ⌘K hint). Supports error state and 3 sizes.",
    usage: `import { Input } from "@/components/entrepta/input"

<Input placeholder="project-name" />
<Input variant="search" placeholder="search components…" />
<Input variant="command" placeholder="run command…" />
<Input state="error" defaultValue="HEALTHKIT_KEY" />`,
    props: [
      {
        name: "variant",
        type: '"default" | "search" | "command"',
        default: '"default"',
        description: "Shows prefix/suffix icon",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "Height",
      },
      {
        name: "state",
        type: '"default" | "error"',
        default: '"default"',
        description: "Border color for validation feedback",
      },
    ],
  },
  card: {
    description:
      "Surface container in 4 variants and 3 sizes. Near black with a border that lights up on hover. The header wraps instead of clipping.",
    usage: `import {
  Card, CardHeader, CardLabel, CardMeta, CardTitle,
  CardDescription, CardFooter, CardComment,
  CardTerminalBar, CardTerminalBody,
} from "@/components/entrepta/card"

<Card>
  <CardHeader>
    <CardLabel>latest post</CardLabel>
    <CardMeta>apr 12 · 1 min</CardMeta>
  </CardHeader>
  <CardTitle>
    Plain markdown beats <em>Notion</em>.
  </CardTitle>
  <CardDescription>Two years of notes, back in plain text.</CardDescription>
  <CardFooter>
    <span>read →</span>
    <CardComment>draft</CardComment>
  </CardFooter>
</Card>

<Card variant="terminal">
  <CardTerminalBar>
    <CardLabel>install</CardLabel>
    <CardMeta>v2.0.0</CardMeta>
  </CardTerminalBar>
  <CardTerminalBody>$ npx @entrepta/cli@latest init</CardTerminalBody>
</Card>`,
    props: [
      {
        name: "variant",
        type: '"default" | "featured" | "terminal" | "data"',
        default: '"default"',
        description: "Background and border style",
      },
      {
        name: "size",
        type: '"sm" | "md" | "xl"',
        default: '"md"',
        description: "Padding, gap and radius",
      },
      {
        name: "as",
        type: '"span" | "h2" | "h3"',
        default: '"span"',
        description: "Render CardLabel as a heading (CardLabel only)",
      },
      {
        name: "icon",
        type: "Icon | ReactElement",
        description: "A Phosphor icon, or an icon element, in place of the ◆ (CardLabel only)",
      },
    ],
  },
  dialog: {
    description:
      "Accessible modal on Radix, on the overlay surface. Composed of trigger, overlay, content, header and footer parts.",
    usage: `import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogLabel, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/entrepta/dialog"
import { Button } from "@/components/entrepta/button"

<Dialog>
  <DialogTrigger asChild>
    <Button variant="secondary">$ rm -rf project</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogLabel>danger zone</DialogLabel>
      <DialogTitle>
        Delete <em>project-name</em>?
      </DialogTitle>
      <DialogDescription>This cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="ghost">Cancel</Button>
      <Button>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    props: [
      {
        name: "icon",
        type: "Icon | ReactElement",
        description:
          "In place of the ◆ (DialogLabel). From a server file, pass an element: icon={<RobotIcon />}",
      },
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback when open state changes",
      },
      {
        name: "modal",
        type: "boolean",
        default: "true",
        description: "Whether to block interactions behind overlay",
      },
    ],
  },
  popover: {
    description:
      "A panel anchored to a trigger, for content you work in: a calendar, a filter, a list of notifications. A Tooltip only shows text and a Dropdown is a menu of actions. It stands on the same surface as the rest of the overlay family. Focus moves in on open and back to the trigger on Esc.",
    usage: `import { Popover, PopoverContent, PopoverTrigger } from "@/components/entrepta/popover"

<Popover>
  <PopoverTrigger asChild>
    <Button variant="secondary">filters</Button>
  </PopoverTrigger>
  {/* a dialog to screen readers: name it when it has no heading */}
  <PopoverContent aria-label="Filters" className="w-72">
    …
  </PopoverContent>
</Popover>`,
    props: [
      {
        name: "open / onOpenChange",
        type: "boolean / (open: boolean) => void",
        description: "Controlled state. Leave both out and it manages itself",
      },
      {
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"bottom"',
        description: "Where it opens. It flips when there is no room (PopoverContent)",
      },
      {
        name: "align",
        type: '"start" | "center" | "end"',
        default: '"start"',
        description: "Alignment against the trigger (PopoverContent)",
      },
      {
        name: "modal",
        type: "boolean",
        default: "false",
        description: "Traps focus and blocks the page behind it",
      },
    ],
  },
  sheet: {
    description:
      "A panel from the edge of the screen, to create or edit something without losing the list, the filters and the scroll behind it. From the right on a desktop, from the bottom below 640px. The title is required and names it. With unsaved changes, closing asks first, inside the sheet, with focus on keeping them.",
    usage: `import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/entrepta/sheet"

<Sheet dirty={form.formState.isDirty}>
  <SheetTrigger asChild>
    <Button>new entry</Button>
  </SheetTrigger>
  <SheetContent
    title="New entry"
    description="It lands at the top of the list."
    footer={
      <>
        <SheetClose asChild><Button variant="ghost">cancel</Button></SheetClose>
        <Button type="submit" form="entry">save</Button>
      </>
    }
  >
    <form id="entry">…</form>
  </SheetContent>
</Sheet>`,
    props: [
      {
        name: "dirty",
        type: "boolean",
        default: "false",
        description: "Unsaved changes: Esc, a click outside and the × ask before closing",
      },
      {
        name: "side",
        type: '"right" | "bottom"',
        default: '"right"',
        description: "right becomes a bottom sheet below 640px (SheetContent)",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "360, 480 or 640px wide on a desktop (SheetContent)",
      },
      {
        name: "title",
        type: "ReactNode",
        description: "The heading and the sheet's name. Required (SheetContent)",
      },
      {
        name: "footer",
        type: "ReactNode",
        description: "Actions pinned to the bottom while the body scrolls (SheetContent)",
      },
      {
        name: "discardPrompt, keepLabel, discardLabel",
        type: "ReactNode, string, string",
        description: "The words of the question, for another language (SheetContent)",
      },
      {
        name: "container",
        type: "HTMLElement | null",
        description:
          "Where it renders (SheetContent), such as a device frame. Give that element a transform",
      },
    ],
  },
  progress: {
    description:
      "How far along something is: a bar, a bar in steps, or a ring. A real progressbar, with its value in words for screen readers. It fills once it is on screen: the bar as a trail of light with a glowing head, the steps one after another, the ring with a soft glow, and the xl ring holds the value in its center. With reduced motion it is simply full. The fill slides on transform. It is the brand color by default; a status is something you state with tone, such as over budget, since a low value is not an error on its own. Indeterminate, it runs the skeleton's band, and stands still as a faint fill without motion.",
    usage: `import { Progress } from "@/components/entrepta/progress"

<Progress label="groceries" value={spent} max={budget} showValue />
<Progress label="months saved" value={9} max={12} segments={12} showValue />
<Progress variant="ring" size="xl" aria-label="emergency fund" value={62} showValue />
<Progress aria-label="syncing" indeterminate />`,
    props: [
      { name: "value, max", type: "number", default: "0, 100", description: "Clamped into range" },
      { name: "variant", type: '"bar" | "ring"', default: '"bar"', description: "A bar or a ring" },
      { name: "segments", type: "number", description: "Split the bar into steps" },
      { name: "label", type: "ReactNode", description: "Shown above, and the bar's name" },
      {
        name: "showValue",
        type: "boolean | ReactNode",
        default: "false",
        description: "The value beside the label",
      },
      {
        name: "valueText",
        type: "string",
        default: '"75%" or "9 of 12"',
        description: "What screen readers hear",
      },
      { name: "indeterminate", type: "boolean", default: "false", description: "No known end" },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl"',
        default: '"md"',
        description: "4 to 12px bar; 16, 24, 40 or 72px ring, the value centered in xl",
      },
      {
        name: "tone",
        type: '"brand" | "success" | "warning" | "error"',
        default: '"brand"',
        description: "A status you state, never set by the value",
      },
    ],
  },
  accordion: {
    description:
      "Sections that open in place: a category and its entries, a question and its answer. Each header is a heading with a button in it, and up and down move between headers. A trailing value, such as an Amount, is part of the header's name; actions sit beside the button, outside it, so a click on them does not toggle the section. The panel opens to its height in CSS.",
    usage: `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/entrepta/accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="home">
    <AccordionTrigger
      trailing={<Amount value={-192380} tone="neutral" />}
      actions={<Button variant="ghost" size="icon-sm" aria-label="Edit home">…</Button>}
    >
      home
    </AccordionTrigger>
    <AccordionContent>…</AccordionContent>
  </AccordionItem>
</Accordion>`,
    props: [
      {
        name: "type",
        type: '"single" | "multiple"',
        description: "One open at a time, or several. collapsible lets the open one close",
      },
      {
        name: "value, defaultValue, onValueChange",
        type: "string | string[]",
        description: "Controlled or not",
      },
      {
        name: "trailing",
        type: "ReactNode",
        description: "On AccordionTrigger: a value on the right",
      },
      { name: "actions", type: "ReactNode", description: "On AccordionTrigger: buttons beside it" },
      {
        name: "headingLevel",
        type: "2 | 3 | 4",
        default: "3",
        description: "On AccordionTrigger: the header's level in the page",
      },
    ],
  },
  dropdown: {
    description:
      "Context menu on Radix, on the overlay surface. The highlighted row takes the brand tint and its icon and shortcut turn brand. Items, icons, labels, shortcuts, checkbox and radio items, submenus and keyboard navigation.",
    usage: `import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuLabel, DropdownMenuShortcut,
  DropdownMenuDestructiveItem,
} from "@/components/entrepta/dropdown"
import { GearIcon, UserIcon } from "@phosphor-icons/react"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="secondary">~/options ↓</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>account</DropdownMenuLabel>
    <DropdownMenuItem>
      <UserIcon aria-hidden size={14} /> profile.tsx
      <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <GearIcon aria-hidden size={14} /> settings.json
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuDestructiveItem>rm -rf session</DropdownMenuDestructiveItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback when open state changes",
      },
      {
        name: "side",
        type: '"top" | "bottom" | "left" | "right"',
        default: '"bottom"',
        description: "Placement relative to trigger (on DropdownMenuContent)",
      },
      {
        name: "align",
        type: '"start" | "center" | "end"',
        default: '"start"',
        description: "Alignment along the trigger (on DropdownMenuContent)",
      },
    ],
  },
  tooltip: {
    description:
      "Hover popover on Radix, on the overlay surface like every other overlay. Wrap your app in TooltipProvider once at the root. TooltipShortcut is a Kbd.",
    usage: `import {
  TooltipProvider, Tooltip, TooltipTrigger,
  TooltipContent, TooltipShortcut,
} from "@/components/entrepta/tooltip"

// In root layout:
<TooltipProvider>
  {children}
</TooltipProvider>

// Usage:
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="sm">⌘K</Button>
  </TooltipTrigger>
  <TooltipContent>
    open command palette <TooltipShortcut>⌘K</TooltipShortcut>
  </TooltipContent>
</Tooltip>`,
    props: [
      {
        name: "delayDuration",
        type: "number",
        default: "200",
        description: "Delay in ms before tooltip opens (TooltipProvider)",
      },
      {
        name: "side",
        type: '"top" | "bottom" | "left" | "right"',
        default: '"top"',
        description: "Placement relative to trigger (TooltipContent)",
      },
      {
        name: "sideOffset",
        type: "number",
        default: "8",
        description: "Gap in px from trigger (TooltipContent)",
      },
    ],
  },
  kbd: {
    description:
      "One look for every keyboard hint: a key cap chip, or plain text for rows that already have a surface. Inside a highlighted menu or palette row it takes the brand ink. Dropdown, CommandPalette, Tooltip and Input all use it.",
    usage: `import { Kbd } from "@/components/entrepta/kbd"

<Kbd>⌘K</Kbd>
<Button variant="secondary">search <Kbd>/</Kbd></Button>
<span><Kbd>⌘</Kbd>+<Kbd>⇧</Kbd>+<Kbd>P</Kbd></span>

// in a row with its own surface, such as a menu item
<Kbd variant="plain">⌘P</Kbd>`,
    props: [
      {
        name: "variant",
        type: '"chip" | "plain"',
        default: '"chip"',
        description: "A bordered key cap, or bare text",
      },
    ],
  },
  tabs: {
    description:
      'Editor file tabs. Tabs switches a panel in place; TabNav is a row of route links. One brand underline travels to the active tab, a Phosphor icon fills when active and grows on hover, and the active tab can show a close button. variant="window" makes either row the editor\'s title bar.',
    usage: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/entrepta/tabs"
import { FileTsxIcon, FileMdIcon, BracketsCurlyIcon } from "@phosphor-icons/react"

<Tabs defaultValue="home">
  <TabsList>
    <TabsTrigger value="home" icon={FileTsxIcon} onClose={() => {}}>home.tsx</TabsTrigger>
    <TabsTrigger value="about" icon={FileMdIcon} onClose={() => {}}>about.md</TabsTrigger>
    <TabsTrigger value="stack" icon={BracketsCurlyIcon} onClose={() => {}}>stack.json</TabsTrigger>
  </TabsList>
  <TabsContent value="home" className="p-5">…</TabsContent>
  <TabsContent value="about" className="p-5">…</TabsContent>
  <TabsContent value="stack" className="p-5">…</TabsContent>
</Tabs>

// Without an icon, the active tab gets a ◆
<TabsTrigger value="home">home.tsx</TabsTrigger>

// Tabs that are routes, as the editor's title bar:
// pass active, render your router's link with asChild
import { TabNav, TabNavLink } from "@/components/entrepta/tabs"

<TabNav aria-label="Pages" variant="window" end={<span>main</span>}>
  <TabNavLink asChild active={pathname === "/"} icon={HouseLineIcon}>
    <Link href="/">home.tsx</Link>
  </TabNavLink>
  <TabNavLink asChild active={pathname === "/about"} icon={UserSquareIcon}>
    <Link href="/about">about.md</Link>
  </TabNavLink>
</TabNav>`,
    props: [
      {
        name: "defaultValue",
        type: "string",
        description: "Initially active tab (uncontrolled)",
      },
      {
        name: "value",
        type: "string",
        description: "Controlled active tab",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        description: "Callback when active tab changes",
      },
      {
        name: "variant",
        type: '"strip" | "window"',
        default: '"strip"',
        description: "window adds the window dots and shows end as meta (TabsList, TabNav)",
      },
      {
        name: "end",
        type: "ReactNode",
        description:
          "Pinned right, outside the scroller. Meta from 768px in a window (TabsList, TabNav)",
      },
      {
        name: "icon",
        type: "ReactNode | Icon",
        description:
          "An element, or a Phosphor icon that fills when active and grows on hover. Defaults to ◆",
      },
      {
        name: "onClose",
        type: "() => void",
        description: "Shows a close button on the active tab",
      },
      {
        name: "active",
        type: "boolean",
        default: "false",
        description: "Marks the current route (TabNavLink)",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description: "Renders your router's link (TabNavLink)",
      },
    ],
  },
  "status-bar": {
    description:
      "Bottom bar on the brand color, pinned to the viewport or placed in your layout. Left and right slots for status items. Hidden below 640px.",
    usage: `import {
  StatusBar, StatusBarItem, StatusBarSeparator,
} from "@/components/entrepta/status-bar"

// In root layout:
<StatusBar
  left={
    <>
      <StatusBarItem icon={<GitBranchIcon />}>main</StatusBarItem>
      <StatusBarSeparator />
      <StatusBarItem>0 errors</StatusBarItem>
    </>
  }
  right={
    <>
      <StatusBarItem>TypeScript</StatusBarItem>
      <StatusBarSeparator />
      <StatusBarItem>UTF-8</StatusBarItem>
    </>
  }
/>`,
    props: [
      {
        name: "position",
        type: '"fixed" | "static"',
        default: '"fixed"',
        description: "Pinned to the viewport, or a row in your own layout",
      },
      {
        name: "left",
        type: "ReactNode",
        description: "Content for the left slot",
      },
      {
        name: "right",
        type: "ReactNode",
        description: "Content for the right slot",
      },
      {
        name: "icon",
        type: "ReactNode",
        description: "Optional icon prefix (StatusBarItem)",
      },
    ],
  },
  "top-nav": {
    description:
      "Horizontal navigation with left/center/right slots. Compose with TopNavLogo, TopNavLogoMark (brand tile), TopNavBreadcrumb, TopNavMenu, and TopNavLink. Links support active and external states.",
    usage: `import {
  TopNav, TopNavLogo, TopNavLogoMark,
  TopNavBreadcrumb, TopNavSeparator,
  TopNavMenu, TopNavLink,
} from "@/components/entrepta/top-nav"

<TopNav
  left={
    <>
      <TopNavLogo>
        <TopNavLogoMark>e</TopNavLogoMark>
        entrepta
      </TopNavLogo>
      <TopNavBreadcrumb>
        <TopNavSeparator />
        <span>docs</span>
        <TopNavSeparator />
        <span className="here">button</span>
      </TopNavBreadcrumb>
    </>
  }
  right={
    <TopNavMenu>
      <TopNavLink href="/" active>home</TopNavLink>
      <TopNavLink href="/docs">docs</TopNavLink>
      <TopNavLink href="https://github.com" external>github</TopNavLink>
    </TopNavMenu>
  }
/>`,
    props: [
      {
        name: "left",
        type: "ReactNode",
        description: "Left slot. Logo and breadcrumb.",
      },
      {
        name: "center",
        type: "ReactNode",
        description: "Centered slot. Hidden on mobile.",
      },
      {
        name: "right",
        type: "ReactNode",
        description: "Right slot. Actions and menu.",
      },
    ],
  },
  "theme-switcher": {
    description:
      "Floating theme and dark/light picker, with the same panel, labels and rows as a dropdown. Several on one page stay in step. Drives data-theme and data-mode on <html> and remembers the choice. A switch lands all at once, crossfaded where the browser has view transitions. It needs every theme in your CSS: run init with --themes=all. ThemeScript sets the attributes before paint; add suppressHydrationWarning to your <html>.",
    usage: `import {
  ThemeScript, ThemeSwitcher,
} from "@/components/entrepta/theme-switcher"

// Switching needs every theme in your CSS: run init with --themes=all.
const THEMES = [
  { id: "entrepta", label: "entrepta", color: "#7C6BFF", lightColor: "#6656FF" },
  { id: "blossom",  label: "blossom",  color: "#CC2E36", lightColor: "#B02028" },
  { id: "ivy",      label: "ivy",      color: "#35A365", lightColor: "#258A50" },
] as const

// In your root <head>, before React hydrates:
<ThemeScript storageKey="myapp" />

// Anywhere in the tree (usually the root layout):
<ThemeSwitcher
  themes={THEMES}
  defaultTheme="entrepta"
  storageKey="myapp"
/>`,
    props: [
      {
        name: "themes",
        type: "ThemeOption[]",
        description: "List of themes. Each `{ id, label, color, lightColor? }`. Required.",
      },
      {
        name: "defaultTheme",
        type: "string",
        default: "themes[0].id",
        description: "Theme id to use when nothing is stored.",
      },
      {
        name: "defaultMode",
        type: '"dark" | "light"',
        default: '"dark"',
        description: "Initial mode when nothing is stored.",
      },
      {
        name: "storageKey",
        type: "string",
        default: '"entrepta"',
        description: "Prefix for the two localStorage keys (`:theme`, `:mode`).",
      },
      {
        name: "position",
        type: '"bottom-right" | "bottom-left" | "top-right" | "top-left"',
        default: '"bottom-right"',
        description: "Where the floating trigger anchors.",
      },
      {
        name: "hideModeToggle",
        type: "boolean",
        default: "false",
        description: "Hide the dark/light section and the mode label on the trigger.",
      },
      {
        name: "disableMode",
        type: "boolean",
        default: "false",
        description: "Lock mode to `defaultMode`. Useful for dark-only sites.",
      },
    ],
  },
  "mode-toggle": {
    description:
      "Dark/light switch with no theme picker. Drives data-mode on <html> and remembers the choice. The whole page changes at once, crossfaded where the browser has view transitions. Inline by default, or floating with position. ModeScript sets the mode before paint; add suppressHydrationWarning to your <html>.",
    usage: `import {
  ModeScript, ModeToggle,
} from "@/components/entrepta/mode-toggle"

// In your root <head>, before React hydrates:
<ModeScript />

// Inline, drop it in a nav or a toolbar:
<ModeToggle />
<ModeToggle variant="labeled" size="sm" />

// Floating, same anchors as ThemeSwitcher:
<ModeToggle position="bottom-right" />`,
    props: [
      {
        name: "variant",
        type: '"icon" | "labeled"',
        default: '"icon"',
        description: "`labeled` adds the current mode name next to the glyph.",
      },
      {
        name: "size",
        type: '"sm" | "md"',
        default: '"md"',
        description: "Height and padding scale.",
      },
      {
        name: "position",
        type: '"bottom-right" | "bottom-left" | "top-right" | "top-left"',
        description: "Anchors the button to a screen corner. Omit to keep it inline.",
      },
      {
        name: "defaultMode",
        type: '"dark" | "light"',
        default: '"dark"',
        description: "Mode to use when nothing is stored.",
      },
      {
        name: "storageKey",
        type: "string",
        default: '"entrepta"',
        description: "Prefix for the localStorage key (`:mode`). Match it to ThemeSwitcher.",
      },
      {
        name: "onModeChange",
        type: "(mode: ThemeMode) => void",
        description: "Fires after the mode changes.",
      },
    ],
  },
  amount: {
    description:
      "One way to show money across an app, so every screen formats alike and columns line up: mono, tabular figures, the real minus sign. The currency symbol takes the muted ink, so the number reads first. With a tone the sign always shows, since color only reinforces it. Set the locale and currency once on a FormatProvider.",
    usage: `import { Amount } from "@/components/entrepta/amount"
import { FormatProvider } from "@/hooks/use-format"

// once, near the root
<FormatProvider locale="pt-BR" currency="BRL" timeZone="America/Sao_Paulo">
  …
</FormatProvider>

<Amount value={123456} />                       // R$ 1.234,56
<Amount value={-4500} tone="auto" />            // −R$ 45,00, in the error ink
<Amount value={250000} muteCents />             // R$ 2.500,00, cents muted
<Amount value={110000} compact />               // R$ 1,1 mil, the full value on hover
<Amount value={9900} currency="USD" locale="en-US" />`,
    props: [
      {
        name: "value",
        type: "number",
        description: "Integer minor units: 123456 is 1,234.56 in a currency with cents",
      },
      {
        name: "currency / locale",
        type: "string",
        description: "Fall back to the FormatProvider's. A currency is required somewhere",
      },
      {
        name: "tone",
        type: '"auto" | "neutral" | "positive" | "negative"',
        default: '"neutral"',
        description: "auto colors by the sign. Any tone but neutral also shows the sign",
      },
      {
        name: "signDisplay",
        type: '"auto" | "always" | "never"',
        description: "always with a tone, auto without one",
      },
      {
        name: "compact",
        type: "boolean",
        default: "false",
        description:
          "1.2K, for axes and small widgets. Screen readers and hover get the full value",
      },
      {
        name: "muteCents",
        type: "boolean",
        default: "false",
        description: "Cents in the muted ink, for a large value",
      },
    ],
  },
  "icon-tile": {
    description:
      "An icon in a tinted square, so a row is recognized before it is read: a category, an account, a status. Colors are the eight palette steps, the brand and the four statuses, each a pair the contrast test measures. It is decorative unless you name it. A badge in the corner, cut out of the surface, can carry what is behind it, such as a bank.",
    usage: `import { IconTile } from "@/components/entrepta/icon-tile"
import { ForkKnifeIcon } from "@phosphor-icons/react"

<IconTile icon={ForkKnifeIcon} color="chart-3" />
<IconTile icon={ForkKnifeIcon} color="brand" size="lg" />
<IconTile icon={WalletIcon} badge={<Avatar name="Bank" size="sm" />} />`,
    props: [
      {
        name: "icon",
        type: "Icon | ReactElement",
        description: "A Phosphor icon, or an element from a server file",
      },
      {
        name: "color",
        type: '"neutral" | "brand" | "chart-1" … "chart-8" | "success" | "warning" | "error" | "info"',
        default: '"neutral"',
        description: "Store the key, never a hex, so the color follows every theme",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "24, 32 or 40px",
      },
      {
        name: "badge",
        type: "ReactNode",
        description: "Something small in the corner, cut out of --cutout",
      },
    ],
  },
  metric: {
    description:
      "One number and what it means: the label, the value, how it moved and against what. A description list, so a screen reader pairs the label with the value. It has no surface of its own: put it in a Card, or several in a BentoGrid. The value never truncates, since an ellipsis would hide digits: the large size steps down when its container is narrow, and in a very narrow tile pass a compact Amount. With loading it draws its pieces in their final shape.",
    usage: `import { Metric } from "@/components/entrepta/metric"
import { Amount } from "@/components/entrepta/amount"
import { Delta } from "@/components/entrepta/delta"

<Card>
  <Metric
    label="spent this month"
    value={<Amount value={spent} />}
    delta={<Delta current={spent} previous={lastMonth} intent="increase-is-bad" />}
    comparison="vs August"
    hint="2 accounts not synced"
    size="lg"
  />
</Card>`,
    props: [
      { name: "label", type: "ReactNode", description: "What is measured" },
      { name: "value", type: "ReactNode", description: "An Amount, a RollingNumber or text" },
      { name: "delta", type: "ReactNode", description: "A Delta, on the line under the value" },
      { name: "comparison", type: "ReactNode", description: "Against what: vs August" },
      { name: "hint", type: "ReactNode", description: "A short note in the muted ink" },
      { name: "trend", type: "ReactNode", description: "A small chart under the value, 40px tall" },
      { name: "icon", type: "Icon | ReactElement", description: "In place of the ◆" },
      { name: "size", type: '"md" | "lg"', default: '"md"', description: "24px or 40px value" },
      {
        name: "loading",
        type: "boolean",
        default: "false",
        description: "Skeleton pieces in the final shape",
      },
    ],
  },
  chart: {
    description:
      "The frame for a Recharts chart, and five recipes to start from. Series take a palette color by name, so every theme recolors them. Axes are compact, the tooltip shows each value in full, through Amount for money. A legend appears from three series; name one or two in the card. With data and categoryKey, a button shows the same numbers as a Table. The plot mounts when it comes on screen, so its entrance is seen, and holds still with reduced motion. Only horizontal grid lines and no frame: the Card is the frame.",
    usage: CHART_USAGE,
    props: [
      {
        name: "config",
        type: "Record<key, { label, color, format? }>",
        description:
          'color is a palette key ("chart-3", "success") or a CSS color; format is "money", "number" or "percent"; signed puts + and the real minus on every value',
      },
      {
        name: "height",
        type: "number",
        description: "The whole chart, legend and toggle included",
      },
      { name: "label", type: "string", description: "The chart's name: what it shows" },
      {
        name: "description",
        type: "string",
        description: "The trend in words, as the plot's desc",
      },
      {
        name: "legend",
        type: "boolean",
        default: "from three series",
        description: "The legend, built from config",
      },
      {
        name: "data, categoryKey",
        type: "rows, string",
        description: "With both, the View as table button",
      },
      {
        name: "currency, locale",
        type: "string",
        description: "Fall back to the FormatProvider's",
      },
      {
        name: "formatChartValue(value, format, { currency, compact })",
        type: "string",
        description: "For an axis tickFormatter: $2.2K compact, $2,184.50 in full",
      },
      {
        name: "chartGrid, chartXAxis, chartYAxis, chartCursor, chartProjection",
        type: "props",
        description: "Presets to spread on the Recharts parts",
      },
    ],
  },
  "bar-list": {
    description:
      "A ranking in rows: where the money went, which pages people read. Each label sits in full on its own bar, which is as long as its share of the largest, and the value stands at the end. Largest first, the first few with the rest added up. No chart library and no JavaScript of its own, so a server page renders it whole. Past five slices, it reads better than a donut.",
    usage: `import { BarList } from "@/components/entrepta/bar-list"

<BarList
  items={[
    { label: "home", value: 192380, color: "chart-1", href: "/categories/home" },
    { label: "groceries", value: 32050, color: "chart-3" },
    { label: "learning", value: 6200, color: "chart-5" },
  ]}
  max={5}
  showOthers
  format="money"
  linkComponent={Link}
/>`,
    props: [
      {
        name: "items",
        type: "{ label, value, color?, href? }[]",
        description: "color is a palette key or a CSS color",
      },
      { name: "max", type: "number", description: "Show the first this many, largest first" },
      {
        name: "showOthers",
        type: "boolean",
        default: "false",
        description: "Add up the rest in one row",
      },
      {
        name: "format",
        type: '"number" | "money" | "percent"',
        default: '"number"',
        description: "Money from minor units, through Amount",
      },
      {
        name: "color",
        type: "palette key",
        default: '"chart-1"',
        description: "Bars without their own",
      },
      { name: "keepOrder", type: "boolean", default: "false", description: "Keep the order given" },
      {
        name: "linkComponent",
        type: "ElementType",
        default: '"a"',
        description: "For rows with href",
      },
      { name: "labels", type: "{ others? }", description: 'The last row\'s name, "Others (3)"' },
    ],
  },
  stepper: {
    description:
      "Where someone is in a flow of a few steps: onboarding, a setup, an import. An ordered list; the current step is marked for screen readers and takes the ◆, done steps a check, a step that needs attention a warning, and each step's state is read in words. The line to the next step fills when one is done. Below 640px a horizontal stepper keeps only the current label in view. Server safe.",
    usage: `import { Stepper } from "@/components/entrepta/stepper"

<Stepper
  steps={[
    { id: "account", label: "Account" },
    { id: "bank", label: "Connect a bank", description: "Read only" },
    { id: "budget", label: "First budget" },
  ]}
  current="bank"
/>`,
    props: [
      { name: "steps", type: "{ id, label, description? }[]", description: "In order" },
      { name: "current", type: "string", description: "The id of the step in progress" },
      {
        name: "completed",
        type: "string[]",
        default: "every step before current",
        description: "The ids of the steps done",
      },
      {
        name: "errored",
        type: "string[]",
        description: "Steps that need attention; wins over completed",
      },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "A row, or a column with every label",
      },
      {
        name: "labels",
        type: "{ complete?, current?, error?, upcoming? }",
        description: "The state words",
      },
    ],
  },
  "choice-card": {
    description:
      "A choice that needs more than a word: a plan, a way to import, where to start. Each card is the label of a native radio or checkbox, so the arrow keys, one Tab stop and forms come from the browser. The chosen card takes the strong brand border and a check that draws itself in. An option that is off says why. Server safe without onValueChange.",
    usage: `import { ChoiceCard } from "@/components/entrepta/choice-card"

<ChoiceCard
  legend="Plan"
  options={[
    { value: "free", title: "Free", description: "One account" },
    { value: "pro", title: "Pro", description: "Every account", icon: RocketLaunchIcon, badge: <Badge>$4</Badge> },
    { value: "team", title: "Team", disabled: "Coming in October" },
  ]}
  value={plan}
  onValueChange={setPlan}
/>`,
    props: [
      {
        name: "options",
        type: "{ value, title, description?, icon?, badge?, disabled? }[]",
        description: "disabled as text says why",
      },
      {
        name: "legend",
        type: "ReactNode",
        description: "The question; hideLegend keeps it for screen readers",
      },
      {
        name: "type",
        type: '"radio" | "checkbox"',
        default: '"radio"',
        description: "One, or several",
      },
      {
        name: "value, defaultValue, onValueChange",
        type: "string | string[]",
        description: "A string for radio, an array for checkbox",
      },
      { name: "columns", type: "1 | 2 | 3", default: "2", description: "From 640px; one below" },
    ],
  },
  "swatch-picker": {
    description:
      "A color for something the person owns: a category, an account, a tag. One native radio per palette color, so the value is the key, such as chart-3, never a hex, and the color follows every theme. Each swatch is named after the hue it shows in the current theme, since the palette turns with the brand, and the chosen one carries a check. It takes colors of your own too, each standing for an id: the AGENTS.md builder on the home page picks its theme with one.",
    usage: `import { SwatchPicker } from "@/components/entrepta/swatch-picker"

<SwatchPicker legend="Color" value={category.color} onValueChange={setColor} />

// later, anywhere: <IconTile color={category.color} … />`,
    props: [
      {
        name: "legend",
        type: "ReactNode",
        description: "The question; hideLegend keeps it for screen readers",
      },
      {
        name: "value, defaultValue, onValueChange",
        type: '"chart-1" … "chart-8"',
        description: "The palette key",
      },
      {
        name: "options",
        type: "palette keys | { value, color, name }[]",
        default: "the eight palette keys",
        description: "Palette keys, named after their hue, or colors of your own, such as themes",
      },
      {
        name: "names",
        type: "Record<key, string>",
        description: "Names of your own, in place of the hue names",
      },
    ],
  },
  "secret-field": {
    description:
      "A secret to copy once: an API key, a token, a recovery code. Read only and in mono, masked until asked, keeping the prefix and the last four so you can tell keys apart. The real value is not in the page until it is revealed; the copy button copies it either way and is named after what it copies. Copied is said out loud, politely, and a failed copy says so. Expired, the copy goes and an action takes its place.",
    usage: `import { SecretField } from "@/components/entrepta/secret-field"

<SecretField name="API key" value={key} />

<SecretField
  name="API key"
  value={old}
  expired={{ message: "Expired 2 days ago", action: <Button size="sm">new key</Button> }}
/>`,
    props: [
      { name: "value", type: "string", description: "The secret" },
      {
        name: "name",
        type: "string",
        description: 'What it is: the field\'s name and "Copy API key"',
      },
      { name: "mask", type: "boolean", default: "true", description: "Dots until revealed" },
      { name: "expired", type: "{ message, action? } | null", description: "It no longer works" },
      {
        name: "labels",
        type: "{ copy?, copied?, copyFailed?, reveal?, hide? }",
        description: "Every word",
      },
    ],
  },
  redact: {
    description:
      "Hides amounts and other values from view, for a screen share or a café, behind a mask of the same width so nothing moves. Screen readers hear hidden value. Amount, Metric and RollingNumber already follow it; wrap anything else in Redact. Whether it is on is your app's state, passed to RedactProvider. It hides from view, not from the page: the values stay in the HTML, so it is no place for a secret.",
    usage: `import { RedactProvider } from "@/hooks/use-redact"
import { Redact } from "@/components/entrepta/redact"

const [hidden, setHidden] = useState(false)

<RedactProvider hidden={hidden}>
  <Button variant="ghost" aria-pressed={hidden} onClick={() => setHidden(!hidden)}>hide values</Button>
  <Metric label="balance" value={<Amount value={balance} />} />   // hides on its own
  <Redact>{accountNumber}</Redact>                               // anything else
</RedactProvider>`,
    props: [
      { name: "hidden", type: "boolean", description: "On RedactProvider: the app's switch" },
      {
        name: "label",
        type: "string",
        default: '"hidden value"',
        description: "On Redact: what screen readers hear in its place",
      },
      {
        name: "useRedacted()",
        type: "boolean",
        description: "True when a value here should draw a mask, for components of your own",
      },
    ],
  },
  "contribution-grid": {
    description:
      "A year of days as a grid of weeks: workouts, commits, spending. Levels mix the brand into the card, and a day with no data is drawn apart from a day with none. One Tab stop, the arrow keys walk the days, Home and End jump to the ends, and every cell says its day in words. One tooltip, kept inside the viewport. On a phone it scrolls sideways at a size you can read, starting at the latest weeks.",
    usage: `import { ContributionGrid } from "@/components/entrepta/contribution-grid"

<ContributionGrid
  label="Workouts in the last year"
  days={days}                      // { date: "2026-09-12", level: 0-4 | null, state?: "3 workouts" }[]
  range={{ start: "2025-09-29", end: "2026-09-28" }}
  selected={day}
  onSelect={setDay}
/>`,
    props: [
      {
        name: "days",
        type: "{ date, level, state? }[]",
        description: "level 0 to 4, or null for no data; state is the day in words",
      },
      { name: "label", type: "string", description: "What the grid shows, as its name" },
      {
        name: "range",
        type: "{ start, end }",
        description: "Defaults to the first and last day given",
      },
      { name: "onSelect, selected", type: "(date) => void, string", description: "Choosing a day" },
      { name: "renderTooltip", type: "(day) => ReactNode", description: "The tooltip's content" },
      { name: "legend", type: "boolean", default: "true", description: "The Less to More key" },
      {
        name: "loading",
        type: "boolean",
        default: "false",
        description: "A skeleton in its shape",
      },
      { name: "labels", type: "{ levels?, noData?, less?, more? }", description: "Every word" },
    ],
  },
  "file-dropzone": {
    description:
      "A place to drop files, or to choose them: a real file input with its label, so a click, Enter or Space opens the picker. It checks the type and the size and says the limit when a file is over it. There is no upload code: hand the files to yours and pass their progress back in items, which it lists with a Progress, a check when done, or the error. The checks are there to help the person; check the type and the size again on your server.",
    usage: `import { FileDropzone } from "@/components/entrepta/file-dropzone"

<FileDropzone
  accept="image/*,.pdf"
  maxSize={5_000_000}
  multiple
  hint="PNG, JPG or PDF, up to 5 MB"
  onFiles={(files) => files.forEach(upload)}
  items={uploads}                  // { id, name, size, progress?, error? }[]
  onRemove={cancel}
/>`,
    props: [
      { name: "onFiles", type: "(files: File[]) => void", description: "The files that pass" },
      { name: "accept", type: "string", description: 'As the input takes it: "image/*,.pdf"' },
      { name: "maxSize", type: "number", description: "Bytes; a file over it says the limit" },
      { name: "multiple", type: "boolean", default: "false", description: "Several at once" },
      {
        name: "items",
        type: "{ id, name, size, progress?, error? }[]",
        description: "progress from 0 to 1 while it uploads",
      },
      { name: "onRemove", type: "(id) => void", description: "A × on each file" },
      { name: "hint", type: "ReactNode", description: "The line under the title" },
    ],
  },
  "prompt-input": {
    description:
      "Where a question is written. The field grows with the text up to a limit; ⌘↵ or Ctrl↵ sends and ↵ keeps a new line. While a reply streams the send button is a stop button. Suggestions above it send with a click. No model and no network: it hands the text to onSubmit.",
    usage: `import { PromptInput } from "@/components/entrepta/prompt-input"

<PromptInput
  onSubmit={send}
  streaming={busy}
  onStop={stop}
  suggestions={["Spending this month", "Biggest category"]}
  tools={<Button variant="ghost" size="icon-sm" aria-label="Attach">…</Button>}
/>`,
    props: [
      { name: "onSubmit", type: "(text) => void", description: "Trimmed; an empty one never goes" },
      {
        name: "value, defaultValue, onValueChange",
        type: "string",
        description: "Controlled or not",
      },
      { name: "streaming, onStop", type: "boolean, () => void", description: "Send becomes stop" },
      { name: "suggestions", type: "string[]", description: "A click sends one" },
      { name: "tools", type: "ReactNode", description: "Buttons on the left of the toolbar" },
      {
        name: "maxHeight",
        type: "number",
        default: "200",
        description: "Tallest before it scrolls",
      },
      { name: "label", type: "string", default: '"Message"', description: "The field's name" },
    ],
  },
  "chat-thread": {
    description:
      "A conversation, drawn: your messages on the right on the brand tint, replies in full width with a ◆, tool results in a card, a caret while text streams. It follows the bottom only if you are there; scrolled up to read, you stay put and a button offers the latest. Screen readers hear each reply once, when it is done, and never the history. No model and no network: messages in, the thread out.",
    usage: `import { ChatThread } from "@/components/entrepta/chat-thread"

<ChatThread
  className="h-[560px]"
  messages={[
    { id: "1", role: "user", content: "Where did the money go?" },
    { id: "2", role: "assistant", content: text, ...(busy && { status: "streaming" }) },
    { id: "3", role: "tool", name: "spending_by_category", content: <BarList items={rows} /> },
  ]}
  empty={<EmptyState title="Ask about your money" />}
/>`,
    props: [
      {
        name: "messages",
        type: "{ id, role, content, name?, time?, status?, error? }[]",
        description:
          'role is "user", "assistant", "tool" or "system"; status "streaming" or "error"',
      },
      { name: "empty", type: "ReactNode", description: "Before the first message" },
      {
        name: "labels",
        type: "{ thread?, you?, assistant?, latest?, failed? }",
        description: "Every word",
      },
      { name: "className", type: "string", description: "Give it a height: it scrolls inside" },
    ],
  },
  sparkline: {
    description:
      "The shape of a series with no axes: the trend under a Metric, a row in a table. A line in a palette color over a soft fill of the same color, with a dot on the last value. It wipes in from the left once it is on screen and stays still with reduced motion. It is decoration for screen readers, since the Metric beside it already says the number.",
    usage: `import { Sparkline } from "@/components/entrepta/sparkline"

<Metric
  label="spent this month"
  value={<Amount value={spent} />}
  trend={<Sparkline data={dailyTotals} tone="chart-1" />}
/>

<Sparkline data={balance} className="h-28" />   // taller in a hero tile`,
    props: [
      { name: "data", type: "number[]", description: "Oldest first, two or more" },
      {
        name: "tone",
        type: '"chart-1" … "chart-8" | "success" | "error" | "neutral"',
        default: '"chart-1"',
        description: "A palette color, or a status for good or bad news",
      },
      {
        name: "area",
        type: "boolean",
        default: "true",
        description: "The soft fill under the line",
      },
      { name: "dot", type: "boolean", default: "true", description: "The dot on the last value" },
      { name: "className", type: "string", description: "Its height, 40px by default" },
    ],
  },
  delta: {
    description:
      "How a value moved against the one before it: an arrow, a sign and the change, with the direction in words for screen readers. Color only says whether that is good news, so spending going up can be red. A percentage needs a positive base: from zero or below it shows the difference in value. A first value reads new, and a missing one is a dash with the reason in a Tooltip.",
    usage: `import { Delta } from "@/components/entrepta/delta"

<Delta current={124000} previous={110000} intent="increase-is-bad" />  // ↗ +12.7%, red
<Delta current={5000} previous={0} currency="USD" />                      // ↗ +$50.00
<Delta current={null} previous={100} reason="August has not synced" />   // —
<Delta current={958990} previous={812000} variant="pill" />             // in a tinted pill`,
    props: [
      { name: "current, previous", type: "number | null", description: "Minor units for money" },
      {
        name: "format",
        type: '"percent" | "amount" | "number"',
        default: '"percent"',
        description: "The change as a share, in money, or as a plain number",
      },
      {
        name: "intent",
        type: '"increase-is-good" | "increase-is-bad" | "neutral"',
        default: '"increase-is-good"',
        description: "Which way is good news",
      },
      {
        name: "currency, locale",
        type: "string",
        description: "Fall back to the FormatProvider's",
      },
      { name: "reason", type: "string", description: "Why there is nothing to compare" },
      { name: "size", type: '"sm" | "md"', default: '"md"', description: "10px or 12px" },
      {
        name: "variant",
        type: '"text" | "pill"',
        default: '"text"',
        description: "A pill sits on a soft tint of its tone, for a Metric or a tile",
      },
      { name: "labels", type: "{ up?, down?, flat?, new?, none? }", description: "Every word" },
      {
        name: "compareValues(current, previous)",
        type: "{ state, difference, ratio }",
        description: "The same comparison as data",
      },
    ],
  },
  "list-row": {
    description:
      "The standard row of a list: an entry, a subscription, an account, a notification. A leading tile, a title that truncates and shows the rest on hover, a muted meta line, and a trailing value that never truncates. With href or onClick the whole row is the target, through its title, and the actions sit outside it. ListGroup heads a set of rows with a heading that sticks while they scroll, and a total. Rows are set apart by space and hover, not a border each.",
    usage: `import { ListGroup, ListRow } from "@/components/entrepta/list-row"

<ListGroup label="Today" total={<Amount value={-5240} tone="auto" />}>
  <ListRow
    leading={<IconTile icon={CoffeeIcon} color="chart-4" />}
    title="Coffee"
    meta="card · 08:12"
    trailing={<Amount value={-450} />}
    href="/entries/123"
    linkComponent={Link}
    actions={<EntryActions />}
  />
</ListGroup>`,
    props: [
      {
        name: "leading",
        type: "ReactNode",
        description: "An IconTile or an Avatar",
      },
      {
        name: "title / meta",
        type: "ReactNode",
        description: "One line each. Both truncate",
      },
      {
        name: "trailing / trailingMeta",
        type: "ReactNode",
        description: "Usually an Amount, and a line under it. Never truncates",
      },
      {
        name: "href / linkComponent / onClick",
        type: "string / ElementType / () => void",
        description: "Makes the whole row a link or a button, through its title",
      },
      {
        name: "actions",
        type: "ReactNode",
        description: "A Dropdown, outside the row's link",
      },
      {
        name: "selected / muted",
        type: "boolean",
        description: "The brand tint for a bulk pick; softer text for something pending",
      },
      {
        name: "label / total / stickyTop",
        type: "ReactNode / ReactNode / number | string",
        description: "The heading, its total, and how far from the top it sticks (ListGroup)",
      },
    ],
  },
  table: {
    description:
      "A real table: the markup DataTable renders, and all a plain table of figures needs. On a phone it scrolls sideways inside its own box instead of squeezing its columns. With maxHeight it scrolls down there too, and the header stays in view. Numbers go on the right, in tabular figures. No state, so a server page can render it.",
    usage: `import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/entrepta/table"

<Table>
  <TableCaption>September</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>item</TableHead>
      <TableHead align="end">amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>rent</TableCell>
      <TableCell align="end"><Amount value={-180000} /></TableCell>
    </TableRow>
  </TableBody>
</Table>`,
    props: [
      {
        name: "maxHeight",
        type: "number | string",
        description: "Past it the table scrolls in its box, the header held at the top (Table)",
      },
      {
        name: "align",
        type: '"start" | "center" | "end"',
        default: '"start"',
        description: "end for numbers (TableHead, TableCell)",
      },
    ],
  },
  "data-table": {
    description:
      "Records to sort, select and hide columns in, on TanStack Table v9, rendered as a real table. Sorting says its order to screen readers, every row's checkbox names the row, and past 500 rows only the rows in view are rendered. It carries its own states under the header: skeleton rows in the table's shape while loading, an EmptyState when there is nothing yet, another when the filters hide everything, with a button to clear them, and an error with a retry in place of rows that would read as current. Below 640px, show the same data as ListRows.",
    usage: `import { DataTable, dataTableColumns } from "@/components/entrepta/data-table"

const col = dataTableColumns<Entry>()
const columns = col.columns([
  col.accessor("date", { header: "date" }),
  col.accessor("item", { header: "item" }),
  col.accessor("amount", {
    header: "amount",
    cell: (info) => <Amount value={info.getValue()} tone="auto" />,
  }),
])

<DataTable
  aria-label="entries"
  data={entries}
  columns={columns}
  getRowId={(entry) => entry.id}
  numeric={["amount"]}
  selectable
  rowLabel={(entry) => \`Select \${entry.item}\`}
  loading={isLoading}
  error={failed ? { description: failed.message, onRetry: refetch } : null}
  filtered={filters.length > 0}
  onClearFilters={clearFilters}
  empty={{ title: "No entries yet", action: <Button>add an entry</Button> }}
/>`,
    props: [
      {
        name: "data / columns",
        type: "T[] / columns from dataTableColumns<T>()",
        description: "The records, and the columns built with the typed helper",
      },
      {
        name: "numeric",
        type: "string[]",
        description: "Column ids aligned right in tabular figures",
      },
      {
        name: "sorting / onSortingChange / manualSorting",
        type: "SortingState / OnChangeFn / boolean",
        description: "Controlled sorting; manual when the server sorts",
      },
      {
        name: "selectable / rowSelection / rowLabel",
        type: "boolean / RowSelectionState / (row) => string",
        description: "A checkbox per row, named by rowLabel, and one for all",
      },
      {
        name: "columnVisibility",
        type: "ColumnVisibilityState",
        description: "Which columns show",
      },
      {
        name: "loading",
        type: "boolean",
        default: "false",
        description: "Skeleton rows in the table's shape, numbers on the right",
      },
      {
        name: "empty",
        type: "{ title?, description?, action?, icon? }",
        description: "No rows yet: what is missing and the one thing to do",
      },
      {
        name: "filtered / onClearFilters",
        type: "boolean / () => void",
        description: "The filters hide every row: says so and offers to clear them",
      },
      {
        name: "error",
        type: "{ title?, description?, onRetry? } | null",
        description: "The rows did not load: announced, with a retry, instead of the rows",
      },
      {
        name: "labels",
        type: "{ emptyTitle?, filteredTitle?, clearFilters?, errorTitle?, retry?, … }",
        description: "The words of the built-in states, for another language",
      },
      {
        name: "maxHeight",
        type: "number",
        description: "Scrolls in its box; required to virtualize more than 500 rows",
      },
    ],
  },
  "filter-builder": {
    description:
      "Questions about a list, such as category is Groceries and amount over $50, each one an applied FilterPill you can edit or remove. + Filter asks for the field, then the condition and the value, with the control that fits the type: rows or a Combobox for options, an Input for text, a MoneyInput, a Calendar, yes or no. Keep the filters in the URL with serializeFilters and parseFilters. The URL is input, so parseFilters drops anything that does not match a field.",
    usage: `import { FilterBuilder } from "@/components/entrepta/filter-builder"
import { type Filter, matchesFilter, parseFilters, serializeFilters } from "@/lib/filters"

const FIELDS = [
  { id: "category", label: "Category", type: "enum", options: CATEGORIES },
  { id: "note", label: "Note", type: "text" },
  { id: "amount", label: "Amount", type: "amount", currency: "USD" },
  { id: "date", label: "Date", type: "date" },
  { id: "recurring", label: "Recurring", type: "boolean" },
] as const

const [filters, setFilters] = useState<Filter[]>(() =>
  parseFilters(new URLSearchParams(location.search).getAll("filter"), FIELDS)
)

<FilterBuilder fields={FIELDS} value={filters} onValueChange={setFilters} />

// in the browser, or send serializeFilters(filters) to your API
const rows = entries.filter((row) => filters.every((f) => matchesFilter(row[f.field], f)))`,
    props: [
      {
        name: "fields",
        type: "{ id, label, type, options?, currency?, icon? }[]",
        description:
          'type is "enum", "text", "amount", "date" or "boolean". An id is letters, digits, - and _',
      },
      {
        name: "value",
        type: "{ field, op, value }[]",
        description: "Amounts in minor units, days as YYYY-MM-DD",
      },
      {
        name: "onValueChange",
        type: "(filters) => void",
        description: "Every add, edit and removal",
      },
      {
        name: "labels",
        type: "Partial<labels>",
        description: "Every word, the conditions under labels.ops",
      },
      {
        name: "serializeFilters(filters)",
        type: "string[]",
        description: "One field:op:value string each, for params.append",
      },
      {
        name: "parseFilters(values, fields)",
        type: "Filter[]",
        description:
          "Back from the URL. Drops unknown fields, wrong conditions, bad values and repeats",
      },
      {
        name: "matchesFilter(value, filter)",
        type: "boolean",
        description: "For lists filtered in the browser. Text ignores case and accents",
      },
    ],
  },
  "empty-state": {
    description:
      "A list or a widget with nothing in it. It fits inside a Card, where ChromeMessage takes the whole page. It says what is missing and offers the one thing to do: create or connect when there is nothing yet, clear the filters when a filter found nothing.",
    usage: `import { EmptyState } from "@/components/entrepta/empty-state"

<EmptyState
  icon={TrayIcon}
  title="No entries this month"
  description="Add one, or connect an account to bring them in."
  action={<Button>add an entry</Button>}
/>

<EmptyState
  size="sm"
  title="Nothing for this filter"
  action={<Button variant="ghost" onClick={clear}>clear filters</Button>}
/>`,
    props: [
      {
        name: "title",
        type: "ReactNode",
        description: "What is missing, in the reader's words. Required",
      },
      {
        name: "description",
        type: "ReactNode",
        description: "The next step, not a welcome",
      },
      {
        name: "icon / action",
        type: "Icon | ReactElement / ReactNode",
        description: "A tile above, and one action below",
      },
      {
        name: "size",
        type: '"sm" | "md"',
        default: '"md"',
        description: "sm for a widget",
      },
    ],
  },
  alert: {
    description:
      "A notice that stays on the page until it is dealt with: partial data, a connection that needs attention, rows that could not be read. A Toast leaves on its own and a ChromeMessage takes the page. The status is in an icon tile and the corner glow, never a colored edge, and each has its own shape. An error is announced at once; the rest waits its turn.",
    usage: `import { Alert } from "@/components/entrepta/alert"

<Alert tone="warning" title="Partial data" action={<ArrowLink href="/sync">sync now</ArrowLink>}>
  Two accounts have not synced today.
</Alert>

<Alert tone="error" title="The import stopped" onDismiss={() => setOpen(false)}>
  Row 14 has no date. Fix it and import again.
</Alert>`,
    props: [
      {
        name: "tone",
        type: '"info" | "success" | "warning" | "error"',
        default: '"info"',
        description: "error is role=alert and interrupts; the rest are role=status",
      },
      {
        name: "title / children",
        type: "ReactNode",
        description: "What happened, then the detail and the next step",
      },
      {
        name: "action",
        type: "ReactNode",
        description: "An ArrowLink or a Button",
      },
      {
        name: "onDismiss / dismissLabel",
        type: "() => void / string",
        description: "Only for a notice that can be put away",
      },
    ],
  },
  toast: {
    description:
      "Notification toasts via Sonner, on the overlay surface. The status shows as a tinted icon tile and a glow in the corner, and each status has its own icon shape. Mount <Toaster> once in the root layout, then call toast() anywhere.",
    usage: `import { Toaster } from "@/components/entrepta/toast"
import { toast } from "sonner"

// In root layout:
<Toaster position="bottom-right" />

// Trigger from anywhere:
toast.success("Component copied!")
toast.error("Build failed")
toast.warning("Deprecated API used")
toast("New update available", {
  action: { label: "reload", onClick: () => location.reload() },
})`,
    props: [
      {
        name: "position",
        type: '"top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"',
        default: '"bottom-right"',
        description: "Where toasts appear on screen",
      },
      {
        name: "duration",
        type: "number",
        default: "4000",
        description: "Auto-dismiss delay in ms",
      },
      {
        name: "expand",
        type: "boolean",
        default: "false",
        description: "Always show all toasts expanded",
      },
    ],
  },
  skeleton: {
    description:
      "Shimmer placeholder that respects reduced motion. Offset each piece with delay so a card moves as one wave. For grids of hundreds, use the .skeleton-sweep class instead.",
    usage: `import { Skeleton, SkeletonText } from "@/components/entrepta/skeleton"

// Avatar + text row
<div className="flex items-center gap-3">
  <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
  <SkeletonText lines={2} className="flex-1" />
</div>

// Image card
<Skeleton variant="rect" className="w-full h-40" />`,
    props: [
      {
        name: "variant",
        type: '"line" | "circle" | "rect"',
        default: '"rect"',
        description: "Shape preset",
      },
      {
        name: "delay",
        type: "number",
        default: "0",
        description: "Seconds to offset the shimmer, so a grid of pieces moves as one wave",
      },
      {
        name: "lines",
        type: "number",
        default: "3",
        description: "Number of text lines (SkeletonText only)",
      },
    ],
  },
  "command-palette": {
    description:
      "⌘K command palette built on cmdk, on the overlay surface. Rows highlight like a dropdown: the brand tint, and the icon and shortcut turn brand. A ◆ on each group, and Kbd chips for esc and the footer hints. Use Command alone for an inline list, or inside CommandDialog. Wire the shortcut with useCommandPalette.",
    usage: `import {
  Command, CommandDialog, CommandInput,
  CommandList, CommandGroup, CommandItem, CommandEmpty,
  CommandSeparator, CommandFoot,
} from "@/components/entrepta/command-palette"
import { useCommandPalette } from "@/hooks/use-command-palette"

export function MyPalette() {
  const { open, setOpen } = useCommandPalette()
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="type to filter…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="pages">
            <CommandItem shortcut="⌘1" onSelect={() => router.push("/")}>
              home.tsx
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="actions">
            <CommandItem shortcut="⌘⇧D" onSelect={deploy}>
              Deploy to production
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <CommandFoot />
      </Command>
    </CommandDialog>
  )
}`,
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state (CommandDialog)",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback on close (CommandDialog)",
      },
      {
        name: "placeholder",
        type: "string",
        description: "Input placeholder (CommandInput)",
      },
      {
        name: "shortcut",
        type: "string",
        description: "Keyboard shortcut label (CommandItem)",
      },
      {
        name: "icon",
        type: "ReactNode",
        description: "Icon before label (CommandItem)",
      },
    ],
  },
  "code-block": {
    description:
      "Code container with optional window chrome, filename and language labels, and a copy button that says so when the copy fails. Pass raw code in code, or children for highlighted JSX.",
    usage: `import { CodeBlock } from "@/components/entrepta/code-block"

// Plain copy-paste snippet
<CodeBlock
  code={\`npx @entrepta/cli@latest init --theme=ivy\`}
  filename="install.sh"
  language="bash"
  variant="terminal"
/>

// Custom highlighted body; copy still grabs the raw code
<CodeBlock code={raw} filename="tokens.css" language="css">
  <span className="text-[var(--fg-brand)]">--fg-brand</span>: #7C6BFF;
</CodeBlock>`,
    props: [
      {
        name: "code",
        type: "string",
        description: "Raw code string copied to the clipboard. Required.",
      },
      {
        name: "filename",
        type: "string",
        description: "Label shown on the left of the chrome",
      },
      {
        name: "language",
        type: "string",
        description: "Language tag shown on the right (e.g. bash, tsx, css)",
      },
      {
        name: "meta",
        type: "string",
        description: "Secondary label between filename and language",
      },
      {
        name: "variant",
        type: '"default" | "terminal"',
        default: '"default"',
        description: "`terminal` adds three macOS-style window dots",
      },
      {
        name: "showCopy",
        type: "boolean",
        default: "true",
        description: "Toggle the copy button",
      },
      {
        name: "copyTimeout",
        type: "number",
        default: "1500",
        description: "How long the 'copied' state stays visible (ms)",
      },
    ],
  },
  checkbox: {
    description:
      "A native checkbox under a drawn box. The check draws itself in on the brand fill. Takes a label, a muted description, and an indeterminate state for a select all.",
    usage: `import { Checkbox } from "@/components/entrepta/checkbox"

<Checkbox label="button" defaultChecked />
<Checkbox label="diamond" description="needed by card" checked disabled />
<Checkbox
  label="primitives"
  checked={all}
  indeterminate={some && !all}
  onChange={toggleAll}
/>`,
    props: [
      { name: "label", type: "ReactNode", description: "Clickable label beside the box" },
      {
        name: "description",
        type: "ReactNode",
        description: "Muted line under the label, read as the description",
      },
      {
        name: "indeterminate",
        type: "boolean",
        default: "false",
        description: "The mixed state, a dash on the brand fill",
      },
      { name: "checked", type: "boolean", description: "Controlled state, like a native input" },
    ],
  },
  switch: {
    description:
      "An on/off switch over a native checkbox, so focus, keyboard, forms and screen readers come from the browser.",
    usage: `import { Switch } from "@/components/entrepta/switch"

<Switch label="send me a copy" defaultChecked />
<Switch label="notifications" checked={on} onChange={(e) => setOn(e.target.checked)} />`,
    props: [
      { name: "label", type: "ReactNode", description: "Clickable label next to the switch" },
      { name: "checked", type: "boolean", description: "Controlled state" },
      { name: "defaultChecked", type: "boolean", description: "Uncontrolled starting state" },
      { name: "disabled", type: "boolean", default: "false", description: "Dims and disables" },
    ],
  },
  textarea: {
    description:
      "A multi-line field for prose. Sans for what you type, mono for the placeholder, and an error state.",
    usage: `import { Textarea } from "@/components/entrepta/textarea"

<Textarea placeholder="// what are you building?" />
<Textarea state="error" rows={6} />`,
    props: [
      {
        name: "state",
        type: '"default" | "error"',
        default: '"default"',
        description: "Error sets the border and aria-invalid",
      },
      { name: "rows", type: "number", default: "4", description: "Visible lines" },
    ],
  },
  field: {
    description:
      "Label, control, and error or hint in one column. It wires the control for screen readers: id, aria-describedby and aria-invalid.",
    usage: `import { Field } from "@/components/entrepta/field"
import { Input } from "@/components/entrepta/input"
import { Textarea } from "@/components/entrepta/textarea"

<Field id="email" label="email" required hint="we never share it">
  <Input type="email" required />
</Field>

<Field id="message" label="message" error={errors.message}>
  <Textarea />
</Field>`,
    props: [
      {
        name: "id",
        type: "string",
        description: "The control's id. Error and hint ids derive from it",
      },
      { name: "label", type: "ReactNode", description: "Mono label with a ◆" },
      {
        name: "icon",
        type: "Icon | ReactElement",
        description: "A Phosphor icon, or an icon element, in place of the label's ◆",
      },
      {
        name: "required",
        type: "boolean",
        description: "Adds a brand *. Put required on the control too",
      },
      { name: "error", type: "ReactNode", description: "Replaces the hint, announced as an alert" },
      { name: "hint", type: "ReactNode", description: "Muted line under the control" },
    ],
  },
  "money-input": {
    description:
      "Money typed without a wrong comma or point. By default it types like a cash machine: digits enter from the right, so nobody hunts for the decimal key, and the caret stays at the end. Free entry takes the text as typed and formats it on blur. Pasting R$ 1.234,56, €1,234.56 or 1234.5 works either way. The value is an integer in the currency's smallest unit, never a float.",
    usage: `import { MoneyInput } from "@/components/entrepta/money-input"
import { Field } from "@/components/entrepta/field"

const [price, setPrice] = useState<number | null>(null)

<Field id="price" label="price" error={error}>
  <MoneyInput currency="EUR" value={price} onValueChange={setPrice} size="lg" />
</Field>

// with React Hook Form
<Controller
  name="amount"
  control={control}
  render={({ field }) => (
    <MoneyInput currency="EUR" value={field.value} onValueChange={field.onChange} />
  )}
/>`,
    props: [
      {
        name: "value / onValueChange",
        type: "number | null",
        description: "Integer minor units: 123456 is 1,234.56 in euros. null when empty",
      },
      {
        name: "currency",
        type: "string",
        description: "ISO 4217. Falls back to the FormatProvider's",
      },
      {
        name: "locale",
        type: "string",
        description:
          "Separators and the symbol's side. Falls back to the FormatProvider's, then en-US",
      },
      {
        name: "entry",
        type: '"cents-first" | "free"',
        default: '"cents-first"',
        description: "Digits from the right, or free text formatted on blur",
      },
      {
        name: "allowNegative",
        type: "boolean",
        default: "false",
        description: "Most amounts take their sign from elsewhere, such as expense or income",
      },
      {
        name: "size",
        type: '"md" | "lg"',
        default: '"md"',
        description: "lg for the main value of a form",
      },
    ],
  },
  select: {
    description:
      "A value picked from a short list, in a form. A Dropdown is a menu of actions; this is a field with a value, the look of an Input and the rows of every other menu. Inside a Field it takes the label and the error. For a long list, or one to search, use Combobox.",
    usage: `import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/entrepta/select"

<Field id="size" label="export size">
  <Select value={size} onValueChange={setSize}>
    <SelectTrigger>
      <SelectValue placeholder="Pick a size…" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>phone</SelectLabel>
        <SelectItem value="story" hint="1080×1920">story</SelectItem>
        <SelectItem value="square" hint="1080×1080">square</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</Field>`,
    props: [
      {
        name: "value / onValueChange",
        type: "string / (value: string) => void",
        description: "Controlled value. defaultValue for uncontrolled",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "The trigger's height, like an Input (SelectTrigger)",
      },
      {
        name: "hint",
        type: "ReactNode",
        description: "A short note on the right of a row, left out of the trigger (SelectItem)",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "On the root for all of it, on an item for one row",
      },
    ],
  },
  combobox: {
    description:
      "A value picked from a long list you can search: a time zone, a category, a set of tags. Options come as data, in groups, with keywords that find them. It takes one value or several, can create what was typed, and marks an option picked for the person, such as by a model, so they confirm or change it. On the overlay surface, with the command palette's rows.",
    usage: `import { Combobox } from "@/components/entrepta/combobox"

<Field id="zone" label="time zone">
  <Combobox
    options={[
      { value: "America/Sao_Paulo", label: "São Paulo", group: "Americas", keywords: ["brazil"] },
      { value: "Europe/Lisbon", label: "Lisbon", group: "Europe", hint: "UTC+1" },
    ]}
    value={zone}
    onValueChange={setZone}
    searchPlaceholder="Search time zones…"
    emptyText="No time zones match"
  />
</Field>

// several values, created on the spot
<Combobox
  aria-label="tags"
  multiple
  creatable
  onCreate={(label) => addTag(label)}   // returns the new value
  options={tags}
  value={chosen}
  onValueChange={setChosen}
/>`,
    props: [
      {
        name: "options",
        type: "{ value; label; group?; hint?; keywords?; suggested?; disabled? }[]",
        description: "The list. group is the heading an option sits under",
      },
      {
        name: "value / onValueChange",
        type: "string | null, or string[] with multiple",
        description: "Controlled. With multiple, each pick toggles and the list stays open",
      },
      {
        name: "multiple",
        type: "boolean",
        default: "false",
        description: "Several values, shown as two chips and a count",
      },
      {
        name: "creatable / onCreate",
        type: "boolean / (label: string) => string",
        description:
          "Offer to create what was typed when nothing matches it; the returned value is selected",
      },
      {
        name: "renderOption",
        type: "(option) => ReactNode",
        description: "The row's content, such as an IconTile and a name",
      },
      {
        name: "emptyText, searchPlaceholder, createLabel, suggestedLabel",
        type: "ReactNode, string, (query) => ReactNode, string",
        description: "The words, for another language or a more precise message",
      },
    ],
  },
  "segmented-control": {
    description:
      "One choice out of two to five, all in view: expense or income, 3M, 6M or 12M. Picking one clears the other, unlike a FilterPill. It is made of native radio inputs, so the arrow keys move between them and it takes one Tab stop. The indicator slides in CSS alone and stays still with reduced motion.",
    usage: `import { SegmentedControl } from "@/components/entrepta/segmented-control"

<SegmentedControl
  aria-label="kind"
  options={[
    { value: "expense", label: "expense" },
    { value: "income", label: "income" },
  ]}
  value={kind}
  onValueChange={setKind}
/>`,
    props: [
      {
        name: "options",
        type: "{ value; label; icon?; disabled? }[]",
        description: "Two to five. More than that wants a Select",
      },
      {
        name: "value / onValueChange",
        type: "string / (value: string) => void",
        description: "Controlled. defaultValue for uncontrolled",
      },
      {
        name: "size",
        type: '"sm" | "md"',
        default: '"md"',
        description: "28 or 36px tall",
      },
      {
        name: "aria-label",
        type: "string",
        description: "The group's name. Or aria-labelledby",
      },
    ],
  },
  calendar: {
    description:
      "A month of days to pick one day or a range from. Plain YYYY-MM-DD strings in and out, never a Date, so no time zone can move the day. Today is today in the account's zone. Weekdays, months and every label come from Intl in its locale, and the week starts where the locale starts it. Built on react-day-picker with every piece replaced.",
    usage: `import { Calendar } from "@/components/entrepta/calendar"

<Calendar value={day} onValueChange={setDay} min="2025-01-01" max={today} />

<Calendar
  mode="range"
  value={range}                 // { start, end? }
  onValueChange={setRange}
  renderDay={(day) => hasData(day) ? <Dot /> : null}
/>`,
    props: [
      {
        name: "mode",
        type: '"single" | "range"',
        default: '"single"',
        description: "A range is { start, end? }: end is missing until the second click",
      },
      {
        name: "min / max",
        type: "string",
        description: "The first and last days that can be picked",
      },
      {
        name: "isDisabled",
        type: "(day: string) => boolean",
        description: "Days that cannot be picked, such as days with no data",
      },
      {
        name: "renderDay",
        type: "(day: string) => ReactNode",
        description: "Something small under a day's number, such as a coverage dot",
      },
      {
        name: "locale / timeZone",
        type: "string",
        description: "Fall back to the FormatProvider's. timeZone decides which day is today",
      },
      {
        name: "labels",
        type: "{ previous?, next?, today?, selected? }",
        description: "The words screen readers hear, for another language",
      },
    ],
  },
  "date-picker": {
    description:
      'A date picked from a calendar in a popover: a day, a range with quick presets, a month or a year. The trigger has the look of an Input and takes a Field\'s label and error. It closes on a pick, or when a range has both ends. appearance="inline" drops the frame for a toolbar.',
    usage: `import { DatePicker } from "@/components/entrepta/date-picker"

<Field id="when" label="date">
  <DatePicker value={day} onValueChange={setDay} max={today} />
</Field>

<DatePicker
  aria-label="period"
  mode="range"
  value={range}
  onValueChange={setRange}
  presets={[{ label: "This month", value: { start: "2026-09-01", end: "2026-09-30" } }]}
/>

<DatePicker granularity="month" value="2026-09" onValueChange={setMonth} />`,
    props: [
      {
        name: "mode",
        type: '"single" | "range"',
        default: '"single"',
        description: "A range closes the popover once it has both ends",
      },
      {
        name: "granularity",
        type: '"day" | "month" | "year"',
        default: '"day"',
        description: "The value is YYYY-MM-DD, YYYY-MM or YYYY",
      },
      {
        name: "presets",
        type: "{ label; value: { start; end } }[]",
        description: "Ranges one click away, beside the calendar",
      },
      {
        name: "min / max / isDisabled",
        type: "string / string / (day) => boolean",
        description: "What cannot be picked",
      },
      {
        name: "appearance",
        type: '"field" | "inline"',
        default: '"field"',
        description: "inline drops the field's frame",
      },
    ],
  },
  "date-navigator": {
    description:
      "Previous, the period, next and today, to walk through days, months or years. The period opens a DatePicker. At a limit the arrow stays focusable, and its Tooltip says why it goes no further. Put the value in the URL so a link and the back button work.",
    usage: `import { DateNavigator } from "@/components/entrepta/date-navigator"

const [day, setDay] = useUrlFilter(...)   // or any state

<DateNavigator
  aria-label="day"
  value={day}
  onValueChange={setDay}
  min={firstDay}
  max={today}
/>

<DateNavigator aria-label="month" granularity="month" value="2026-09" onValueChange={setMonth} />`,
    props: [
      {
        name: "value / onValueChange",
        type: "string",
        description: "YYYY-MM-DD, YYYY-MM or YYYY, by granularity",
      },
      {
        name: "granularity",
        type: '"day" | "month" | "year"',
        default: '"day"',
        description: "What one step moves",
      },
      {
        name: "min / max",
        type: "string",
        description: "The first and last days there is anything to show",
      },
      {
        name: "labels",
        type: "{ previous?, next?, today?, atStart?, atEnd? }",
        description:
          "The words, for another language. atStart and atEnd say why a step is not possible",
      },
    ],
  },
  "filter-pill": {
    description:
      "A toggle for one filter value, announced as pressed. Pair it with the use-url-filter hook to keep the choice in the URL. With onRemove it is an applied filter instead, such as category is Groceries: always on, with a × named after what it removes. FilterBuilder is made of these.",
    usage: `import { FilterPill } from "@/components/entrepta/filter-pill"
import { useUrlFilter } from "@/hooks/use-url-filter"

const TYPES = ["film", "book"] as const
const [type, setType] = useUrlFilter("type", TYPES)

{TYPES.map((t) => (
  <FilterPill
    key={t}
    label={t}
    count={counts[t]}
    active={type === t}
    onClick={() => setType(type === t ? null : t)}
  />
))}

// applied: the × is named "Remove filter: category is Groceries"
<FilterPill label="category is Groceries" onRemove={() => remove("category")} />`,
    props: [
      { name: "label", type: "ReactNode", description: "Text on the pill" },
      { name: "active", type: "boolean", description: "Pressed state, sets aria-pressed" },
      { name: "count", type: "number", description: "Tally beside the label, at full contrast" },
      {
        name: "icon",
        type: "Icon | ReactElement",
        description: "A Phosphor icon, which fills when active, or an element from a server file",
      },
      {
        name: "onRemove",
        type: "() => void",
        description: "Makes it an applied filter with a ×. onClick then edits it",
      },
      {
        name: "removeLabel",
        type: "string",
        default: '"Remove filter: " + label',
        description: "The ×'s name. Needed when the label is not text",
      },
      {
        name: "useUrlFilter(param, allowed, path?, { replace? })",
        type: "[value, set]",
        description:
          "Hook: reads and writes ?param=value, prerender safe. pushState by default; { replace: true } for a form of options, so back does not walk through each click",
      },
    ],
  },
  sidebar: {
    description:
      "The app's main navigation. As a rail it is 56px of icons, each with a Tooltip. Labeled it is 240px, with group titles, a search slot and a footer, and collapsible folds it back to the rail and remembers the choice. The current item sits on a raised row with its icon filled, and a ◆ travels to it. It keeps the current item in view: centered when the page loads, brought in when it changes, scrolling the list and never the page. A labeled sidebar can be text only; the rail shows a letter for an item with no icon. These docs are built on it, search field included. Routing stays yours: pass active and your link component. Below 768px, use MobileNav.",
    usage: `import { Sidebar } from "@/components/entrepta/sidebar"
import { ChartBarIcon, HouseLineIcon, KeyIcon } from "@phosphor-icons/react"
import Link from "next/link"

const GROUPS = [
  {
    title: "Money",
    items: [
      { id: "home", label: "Overview", href: "/", icon: HouseLineIcon },
      { id: "reports", label: "Reports", href: "/reports", icon: ChartBarIcon },
    ],
  },
  { title: "Settings", items: [{ id: "keys", label: "API keys", href: "/keys", icon: KeyIcon }] },
]

<Sidebar
  variant="labeled"
  groups={GROUPS}
  active={current}
  collapsible
  linkComponent={Link}
  logo={({ collapsed }) => (collapsed ? <Mark /> : <Logo />)}
  search={<SearchButton />}
  footer={<AccountMenu />}
  className="hidden md:flex"
/>

// the rail: icons only
<Sidebar items={ITEMS} active={current} linkComponent={Link} />`,
    props: [
      {
        name: "variant",
        type: '"rail" | "labeled"',
        default: '"rail"',
        description: "Icons only, or icons and labels",
      },
      {
        name: "items",
        type: "{ id, label, href, icon? }[]",
        description: "One list. Icons are Phosphor components or elements; labeled can go without",
      },
      {
        name: "groups",
        type: "{ title?, items }[]",
        description:
          "Titled sections. Folded, a rule parts them and the title stays for screen readers",
      },
      { name: "active", type: "string", description: "Id of the current item" },
      {
        name: "logo, footer",
        type: "ReactNode | ({ collapsed }) => ReactNode",
        description: "Top and bottom. A function gets to fit the 56px rail",
      },
      { name: "search", type: "ReactNode", description: "Under the logo, labeled and open only" },
      {
        name: "collapsible",
        type: "boolean",
        default: "false",
        description: "A button at the bottom folds it to the rail and opens it again",
      },
      {
        name: "collapsed, defaultCollapsed, onCollapsedChange",
        type: "boolean, boolean, (collapsed) => void",
        description: "Controlled or not",
      },
      {
        name: "storageKey",
        type: "string | null",
        default: '"entrepta:sidebar"',
        description:
          "Where the choice is kept in localStorage. Read after hydration; null keeps nothing",
      },
      {
        name: "linkComponent",
        type: "ElementType",
        default: '"a"',
        description: "Your router's link",
      },
      {
        name: "labels",
        type: "{ collapse?, expand? }",
        description: "The toggle's words",
      },
    ],
  },
  "mobile-nav": {
    description:
      "The app's navigation below 768px, where a Sidebar does not fit. Up to four destinations sit in reach of the thumb; the rest, and anything else you pass, go in a More sheet from the bottom, as a grid of icon tiles. The current one fills its icon and a ◆ travels along the top edge, to More when the page is inside it. It clears the home indicator on phones that have one. Name each destination in one short word: five share the width of a phone.",
    usage: `import { MobileNav } from "@/components/entrepta/mobile-nav"
import Link from "next/link"

<MobileNav
  items={ITEMS}
  active={current}
  linkComponent={Link}
  more={<SignOutButton />}
  className="md:hidden"
/>

// leave room for it at the bottom of the page
<main className="pb-[calc(56px+env(safe-area-inset-bottom))] md:pb-0">`,
    props: [
      {
        name: "items",
        type: "{ id, label, href, icon }[]",
        description: "The first four go in the bar, the rest in More",
      },
      { name: "active", type: "string", description: "Id of the current item" },
      {
        name: "more",
        type: "ReactNode",
        description: "Extra content for the More sheet. More shows whenever there is some",
      },
      {
        name: "position",
        type: '"fixed" | "static"',
        default: '"fixed"',
        description: "Fixed to the bottom of the viewport, or in the flow",
      },
      {
        name: "linkComponent",
        type: "ElementType",
        default: '"a"',
        description: "Your router's link",
      },
      { name: "labels", type: "{ more? }", description: "The More button's word" },
      {
        name: "container",
        type: "HTMLElement | null",
        description: "Where the More sheet renders: a device frame in a preview",
      },
    ],
  },
  "bento-grid": {
    description:
      "A dashboard of tiles on the 12 column grid: one column on a phone, 6 from 640px, 12 from 1024px. Each tile is a size container, so what is inside responds to the tile's width, not the window's. The tiles keep the order of the markup, which is the order they are read in, and enter one after another, the stagger capped.",
    usage: `import { BentoGrid, BentoItem } from "@/components/entrepta/bento-grid"
import { SpotlightCard } from "@/components/entrepta/spotlight-card"

<BentoGrid>
  <BentoItem colSpan={{ sm: 6, lg: 8 }} rowSpan={{ lg: 2 }}>
    <SpotlightCard>…</SpotlightCard>
  </BentoItem>
  <BentoItem colSpan={{ sm: 3, lg: 4 }}>
    <SpotlightCard><Metric … /></SpotlightCard>
  </BentoItem>
</BentoGrid>`,
    props: [
      {
        name: "colSpan",
        type: "{ sm?: 1-6, lg?: 1-12 }",
        default: "{ sm: 3, lg: 4 }",
        description: "On BentoItem. A breakpoint left out spans the full row",
      },
      {
        name: "rowSpan",
        type: "1-4 | { sm?, lg? }",
        description: "On BentoItem. A number applies from 640px up",
      },
      {
        name: "reveal",
        type: "boolean",
        default: "true",
        description: "On BentoItem: the entrance",
      },
      {
        name: "--bento-row",
        type: "CSS length",
        default: "120px",
        description: "The shortest row",
      },
    ],
  },
  "page-outline": {
    description:
      "A sticky outline of the page's sections that follows the scroll. Shown from 1100px up. Works with the window or your own scroll container.",
    usage: `import { PageOutline } from "@/components/entrepta/page-outline"

<PageOutline
  file="about.md"
  items={[
    { id: "intro", label: "intro", level: 1 },
    { id: "career", label: "career", level: 2, count: 4 },
  ]}
  scrollContainer={() => document.querySelector("main")}
/>`,
    props: [
      {
        name: "items",
        type: "{ id, label, level, count? }[]",
        description: "One per section id on the page",
      },
      { name: "file", type: "string", description: "Name in the chip at the top" },
      { name: "footer", type: "ReactNode", description: "Lines under the list" },
      {
        name: "scrollContainer",
        type: "() => HTMLElement | null",
        description: "What scrolls, when it is not the window",
      },
      {
        name: "offset",
        type: "number",
        default: "24",
        description: "Space above a heading after a jump",
      },
    ],
  },
  "sect-head": {
    description:
      "The $ command rule that opens a section, over a dashed line with meta on the right. The row wraps and each half stays whole.",
    usage: `import { SectHead } from "@/components/entrepta/sect-head"

<SectHead id="work" cmd="ls ./work --featured" meta="4 projects" />`,
    props: [
      { name: "cmd", type: "string", description: "The command after the $" },
      { name: "meta", type: "ReactNode", description: "Right side" },
      { name: "id", type: "string", description: "Put on the heading, for anchors" },
      { name: "as", type: '"h2" | "h3" | "span"', default: '"h2"', description: "Heading level" },
    ],
  },
  "doc-parts": {
    description:
      "The pieces a long-form page is written in: DocLabel, Section, DisplayH2, Prose, Em and Strong. No entrance built in, so they never pull in motion.",
    usage: `import { DisplayH2, DocLabel, Em, Prose, Section, Strong } from "@/components/entrepta/doc-parts"

<Section id="about" variant="first">
  <DocLabel>about</DocLabel>
  <DisplayH2>Engineer, <em>mostly</em>.</DisplayH2>
  <Prose>
    I build <Strong>design systems</Strong> and ship them as <Em>copy-paste</Em> code.
  </Prose>
</Section>`,
    props: [
      {
        name: "level",
        type: '"#" | "##"',
        default: '"#"',
        description: "Markdown prefix (DocLabel)",
      },
      {
        name: "variant",
        type: '"default" | "first"',
        default: '"default"',
        description: "The first section has no rule above it (Section)",
      },
    ],
  },
  "chrome-message": {
    description:
      "The surface for 404 and error screens: a $ command, an output line, a serif title, a note and an action. No hooks, so a server component can render it.",
    usage: `import { ChromeMessage } from "@/components/entrepta/chrome-message"

// app/not-found.tsx
export default function NotFound() {
  return (
    <ChromeMessage
      command="cat ./this-page"
      output="cat: ./this-page: No such file or directory"
      title="Page not found."
      note="it moved, or it never existed"
      action={<Link href="/">go home</Link>}
    />
  )
}

// app/error.tsx: an error boundary is a client component
"use client"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ChromeMessage
      accent="error"
      command="npm run page"
      title="Something broke."
      note="the error was logged"
      action={<Button onClick={reset}>try again</Button>}
    >
      {error.digest && <p className="font-mono text-mono-sm">digest: {error.digest}</p>}
    </ChromeMessage>
  )
}`,
    props: [
      { name: "command", type: "string", description: "The command after the $" },
      {
        name: "accent",
        type: '"brand" | "error"',
        default: '"brand"',
        description: "Color of the $",
      },
      { name: "output", type: "string", description: "A terminal output line" },
      { name: "title", type: "ReactNode", description: "The serif heading" },
      {
        name: "headingLevel",
        type: "1 | 2 | 3",
        default: "1",
        description:
          "2 when the page around it already has an h1, such as an error inside a layout",
      },
      { name: "note", type: "ReactNode", description: "Mono line under the title" },
      { name: "action", type: "ReactNode", description: "A way back" },
    ],
  },
  "page-loading": {
    description:
      "A loading screen in CSS alone, so it moves before JavaScript runs. The command types itself, and the list of what is loading appears only if the wait passes 2.2s.",
    usage: `import { PageLoading } from "@/components/entrepta/page-loading"

// app/log/loading.tsx
export default function Loading() {
  return (
    <PageLoading
      command="ls ./log"
      crumb="log"
      label="the log"
      steps={["reading entries", "reading covers"]}
    />
  )
}`,
    props: [
      { name: "command", type: "string", description: "The command the loaded page prints" },
      { name: "crumb", type: "string", description: "Breadcrumb after ~" },
      { name: "steps", type: "string[]", description: "Shown only on a long wait" },
      { name: "label", type: "string", description: "Announced once: Loading {label}" },
    ],
  },
  reveal: {
    description:
      "The entrance every card shares: it rises 14px and fades in once on screen. Staggers lists by index, capped at six.",
    usage: `import { Reveal, useReveal } from "@/components/entrepta/reveal"
import { motion } from "motion/react"

{posts.map((post, i) => (
  <Reveal key={post.slug} index={i}>
    <Card>…</Card>
  </Reveal>
))}

// on your own motion element
<motion.div {...useReveal(0.1)}>…</motion.div>`,
    props: [
      {
        name: "index",
        type: "number",
        default: "0",
        description: "Position in a list, for the stagger",
      },
      { name: "delay", type: "number", default: "0", description: "Seconds before the entrance" },
      { name: "step", type: "number", default: "0.06", description: "Seconds between list items" },
    ],
  },
  "type-in": {
    description:
      "Text that assembles itself piece by piece when it comes on screen. The whole sentence is in the DOM from the first render, for crawlers and screen readers.",
    usage: `import { TypeIn } from "@/components/entrepta/type-in"

<TypeIn as="h1" text="Build with entrepta." emphasis="entrepta" />
<TypeIn text="A longer sentence that wraps on small screens." by="word" />`,
    props: [
      { name: "text", type: "string", description: "The sentence" },
      { name: "emphasis", type: "string", description: "A substring set in serif italic" },
      {
        name: "by",
        type: '"char" | "word"',
        default: '"char"',
        description: "Use word for anything that wraps",
      },
      {
        name: "as",
        type: '"span" | "h1" | "h2" | "h3" | "p"',
        default: '"span"',
        description: "Element",
      },
      {
        name: "delay",
        type: "number",
        default: "0",
        description: "Seconds before the first piece",
      },
      { name: "speed", type: "number", description: "Seconds between pieces" },
    ],
  },
  "rolling-number": {
    description:
      "A number that rolls into place like an odometer, and turns once more on hover. The real value is in an sr-only copy.",
    usage: `import { RollingNumber, useRollOnHover } from "@/components/entrepta/rolling-number"

function Stat() {
  const roll = useRollOnHover(0.2)
  return (
    <div {...roll.handlers} className="font-serif text-display-md">
      <RollingNumber value={128} cycle={roll.cycle} delay={roll.delay} height={44} />
    </div>
  )
}`,
    props: [
      { name: "value", type: "number | string", description: "Whole number. Commas stay still" },
      { name: "cycle", type: "number", default: "0", description: "Change it to roll a full turn" },
      {
        name: "delay",
        type: "number",
        default: "0",
        description: "Entrance delay. 0 after interaction",
      },
      { name: "height", type: "number", default: "34", description: "Height of one digit in px" },
    ],
  },
  spotlight: {
    description:
      "A brand glow that trails the cursor across a card on a spring. It moves by transform, so it never repaints the card.",
    usage: `import { Spotlight, useSpotlight } from "@/components/entrepta/spotlight"

function GlowCard() {
  const { onMouseMove, spotlight } = useSpotlight(560)
  return (
    <Card onMouseMove={onMouseMove}>
      <Spotlight {...spotlight} />
      …
    </Card>
  )
}`,
    props: [
      {
        name: "useSpotlight(size?)",
        type: "{ onMouseMove, spotlight }",
        description: "Size is the glow diameter in px, 560 by default",
      },
    ],
  },
  "spotlight-card": {
    description:
      "A Card with the brand glow trailing the cursor, on a spring. It takes everything a Card takes and holds the hook itself, so a server page can use it as is. Its children keep the Card's layout and gap, over the glow. For tiles that should feel alive: a dashboard's numbers, a call to action.",
    usage: `import { SpotlightCard } from "@/components/entrepta/spotlight-card"

<SpotlightCard>
  <Metric label="balance" value={<Amount value={balance} />} />
</SpotlightCard>

<SpotlightCard variant="featured" size="xl" glow={800}>
  <CardTitle>Start <em>building.</em></CardTitle>
</SpotlightCard>`,
    props: [
      { name: "glow", type: "number", default: "640", description: "Diameter of the glow in px" },
      {
        name: "variant, size",
        type: "Card's",
        description: "default, featured, terminal or data; sm, md or xl",
      },
    ],
  },
  "arrow-link": {
    description:
      "A text link with an arrow that travels and a brand rule that wipes in on hover and focus. Renders an a, or your router's link with asChild.",
    usage: `import { ArrowLink, ArrowAffordance } from "@/components/entrepta/arrow-link"

<ArrowLink href="/docs">read the docs</ArrowLink>
<ArrowLink href="https://github.com/you" external>github</ArrowLink>
<ArrowLink asChild><Link href="/blog">all posts</Link></ArrowLink>

// a card that is one big link: the footer answers the card's hover
<a href="/post" className="group/arrow">
  <ArrowAffordance>read</ArrowAffordance>
</a>`,
    props: [
      {
        name: "external",
        type: "boolean",
        default: "false",
        description: "Up-right arrow, opens in a new tab",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description: "Renders your router's link",
      },
    ],
  },
};
