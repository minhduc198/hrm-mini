import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "font-sans text-4xl font-bold leading-tight tracking-[-0.02em]",
      h2: "font-sans text-3xl font-semibold leading-snug tracking-[-0.015em]",
      h3: "font-sans text-2xl font-semibold leading-snug tracking-[-0.01em]",
      h4: "font-sans text-xl font-semibold leading-normal",
      lead: "font-sans text-xl font-normal leading-relaxed text-muted-foreground",
      p: "font-sans text-base font-normal leading-relaxed",
      small:
        "font-sans text-sm font-normal leading-normal text-muted-foreground",
      tiny: "font-sans text-[10px] font-normal leading-normal",
      muted:
        "font-sans text-sm font-normal leading-normal text-muted-foreground",
      label:
        "font-sans text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-muted-foreground",
      code: "font-mono text-sm font-medium bg-muted text-foreground rounded px-[0.4em] py-[0.15em] border border-border/50",
      blockquote:
        "font-sans text-lg italic leading-relaxed text-muted-foreground border-l-2 border-border pl-6",
    },
  },
  defaultVariants: {
    variant: "p",
    
  },
});

const variantElementMap: Record<string, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  lead: "p",
  p: "p",
  small: "small",
  tiny: 'span',
  muted: "p",
  label: "span",
  code: "code",
  blockquote: "blockquote",
  
};

interface TypographyProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}

export function Typography({
  variant,
  as,
  className,
  children,
  ...props
}: TypographyProps) {
  const Tag = as ?? variantElementMap[variant ?? "p"] ?? "p";

  return (
    <Tag className={cn(typographyVariants({ variant }), className)} {...props}>
      {children}
    </Tag>
  );
}
