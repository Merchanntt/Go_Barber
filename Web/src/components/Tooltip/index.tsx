import React from 'react';

import { Container } from './style';

interface TooltipsProps {
  title: string;
  className?: string;
}

const Tooltip: React.FC<TooltipsProps> = ({
  title,
  className = '',
  children,
}) => {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
};

export default Tooltip;
