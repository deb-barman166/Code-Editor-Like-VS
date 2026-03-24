import React from 'react';
import { Files, Search, Blocks, Settings, User } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';

export const ActivityBar: React.FC = () => {
  const { activeSidebarPanel, setActiveSidebarPanel, theme, sidebarOpen, toggleSidebar } = useEditorStore();

  const handlePanelClick = (panel: 'explorer' | 'search' | 'extensions') => {
    if (activeSidebarPanel === panel && sidebarOpen) {
      toggleSidebar();
    } else {
      setActiveSidebarPanel(panel);
    }
  };

  const iconClass = (panel: string) => `
    w-12 h-12 flex items-center justify-center cursor-pointer relative
    ${theme === 'vs-dark' ? 'text-[#858585] hover:text-white' : 'text-[#616161] hover:text-black'}
    ${activeSidebarPanel === panel && sidebarOpen ? (theme === 'vs-dark' ? 'text-white' : 'text-black') : ''}
  `;

  const indicatorClass = (panel: string) => `
    absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500
    ${activeSidebarPanel === panel && sidebarOpen ? 'block' : 'hidden'}
  `;

  return (
    <div className={`w-12 flex flex-col justify-between ${theme === 'vs-dark' ? 'bg-[#333333]' : 'bg-[#2c2c2c] text-white'}`}>
      <div className="flex flex-col">
        <div className={iconClass('explorer')} onClick={() => handlePanelClick('explorer')}>
          <div className={indicatorClass('explorer')} />
          <Files size={24} strokeWidth={1.5} />
        </div>
        <div className={iconClass('search')} onClick={() => handlePanelClick('search')}>
          <div className={indicatorClass('search')} />
          <Search size={24} strokeWidth={1.5} />
        </div>
        <div className={iconClass('extensions')} onClick={() => handlePanelClick('extensions')}>
          <div className={indicatorClass('extensions')} />
          <Blocks size={24} strokeWidth={1.5} />
        </div>
      </div>
      
      <div className="flex flex-col mb-2">
        <div className={iconClass('user')}>
          <User size={24} strokeWidth={1.5} />
        </div>
        <div className={iconClass('settings')}>
          <Settings size={24} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};
