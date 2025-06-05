import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & {
        src: string;
        background?: string;
        speed?: string;
        loop?: boolean;
        autoplay?: boolean;
        ref?: React.RefObject<HTMLElement>;
        style?: React.CSSProperties;
        id?: string;
      };
    }
  }
} 