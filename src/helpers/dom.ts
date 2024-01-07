export const getButton = <T extends HTMLButtonElement>(is?: ElementCreationOptions): T => document.createElement('button', is || undefined) as T;
export const getDiv = () => document.createElement('div');
export const getSpan = () => document.createElement('span');
