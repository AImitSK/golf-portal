import clsx from 'clsx';

type HeadingProps = {
    level?: 1 | 2 | 3 | 4; // Unterstützte Werte (H1-H4)
} & React.HTMLAttributes<HTMLHeadingElement>; // Props für Heading-Tags

const headingStyles: Record<1 | 2 | 3 | 4, string> = {
    1: 'text-4xl font-bold text-dark-green',
    2: 'font-roboto text-dark-green text-[1.5rem] font-semibold leading-[1rem] tracking-[0.01125rem]', // Angepasstes Styling für H2
    3: 'text-xl font-medium text-dark-20',
    4: 'text-lg font-normal text-dark-6',
};

export function Heading({ className, level = 1, ...props }: HeadingProps) {
    // Dynamisch das passende HTML-Tag bestimmen, aber nur auf H1 bis H4 begrenzt
    const Element: 'h1' | 'h2' | 'h3' | 'h4' =
        level === 1 ? 'h1' :
            level === 2 ? 'h2' :
                level === 3 ? 'h3' : 'h4';

    // Klassen kombinieren
    const classes = clsx(className, headingStyles[level]);

    // Element und Props korrekt verwenden
    return <Element {...props} className={classes} />;
}