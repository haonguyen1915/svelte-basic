// src/lib/components/treeview/variants.ts
import { tv } from 'tailwind-variants';

export const treeViewVariants = tv({
	base: 'select-none text-sm',
	variants: {
		size: {
			sm: 'text-xs',
			default: 'text-sm',
			lg: 'text-base'
		}
	},
	defaultVariants: {
		size: 'default'
	}
});

export const treeItemVariants = tv({
	base: 'flex items-center gap-2 py-0.5 px-2 rounded-md cursor-pointer transition-all duration-200 focus:outline-none relative text-foreground',
	variants: {
		variant: {
			default: 'hover:bg-accent/30 hover:text-accent-foreground hover:shadow-sm',
			selected: 'bg-accent/90 text-accent-foreground shadow-sm ring-1 ring-ring/20',
			active: 'bg-primary/90 text-primary-foreground shadow-md ring-1 ring-ring/30',
			ghost: 'hover:bg-muted/30 hover:text-muted-foreground',
			folder: 'hover:bg-sidebar-accent/40 text-sidebar-foreground',
			file: 'hover:bg-muted/20 text-muted-foreground'
		},
		disabled: {
			true: 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-inherit hover:shadow-none'
		},
		depth: {
			0: '',
			1: 'ml-1',
			2: 'ml-2', 
			3: 'ml-3'
		}
	},
	defaultVariants: {
		variant: 'default',
		depth: 0
	}
});

export const treeIconVariants = tv({
	base: 'transition-all duration-200 shrink-0',
	variants: {
		expanded: {
			true: 'rotate-90',
			false: 'rotate-0'
		}
	},
	defaultVariants: {
		expanded: false
	}
});

