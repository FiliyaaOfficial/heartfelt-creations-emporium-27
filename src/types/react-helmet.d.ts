
declare module 'react-helmet' {
  import { ComponentType, ReactNode } from 'react';

  interface HelmetProps {
    children?: ReactNode;
  }

  export const Helmet: ComponentType<HelmetProps>;
}
