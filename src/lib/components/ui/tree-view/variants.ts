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
	base: 'flex items-center gap-2 py-0.5 px-2 rounded-md cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 relative',
	variants: {
		variant: {
			default: 'hover:bg-accent/50 hover:shadow-sm',
			selected: 'bg-accent border border-accent-foreground/20 shadow-sm',
			active: 'bg-accent text-accent-foreground',
			ghost: 'hover:bg-transparent'
		},
		disabled: {
			true: 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-inherit hover:shadow-none'
		}
	},
	defaultVariants: {
		variant: 'default'
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

export const treeGroupVariants = tv({
	base: 'relative',
	variants: {
		level: {
			0: '',
			1: 'ml-4',
			2: 'ml-8',
			3: 'ml-12'
		}
	},
	defaultVariants: {
		level: 0
	}
});
