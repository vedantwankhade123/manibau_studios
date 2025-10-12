import React from 'react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  name: string;
  [key: string]: any;
}

const IconRenderer: React.FC<IconRendererProps> = ({ name, ...props }) => {
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    return <Icons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};

export default IconRenderer;