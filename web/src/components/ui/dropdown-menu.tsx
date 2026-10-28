'use client'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { CheckIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/* O `DropdownMenu` do shadcn/ui (estilo new-york), sobre o Radix. Trazido à mão
 * e não pelo `shadcn init`: o init reescreve o `globals.css` com os tokens dele
 * (`--popover`, `--accent`…), e o site já tem os seus, que trocam com o tema
 * (`--color-surface-*`, `--color-text-*`). As classes abaixo são as do shadcn
 * com os nossos tokens no lugar. Só as peças que o site usa; as outras (sub-menu,
 * atalho, rótulo) se copiam de ui.shadcn.com quando alguém precisar. Sem a
 * animação de entrada: ela pede o `tw-animate-css`, que o site não tem. */

function DropdownMenu(props: ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger(props: ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({ className, sideOffset = 6, ...props }: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border-main dark:border-white/10 bg-surface-2 dark:bg-dark-surface p-1 text-text-main shadow-lg',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuRadioGroup(props: ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
}

function DropdownMenuRadioItem({ className, children, ...props }: ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none',
        'focus:bg-surface-3 dark:focus:bg-white/10 data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      <span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-primary" aria-hidden />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
    </DropdownMenuPrimitive.RadioItem>
  )
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
}
