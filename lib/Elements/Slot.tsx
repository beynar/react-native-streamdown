import React, { memo } from "react";

interface SlotProps {
  children: React.ReactNode;
  render?: React.ComponentType<any>;
  props?: Record<string, any>;
}

export const Slot = memo<SlotProps>(
  ({ children, render: RenderComponent, props = {} }) => {
    if (RenderComponent) {
      return <RenderComponent {...props} />;
    }

    return children;
  },
  (prevProps, nextProps) => {
    return prevProps.children === nextProps.children;
  }
);

export default Slot;
