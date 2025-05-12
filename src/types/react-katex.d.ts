declare module 'react-katex' {
  import * as React from 'react';

  export interface KatexProps {
    math: string;  // Changed from 'children' to 'math'
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
    macros?: Record<string, string>;
  }

  export const InlineMath: React.FC<KatexProps>;
  export const BlockMath: React.FC<KatexProps>;
}