<script lang="ts">
  import type { ComponentType } from 'svelte';
  import type { Icon } from 'lucide-svelte';

  export let variant: 'primary' | 'secondary' | 'danger' | 'test' | 'segment' = 'primary';
  export let disabled = false;
  export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  export let active = false;
  export let icon: ComponentType<Icon> | null = null;
  export let iconPosition: 'left' | 'right' = 'left';
  export let iconOnly = false;

  $: baseClasses = 'border-none rounded-md cursor-pointer transition-all duration-200 font-inherit inline-flex items-center justify-center';
  
  $: sizeClasses = {
    xs: iconOnly ? 'p-1 text-xs' : 'px-1.5 py-1 text-xs',
    sm: iconOnly ? 'p-1.5 text-xs' : 'px-3 py-1.5 text-xs',
    md: iconOnly ? 'p-2 text-sm' : 'px-4 py-2 text-sm',
    lg: iconOnly ? 'p-3 text-base' : 'px-6 py-3 text-base'
  };

  $: iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  $: variantClasses = {
    primary: disabled 
      ? 'bg-neutral-700 text-neutral-500 border-neutral-700'
      : active 
        ? 'bg-primary-700 text-white hover:bg-primary-800' 
        : 'bg-primary-600 text-white hover:bg-primary-700',
        
    secondary: disabled
      ? 'bg-neutral-700 text-neutral-500 border-neutral-700'
      : active
        ? 'bg-primary-700 text-white border-primary-800 hover:bg-primary-800'
        : 'bg-transparent text-text-secondary border border-border-medium hover:bg-secondary-800/10',
        
    danger: disabled
      ? 'bg-neutral-700 text-neutral-500 border-neutral-700'
      : active
        ? 'bg-error-800 text-white hover:bg-error-900'
        : 'bg-error-600 text-white hover:bg-error-700',
        
    test: disabled
      ? 'bg-neutral-700 text-neutral-500 border-neutral-700'
      : active
        ? 'bg-success-800 text-white hover:bg-success-900'
        : 'bg-success-600 text-white hover:bg-success-700',
        
    segment: disabled
      ? 'bg-neutral-700 text-neutral-500 border-neutral-700'
      : active
        ? 'bg-primary-700 text-white border border-border-medium hover:bg-primary-800'
        : 'bg-transparent border border-border-medium text-text-secondary hover:bg-primary-800'
  };

  $: buttonClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    disabled ? 'cursor-not-allowed' : 'cursor-pointer'
  ].filter(Boolean).join(' ');

  $: iconClasses = iconSizeClasses[size];
  $: hasSlotContent = $$slots.default;
</script>

<button class={buttonClasses} {disabled} {type} on:click>
  {#if icon && iconPosition === 'left'}
    <svelte:component 
      this={icon} 
      class={`${iconClasses} ${hasSlotContent && !iconOnly ? 'mr-2' : ''}`} 
    />
  {/if}
  
  {#if !iconOnly}
    <slot />
  {/if}
  
  {#if icon && iconPosition === 'right'}
    <svelte:component 
      this={icon} 
      class={`${iconClasses} ${hasSlotContent && !iconOnly ? 'ml-2' : ''}`} 
    />
  {/if}
</button>