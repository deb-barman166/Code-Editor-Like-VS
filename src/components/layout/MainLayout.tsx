import React from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { TopBar } from './TopBar';
import { ActivityBar } from './ActivityBar';
import { Sidebar } from './Sidebar';
import { EditorArea } from './EditorArea';
import { BottomPanel } from './BottomPanel';
import { StatusBar } from './StatusBar';
import { useEditorStore } from '@/store/useEditorStore';

export const MainLayout: React.FC = () => {
  const { sidebarOpen, bottomPanelOpen, theme } = useEditorStore();

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'vs-dark' ? 'bg-[#1e1e1e] text-[#cccccc]' : 'bg-[#fffffe] text-[#333333]'}`}>
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        <ActivityBar />
        
        <Group orientation="horizontal">
          {sidebarOpen && (
            <>
              <Panel defaultSize={20} minSize={15} maxSize={40} className={`flex flex-col ${theme === 'vs-dark' ? 'bg-[#252526]' : 'bg-[#f3f3f3]'}`}>
                <Sidebar />
              </Panel>
              <Separator className={`w-1 hover:bg-blue-500 transition-colors ${theme === 'vs-dark' ? 'bg-[#333333]' : 'bg-[#e5e5e5]'}`} />
            </>
          )}
          
          <Panel className="flex flex-col">
            <Group orientation="vertical">
              <Panel className="flex flex-col">
                <EditorArea />
              </Panel>
              
              {bottomPanelOpen && (
                <>
                  <Separator className={`h-1 hover:bg-blue-500 transition-colors ${theme === 'vs-dark' ? 'bg-[#333333]' : 'bg-[#e5e5e5]'}`} />
                  <Panel defaultSize={25} minSize={10} maxSize={50} className={`flex flex-col ${theme === 'vs-dark' ? 'bg-[#1e1e1e]' : 'bg-[#ffffff]'}`}>
                    <BottomPanel />
                  </Panel>
                </>
              )}
            </Group>
          </Panel>
        </Group>
      </div>
      
      <StatusBar />
    </div>
  );
};
