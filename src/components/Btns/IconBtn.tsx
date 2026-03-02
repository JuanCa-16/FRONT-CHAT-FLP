import React from 'react';
import './IconBtn.scss';

interface IconBtnProps {
  Icon: React.ReactElement;
  className?: string;
}

export default function IconBtn({ Icon, className = ""  }: IconBtnProps) {
  return (
    <div className={`icon-container ${className}`}>
      <div>{Icon}</div>
    </div>
  );
}
