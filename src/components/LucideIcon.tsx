import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
}

export const LucideIcon = ({ name, ...props }: IconProps) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.HelpCircle {...props} />;
  return <IconComponent {...props} />;
};
