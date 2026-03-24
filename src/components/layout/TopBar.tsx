import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { Menu, File, Edit, View, HelpCircle } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { theme } = useEditorStore();
  
  const menuItems = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];

  return (
    <div className={`h-8 flex items-center px-2 text-[13px] select-none ${theme === 'vs-dark' ? 'bg-[#3c3c3c] text-[#cccccc]' : 'bg-[#dddddd] text-[#333333]'}`}>
      <div className="flex items-center mr-4">
        <svg className="w-4 h-4 mr-2 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 1.5L22 4v16l-4.5 2.5-12-7-3-2 3-2 12 7V6.5l-12 7-3-2 15-10z" />
        </svg>
      </div>
      
      <div className="flex space-x-1">
        {menuItems.map(item => (
          <div key={item} className={`px-2 py-1 rounded cursor-pointer ${theme === 'vs-dark' ? 'hover:bg-[#505050]' : 'hover:bg-[#c4c4c4]'}`}>
            {item}
          </div>
        ))}
      </div>
      
      <div className="flex-1 flex justify-center">
        <div className={`px-32 py-0.5 rounded-md flex items-center text-xs ${theme === 'vs-dark' ? 'bg-[#2d2d2d] border border-[#3c3c3c]' : 'bg-[#ffffff] border border-[#cccccc]'}`}>
          Code Editor PWA
        </div>
      </div>
      
      <div className="flex space-x-2">
        <div className={`w-3 h-3 rounded-full bg-yellow-500`}></div>
        <div className={`w-3 h-3 rounded-full bg-green-500`}></div>
        <div className={`w-3 h-3 rounded-full bg-red-500`}></div>
      </div>
    </div>
  );
};
