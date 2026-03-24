import React, { useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { X, Filter, CircleSlash } from 'lucide-react';

export const BottomPanel: React.FC = () => {
  const { theme, toggleBottomPanel } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'problems' | 'output' | 'debug' | 'terminal'>('problems');

  const tabs = [
    { id: 'problems', label: 'PROBLEMS' },
    { id: 'output', label: 'OUTPUT' },
    { id: 'debug', label: 'DEBUG CONSOLE' },
    { id: 'terminal', label: 'TERMINAL' },
  ];

  return (
    <div className={`flex-1 flex flex-col ${theme === 'vs-dark' ? 'bg-[#1e1e1e] text-[#cccccc]' : 'bg-[#ffffff] text-[#333333]'}`}>
      <div className={`flex items-center justify-between px-4 h-9 border-b ${theme === 'vs-dark' ? 'border-[#2d2d2d]' : 'border-[#e5e5e5]'}`}>
        <div className="flex space-x-6">
          {tabs.map(tab => (
            <div 
              key={tab.id}
              className={`text-[11px] cursor-pointer tracking-wider flex items-center h-9 border-b-2 ${activeTab === tab.id ? (theme === 'vs-dark' ? 'text-[#e7e7e7] border-blue-500' : 'text-[#333333] border-blue-500') : 'text-[#858585] border-transparent hover:text-[#cccccc]'}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <div className="p-1 cursor-pointer hover:bg-[#333333] rounded">
            <X size={14} onClick={toggleBottomPanel} />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'problems' && (
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
              <input 
                type="text" 
                placeholder="Filter (e.g. text, **/*.ts, !**/node_modules/**)" 
                className="bg-[#3c3c3c] text-[#cccccc] border border-[#3c3c3c] focus:border-blue-500 outline-none px-2 py-1 text-xs rounded flex-1 max-w-md"
              />
              <div className="p-1 cursor-pointer hover:bg-[#333333] rounded">
                <Filter size={14} />
              </div>
            </div>
            <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
              No problems have been detected in the workspace.
            </div>
          </div>
        )}
        
        {activeTab === 'output' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <select className="bg-[#3c3c3c] text-[#cccccc] border border-[#3c3c3c] outline-none px-2 py-1 text-xs rounded w-48">
                <option>Tasks</option>
                <option>Extension Host</option>
                <option>Log (Window)</option>
              </select>
              <div className="p-1 cursor-pointer hover:bg-[#333333] rounded">
                <CircleSlash size={14} />
              </div>
            </div>
            <div className="flex-1 font-mono text-xs text-gray-400">
              [Info] Code Editor PWA initialized successfully.<br/>
              [Info] Workspace loaded from IndexedDB.<br/>
              [Info] Offline service worker registered.
            </div>
          </div>
        )}
        
        {activeTab === 'terminal' && (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Terminal is disabled in this offline PWA version.
          </div>
        )}
        
        {activeTab === 'debug' && (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Debug console is disabled in this offline PWA version.
          </div>
        )}
      </div>
    </div>
  );
};
