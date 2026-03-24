import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useEditorStore } from '@/store/useEditorStore';
import { useFileSystemStore } from '@/store/useFileSystemStore';
import { File, Folder, Settings, Search, Terminal, Moon, Sun, Type } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme, setFontSize, toggleSidebar, toggleBottomPanel } = useEditorStore();
  const { files } = useFileSystemStore();
  const editorStore = useEditorStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'p' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setOpen((open) => !open);
      } else if (e.key.toLowerCase() === 'p' && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        setOpen((open) => !open); // Also open for Ctrl+P for now
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelectFile = (id: string) => {
    editorStore.openTab(id);
    setOpen(false);
  };

  const allFiles = Object.values(files).filter(f => f.type === 'file');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50">
      <div className={`w-full max-w-[600px] rounded-lg shadow-2xl overflow-hidden border ${theme === 'vs-dark' ? 'bg-[#252526] border-[#454545] text-[#cccccc]' : 'bg-[#f3f3f3] border-[#cccccc] text-[#333333]'}`}>
        <Command className="flex flex-col w-full h-full" label="Command Palette">
          <div className={`flex items-center px-3 border-b ${theme === 'vs-dark' ? 'border-[#454545]' : 'border-[#cccccc]'}`}>
            <Command.Input 
              autoFocus 
              placeholder="Type a command or search..." 
              className={`flex-1 h-12 bg-transparent outline-none placeholder:text-gray-500 ${theme === 'vs-dark' ? 'text-white' : 'text-black'}`}
            />
          </div>
          
          <Command.List className={`max-h-[300px] overflow-y-auto p-2 ${theme === 'vs-dark' ? 'text-[#cccccc]' : 'text-[#333333]'}`}>
            <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>
            
            <Command.Group heading="Files" className="px-2 py-1 text-xs font-semibold text-gray-500">
              {allFiles.map(file => (
                <Command.Item 
                  key={file.id} 
                  onSelect={() => handleSelectFile(file.id)}
                  className={`flex items-center px-2 py-2 text-sm rounded cursor-pointer aria-selected:bg-blue-600 aria-selected:text-white ${theme === 'vs-dark' ? 'hover:bg-[#37373d]' : 'hover:bg-[#e8e8e8]'}`}
                >
                  <File size={16} className="mr-2" />
                  {file.name}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Commands" className="px-2 py-1 text-xs font-semibold text-gray-500 mt-2">
              <Command.Item 
                onSelect={() => { setTheme('vs-dark'); setOpen(false); }}
                className={`flex items-center px-2 py-2 text-sm rounded cursor-pointer aria-selected:bg-blue-600 aria-selected:text-white ${theme === 'vs-dark' ? 'hover:bg-[#37373d]' : 'hover:bg-[#e8e8e8]'}`}
              >
                <Moon size={16} className="mr-2" />
                Preferences: Color Theme (Dark)
              </Command.Item>
              <Command.Item 
                onSelect={() => { setTheme('light'); setOpen(false); }}
                className={`flex items-center px-2 py-2 text-sm rounded cursor-pointer aria-selected:bg-blue-600 aria-selected:text-white ${theme === 'vs-dark' ? 'hover:bg-[#37373d]' : 'hover:bg-[#e8e8e8]'}`}
              >
                <Sun size={16} className="mr-2" />
                Preferences: Color Theme (Light)
              </Command.Item>
              <Command.Item 
                onSelect={() => { toggleSidebar(); setOpen(false); }}
                className={`flex items-center px-2 py-2 text-sm rounded cursor-pointer aria-selected:bg-blue-600 aria-selected:text-white ${theme === 'vs-dark' ? 'hover:bg-[#37373d]' : 'hover:bg-[#e8e8e8]'}`}
              >
                <Folder size={16} className="mr-2" />
                View: Toggle Primary Side Bar Visibility
              </Command.Item>
              <Command.Item 
                onSelect={() => { toggleBottomPanel(); setOpen(false); }}
                className={`flex items-center px-2 py-2 text-sm rounded cursor-pointer aria-selected:bg-blue-600 aria-selected:text-white ${theme === 'vs-dark' ? 'hover:bg-[#37373d]' : 'hover:bg-[#e8e8e8]'}`}
              >
                <Terminal size={16} className="mr-2" />
                View: Toggle Panel Visibility
              </Command.Item>
              <Command.Item 
                onSelect={() => { setFontSize(16); setOpen(false); }}
                className={`flex items-center px-2 py-2 text-sm rounded cursor-pointer aria-selected:bg-blue-600 aria-selected:text-white ${theme === 'vs-dark' ? 'hover:bg-[#37373d]' : 'hover:bg-[#e8e8e8]'}`}
              >
                <Type size={16} className="mr-2" />
                Editor Font Zoom In
              </Command.Item>
              <Command.Item 
                onSelect={() => { setFontSize(14); setOpen(false); }}
                className={`flex items-center px-2 py-2 text-sm rounded cursor-pointer aria-selected:bg-blue-600 aria-selected:text-white ${theme === 'vs-dark' ? 'hover:bg-[#37373d]' : 'hover:bg-[#e8e8e8]'}`}
              >
                <Type size={16} className="mr-2" />
                Editor Font Zoom Reset
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
