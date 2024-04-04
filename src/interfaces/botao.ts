import { MouseEvent, ReactNode } from "react";

export interface IBotao {
    icon?: ReactNode;
    title?: string;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    width?: string;
    height?: string;
    marginTop?: string;
    bg?: string;
    color?: string;
}