import React from 'react';
import './IconBtn.scss';

interface IconBtnProps {
  Icon: React.ReactElement;
}

export default function IconBtn({ Icon }: IconBtnProps) {
  return (
    <div className="icon-container">
      <div>{Icon}</div>
    </div>
  );
}
