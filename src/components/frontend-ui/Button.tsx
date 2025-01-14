import React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary';
};

const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', ...props }) => {
    const baseStyles = 'rounded-full font-semibold transition-colors duration-200 px-8 py-3 text-lg';

    const variantStyles = {
        primary: 'bg-cta-green text-white hover:bg-dark-green',
        secondary: 'bg-dark-green-25 text-dark-green hover:bg-dark-green-10',
    };

    const classes = clsx(
        baseStyles,
        variantStyles[variant],
        className
    );

    return (
        <button className={classes} {...props} />
    );
};

export default Button;