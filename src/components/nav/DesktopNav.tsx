
import React from 'react';
import { MainNavDropdown } from './MainNavDropdown';

export const DesktopNav = () => {
  return (
    <div className="hidden md:flex items-center">
      <MainNavDropdown />
    </div>
  );
};
