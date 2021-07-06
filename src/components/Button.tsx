/**
 Importando todas as propriedades que um botão pode receber 
 facilitando, com as propriedades.
 */

import { ButtonHTMLAttributes } from 'react';

import '../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
};

export function Button({
    isOutlined = false, ...props
}: ButtonProps) {
    return (
        <button 
            className={`button ${isOutlined ? 'outlined': ''}`} {...props}
            
        />
    )
}