import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { useFileSystemStore } from '@/store/useFileSystemStore';
import { GitBranch, XCircle, AlertTriangle, Check, Bell, RefreshCw } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { theme, activeTabId } = useEditorStore();
  const { files } = useFileSystemStore();
  
  const activeFile = activeTabId ? files[activeTabId] : null;

  return (
    <div className={`h-6 flex items-center justify-between px-2 text-[11px] select-none ${theme === 'vs-dark' ? 'bg-[#007acc] text-white' : 'bg-[#007acc] text-white'}`}>
      <div className="flex items-center space-x-3">
        <div className="flex items-center cursor-pointer hover:bg-[#ffffff33] px-1 rounded">
          <GitBranch size={12} className="mr-1" /> main
        </div>
        <div className="flex items-center cursor-pointer hover:bg-[#ffffff33] px-1 rounded">
          <RefreshCw size={12} className="mr-1" />
        </div>
        <div className="flex items-center cursor-pointer hover:bg-[#ffffff33] px-1 rounded">
          <XCircle size={12} className="mr-1" /> 0
          <AlertTriangle size={12} className="ml-2 mr-1" /> 0
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {activeFile && (
          <>
            <div className="cursor-pointer hover:bg-[#ffffff33] px-1 rounded">
              Ln 1, Col 1
            </div>
            <div className="cursor-pointer hover:bg-[#ffffff33] px-1 rounded">
              Spaces: 2
            </div>
            <div className="cursor-pointer hover:bg-[#ffffff33] px-1 rounded">
              UTF-8
            </div>
            <div className="cursor-pointer hover:bg-[#ffffff33] px-1 rounded">
              CRLF
            </div>
            <div className="cursor-pointer hover:bg-[#ffffff33] px-1 rounded">
              {activeFile.language === 'plaintext' ? 'Plain Text' : activeFile.language}
            </div>
          </>
        )}
        <div className="cursor-pointer hover:bg-[#ffffff33] px-1 rounded">
          Prettier
        </div>
        <div className="cursor-pointer hover:bg-[#ffffff33] px-1 rounded">
          <Check size={12} className="mr-1 inline" />
        </div>
        <div className="cursor-pointer hover:bg-[#ffffff33] px-1 rounded">
          <Bell size={12} />
        </div>
      </div>
    </div>
  );
};
