import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EditorState {
  activeTabId: string | null;
  openTabs: string[];
  theme: 'vs-dark' | 'light';
  fontSize: number;
  sidebarOpen: boolean;
  activeSidebarPanel: 'explorer' | 'search' | 'extensions';
  bottomPanelOpen: boolean;
  
  setActiveTab: (id: string | null) => void;
  openTab: (id: string) => void;
  closeTab: (id: string) => void;
  setTheme: (theme: 'vs-dark' | 'light') => void;
  setFontSize: (size: number) => void;
  toggleSidebar: () => void;
  setActiveSidebarPanel: (panel: 'explorer' | 'search' | 'extensions') => void;
  toggleBottomPanel: () => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      activeTabId: null,
      openTabs: [],
      theme: 'vs-dark',
      fontSize: 14,
      sidebarOpen: true,
      activeSidebarPanel: 'explorer',
      bottomPanelOpen: true,

      setActiveTab: (id) => set({ activeTabId: id }),
      
      openTab: (id) => {
        const { openTabs } = get();
        if (!openTabs.includes(id)) {
          set({ openTabs: [...openTabs, id], activeTabId: id });
        } else {
          set({ activeTabId: id });
        }
      },
      
      closeTab: (id) => {
        const { openTabs, activeTabId } = get();
        const newTabs = openTabs.filter(tabId => tabId !== id);
        
        let newActiveTab = activeTabId;
        if (activeTabId === id) {
          const index = openTabs.indexOf(id);
          if (newTabs.length > 0) {
            newActiveTab = newTabs[Math.max(0, index - 1)];
          } else {
            newActiveTab = null;
          }
        }
        
        set({ openTabs: newTabs, activeTabId: newActiveTab });
      },
      
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setActiveSidebarPanel: (panel) => set({ activeSidebarPanel: panel, sidebarOpen: true }),
      toggleBottomPanel: () => set((state) => ({ bottomPanelOpen: !state.bottomPanelOpen })),
    }),
    {
      name: 'vscode-pwa-editor-settings',
    }
  )
);
