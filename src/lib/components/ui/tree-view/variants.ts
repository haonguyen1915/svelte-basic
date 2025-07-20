// src/lib/components/treeview/variants.ts
import { tv } from "tailwind-variants";

export const treeViewVariants = tv({
    base: "select-none text-sm",
    variants: {
        size: {
            sm: "text-xs",
            default: "text-sm",
            lg: "text-base",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

export const treeItemVariants = tv({
    base: "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
    variants: {
        variant: {
            default: "",
            selected: "bg-primary text-primary-foreground",
            active: "bg-accent text-accent-foreground",
        },
        disabled: {
            true: "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-inherit",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export const treeIconVariants = tv({
    base: "transition-transform duration-200 shrink-0",
    variants: {
        expanded: {
            true: "rotate-90",
            false: "rotate-0",
        },
    },
    defaultVariants: {
        expanded: false,
    },
});