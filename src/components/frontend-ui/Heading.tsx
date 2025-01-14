// src/components/frontend-ui/Heading.tsx
import clsx from 'clsx';

type HeadingProps = {
    level?: 1 | 2 | 3 | 4; // Unterstützte Werte (H1-H4)
    variant?: 'default' | 'section'; // Neue Prop für verschiedene Stile
} & React.HTMLAttributes<HTMLHeadingElement>;

const headingStyles: Record<1 | 2 | 3 | 4, string> = {
    1: 'text-4xl font-bold text-dark-green',
    2: 'font-roboto text-dark-green text-[1.5rem] font-semibold leading-[1.4rem] tracking-[0.01125rem]',
    3: 'text-xl font-medium text-dark-20',
    4: 'text-lg font-normal text-dark-6',
};

const sectionStyle = `
    text-center 
    font-roboto 
    text-2xl 
    font-light 
    tracking-[1.44px] 
    text-dark-green
    mt-12
    mb-8
    relative
    w-full
    before:content-['']
    before:absolute
    before:left-0
    before:top-1/2
    before:h-[0.5px]
    before:w-[calc(50%-120px)]
    before:bg-dark-green
    after:content-['']
    after:absolute
    after:right-0
    after:top-1/2
    after:h-[0.5px]
    after:w-[calc(50%-120px)]
    after:bg-dark-green
`;

export function Heading({ className, level = 1, variant = 'default', ...props }: HeadingProps) {
    const Element: 'h1' | 'h2' | 'h3' | 'h4' =
        level === 1 ? 'h1' :
            level === 2 ? 'h2' :
                level === 3 ? 'h3' : 'h4';

    // Wähle das Styling basierend auf Variante und Level
    const baseStyle = variant === 'section' && level === 2
        ? sectionStyle
        : headingStyles[level];

    const classes = clsx(className, baseStyle);

    return <Element {...props} className={classes} />;
}