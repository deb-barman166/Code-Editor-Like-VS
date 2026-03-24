import React, { useEffect, useState, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useEditorStore } from '@/store/useEditorStore';
import { useFileSystemStore } from '@/store/useFileSystemStore';
import { X, FileCode, FileJson, FileText, FileImage, FileType2 } from 'lucide-react';

export const EditorArea: React.FC = () => {
  const { activeTabId, openTabs, closeTab, setActiveTab, theme, fontSize } = useEditorStore();
  const { files, updateFileContent } = useFileSystemStore();
  const monaco = useMonaco();
  
  const activeFile = activeTabId ? files[activeTabId] : null;

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('vs-dark-custom', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1e1e1e',
        }
      });
      monaco.editor.setTheme(theme === 'vs-dark' ? 'vs-dark-custom' : 'vs');
    }
  }, [monaco, theme]);

  const handleEditorChange = (value: string | undefined) => {
    if (activeTabId && value !== undefined) {
      updateFileContent(activeTabId, value);
    }
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.jsx') || name.endsWith('.tsx')) return <FileType2 size={14} className="text-yellow-400" />;
    if (name.endsWith('.json')) return <FileJson size={14} className="text-green-400" />;
    if (name.endsWith('.css')) return <FileCode size={14} className="text-blue-400" />;
    if (name.endsWith('.html')) return <FileCode size={14} className="text-orange-400" />;
    if (name.endsWith('.md')) return <FileText size={14} className="text-blue-300" />;
    if (name.match(/\.(png|jpg|jpeg|svg|gif)$/i)) return <FileImage size={14} className="text-purple-400" />;
    return <FileText size={14} className="text-gray-400" />;
  };

  if (openTabs.length === 0) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center ${theme === 'vs-dark' ? 'bg-[#1e1e1e] text-[#616161]' : 'bg-[#ffffff] text-[#999999]'}`}>
        <div className="w-64 h-64 opacity-10 mb-8">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5 1.5L22 4v16l-4.5 2.5-12-7-3-2 3-2 12 7V6.5l-12 7-3-2 15-10z" />
          </svg>
        </div>
        <div className="flex flex-col items-center space-y-4 text-sm">
          <div className="flex items-center space-x-4">
            <span>Show All Commands</span>
            <span className="bg-[#333333] px-2 py-1 rounded text-xs">Ctrl+Shift+P</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Go to File</span>
            <span className="bg-[#333333] px-2 py-1 rounded text-xs">Ctrl+P</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Find in Files</span>
            <span className="bg-[#333333] px-2 py-1 rounded text-xs">Ctrl+Shift+F</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col overflow-hidden ${theme === 'vs-dark' ? 'bg-[#1e1e1e]' : 'bg-[#ffffff]'}`}>
      <div className={`flex overflow-x-auto no-scrollbar border-b ${theme === 'vs-dark' ? 'bg-[#252526] border-[#2d2d2d]' : 'bg-[#f3f3f3] border-[#e5e5e5]'}`}>
        {openTabs.map(tabId => {
          const file = files[tabId];
          if (!file) return null;
          
          const isActive = tabId === activeTabId;
          
          return (
            <div 
              key={tabId}
              className={`flex items-center h-9 px-3 border-r min-w-[120px] max-w-[200px] cursor-pointer group select-none
                ${theme === 'vs-dark' ? 'border-[#2d2d2d]' : 'border-[#e5e5e5]'}
                ${isActive 
                  ? (theme === 'vs-dark' ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' : 'bg-[#ffffff] text-black border-t-2 border-t-blue-500') 
                  : (theme === 'vs-dark' ? 'bg-[#2d2d2d] text-[#858585] hover:bg-[#2d2d2d]' : 'bg-[#ececec] text-[#616161] hover:bg-[#e8e8e8]')
                }`}
              onClick={() => setActiveTab(tabId)}
            >
              <div className="mr-2 flex-shrink-0">
                {getFileIcon(file.name)}
              </div>
              <div className="truncate flex-1 text-sm">{file.name}</div>
              <div 
                className={`ml-2 p-0.5 rounded-md opacity-0 group-hover:opacity-100 ${isActive ? 'opacity-100' : ''} ${theme === 'vs-dark' ? 'hover:bg-[#333333]' : 'hover:bg-[#dcdcdc]'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tabId);
                }}
              >
                <X size={14} />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex-1 relative">
        {activeFile ? (
          <Editor
            height="100%"
            language={activeFile.language || 'plaintext'}
            theme={theme === 'vs-dark' ? 'vs-dark-custom' : 'vs'}
            value={activeFile.content || ''}
            onChange={handleEditorChange}
            options={{
              fontSize,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              formatOnPaste: true,
              wordWrap: 'on',
              tabSize: 2,
            }}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a file to edit
          </div>
        )}
      </div>
    </div>
  );
};
