import React, { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { useFileSystemStore, FileNode } from '@/store/useFileSystemStore';
import { ChevronRight, ChevronDown, FileCode, Folder, FolderOpen, FileJson, FileText, FileImage, FileType2, Plus, FilePlus, FolderPlus, Trash2, Edit2 } from 'lucide-react';
import * as ContextMenu from '@radix-ui/react-context-menu';

export const Sidebar: React.FC = () => {
  const { activeSidebarPanel, theme } = useEditorStore();
  
  return (
    <div className={`h-full flex flex-col ${theme === 'vs-dark' ? 'bg-[#252526] text-[#cccccc]' : 'bg-[#f3f3f3] text-[#616161]'}`}>
      <div className="text-[11px] uppercase tracking-wider px-4 py-2 font-semibold">
        {activeSidebarPanel === 'explorer' && 'Explorer'}
        {activeSidebarPanel === 'search' && 'Search'}
        {activeSidebarPanel === 'extensions' && 'Extensions'}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {activeSidebarPanel === 'explorer' && <ExplorerPanel />}
        {activeSidebarPanel === 'search' && <SearchPanel />}
        {activeSidebarPanel === 'extensions' && <ExtensionsPanel />}
      </div>
    </div>
  );
};

const ExplorerPanel: React.FC = () => {
  const { files, isLoaded, loadFiles, createFile, deleteFile, renameFile } = useFileSystemStore();
  const { openTab, theme } = useEditorStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [newItemParent, setNewItemParent] = useState<string | null>(null);
  const [newItemType, setNewItemType] = useState<'file' | 'folder' | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    if (!isLoaded) {
      loadFiles();
    }
  }, [isLoaded, loadFiles]);

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateNew = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newItemName.trim()) {
      await createFile(newItemName.trim(), newItemParent || 'root', newItemType!);
      setNewItemType(null);
      setNewItemName('');
    } else if (e.key === 'Escape') {
      setNewItemType(null);
      setNewItemName('');
    }
  };

  const handleRename = async (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter' && renameValue.trim()) {
      await renameFile(id, renameValue.trim());
      setRenamingId(null);
    } else if (e.key === 'Escape') {
      setRenamingId(null);
    }
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.jsx') || name.endsWith('.tsx')) return <FileType2 size={16} className="text-yellow-400" />;
    if (name.endsWith('.json')) return <FileJson size={16} className="text-green-400" />;
    if (name.endsWith('.css')) return <FileCode size={16} className="text-blue-400" />;
    if (name.endsWith('.html')) return <FileCode size={16} className="text-orange-400" />;
    if (name.endsWith('.md')) return <FileText size={16} className="text-blue-300" />;
    if (name.match(/\.(png|jpg|jpeg|svg|gif)$/i)) return <FileImage size={16} className="text-purple-400" />;
    return <FileText size={16} className="text-gray-400" />;
  };

  const renderTree = (parentId: string | null, depth: number = 0) => {
    const children = Object.values(files)
      .filter(f => f.parentId === parentId)
      .sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'folder' ? -1 : 1;
      });

    return (
      <div className="flex flex-col">
        {children.map(node => (
          <React.Fragment key={node.id}>
            <ContextMenu.Root>
              <ContextMenu.Trigger>
                <div 
                  className={`flex items-center py-1 px-2 cursor-pointer hover:bg-[#2a2d2e] ${theme === 'vs-dark' ? 'hover:bg-[#2a2d2e]' : 'hover:bg-[#e8e8e8]'}`}
                  style={{ paddingLeft: `${depth * 12 + 8}px` }}
                  onClick={() => {
                    if (node.type === 'folder') {
                      toggleFolder(node.id);
                    } else {
                      openTab(node.id);
                    }
                  }}
                >
                  <div className="mr-1 w-4 flex justify-center">
                    {node.type === 'folder' && (
                      expandedFolders.has(node.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    )}
                  </div>
                  
                  <div className="mr-1.5 flex justify-center">
                    {node.type === 'folder' ? (
                      expandedFolders.has(node.id) ? <FolderOpen size={16} className="text-blue-400" /> : <Folder size={16} className="text-blue-400" />
                    ) : (
                      getFileIcon(node.name)
                    )}
                  </div>
                  
                  {renamingId === node.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => handleRename(e, node.id)}
                      onBlur={() => setRenamingId(null)}
                      className="bg-[#3c3c3c] text-white px-1 outline-none border border-blue-500 w-full text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-sm truncate select-none">{node.name}</span>
                  )}
                </div>
              </ContextMenu.Trigger>

              <ContextMenu.Portal>
                <ContextMenu.Content className={`min-w-[160px] rounded-md overflow-hidden p-1 shadow-xl border ${theme === 'vs-dark' ? 'bg-[#252526] border-[#454545] text-[#cccccc]' : 'bg-white border-[#cccccc] text-[#333333]'}`}>
                  {node.type === 'folder' && (
                    <>
                      <ContextMenu.Item 
                        className={`flex items-center px-2 py-1.5 text-sm cursor-pointer outline-none ${theme === 'vs-dark' ? 'hover:bg-[#094771] hover:text-white' : 'hover:bg-[#0060c0] hover:text-white'}`}
                        onClick={() => {
                          setNewItemParent(node.id);
                          setNewItemType('file');
                          setExpandedFolders(new Set(expandedFolders).add(node.id));
                        }}
                      >
                        <FilePlus size={14} className="mr-2" /> New File
                      </ContextMenu.Item>
                      <ContextMenu.Item 
                        className={`flex items-center px-2 py-1.5 text-sm cursor-pointer outline-none ${theme === 'vs-dark' ? 'hover:bg-[#094771] hover:text-white' : 'hover:bg-[#0060c0] hover:text-white'}`}
                        onClick={() => {
                          setNewItemParent(node.id);
                          setNewItemType('folder');
                          setExpandedFolders(new Set(expandedFolders).add(node.id));
                        }}
                      >
                        <FolderPlus size={14} className="mr-2" /> New Folder
                      </ContextMenu.Item>
                      <ContextMenu.Separator className={`h-[1px] my-1 ${theme === 'vs-dark' ? 'bg-[#454545]' : 'bg-[#e5e5e5]'}`} />
                    </>
                  )}
                  
                  <ContextMenu.Item 
                    className={`flex items-center px-2 py-1.5 text-sm cursor-pointer outline-none ${theme === 'vs-dark' ? 'hover:bg-[#094771] hover:text-white' : 'hover:bg-[#0060c0] hover:text-white'}`}
                    onClick={() => {
                      setRenamingId(node.id);
                      setRenameValue(node.name);
                    }}
                  >
                    <Edit2 size={14} className="mr-2" /> Rename
                  </ContextMenu.Item>
                  <ContextMenu.Item 
                    className={`flex items-center px-2 py-1.5 text-sm cursor-pointer outline-none text-red-400 ${theme === 'vs-dark' ? 'hover:bg-[#094771] hover:text-white' : 'hover:bg-[#0060c0] hover:text-white'}`}
                    onClick={() => deleteFile(node.id)}
                  >
                    <Trash2 size={14} className="mr-2" /> Delete
                  </ContextMenu.Item>
                </ContextMenu.Content>
              </ContextMenu.Portal>
            </ContextMenu.Root>

            {node.type === 'folder' && expandedFolders.has(node.id) && (
              <>
                {renderTree(node.id, depth + 1)}
                {newItemParent === node.id && newItemType && (
                  <div className="flex items-center py-1 px-2" style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}>
                    <div className="mr-1 w-4"></div>
                    <div className="mr-1.5">
                      {newItemType === 'folder' ? <Folder size={16} className="text-blue-400" /> : <FileText size={16} className="text-gray-400" />}
                    </div>
                    <input
                      autoFocus
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={handleCreateNew}
                      onBlur={() => {
                        setNewItemType(null);
                        setNewItemName('');
                      }}
                      className="bg-[#3c3c3c] text-white px-1 outline-none border border-blue-500 w-full text-sm"
                    />
                  </div>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (!isLoaded) return <div className="p-4 text-sm">Loading workspace...</div>;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-2 py-1 group">
        <div 
          className="flex items-center cursor-pointer text-sm font-bold uppercase tracking-wider"
          onClick={() => toggleFolder('root')}
        >
          {expandedFolders.has('root') ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
          WORKSPACE
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div 
            className="p-1 cursor-pointer hover:bg-[#3c3c3c] rounded"
            onClick={() => {
              setNewItemParent('root');
              setNewItemType('file');
              setExpandedFolders(new Set(expandedFolders).add('root'));
            }}
          >
            <FilePlus size={14} />
          </div>
          <div 
            className="p-1 cursor-pointer hover:bg-[#3c3c3c] rounded"
            onClick={() => {
              setNewItemParent('root');
              setNewItemType('folder');
              setExpandedFolders(new Set(expandedFolders).add('root'));
            }}
          >
            <FolderPlus size={14} />
          </div>
        </div>
      </div>
      
      {expandedFolders.has('root') && (
        <div className="flex flex-col pb-4">
          {renderTree('root')}
          {newItemParent === 'root' && newItemType && (
            <div className="flex items-center py-1 px-2" style={{ paddingLeft: '8px' }}>
              <div className="mr-1 w-4"></div>
              <div className="mr-1.5">
                {newItemType === 'folder' ? <Folder size={16} className="text-blue-400" /> : <FileText size={16} className="text-gray-400" />}
              </div>
              <input
                autoFocus
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={handleCreateNew}
                onBlur={() => {
                  setNewItemType(null);
                  setNewItemName('');
                }}
                className="bg-[#3c3c3c] text-white px-1 outline-none border border-blue-500 w-full text-sm"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SearchPanel: React.FC = () => {
  return (
    <div className="p-4 flex flex-col space-y-4">
      <div className="flex flex-col">
        <input 
          type="text" 
          placeholder="Search" 
          className="bg-[#3c3c3c] text-[#cccccc] border border-[#3c3c3c] focus:border-blue-500 outline-none px-2 py-1 text-sm rounded"
        />
      </div>
      <div className="flex flex-col">
        <input 
          type="text" 
          placeholder="Replace" 
          className="bg-[#3c3c3c] text-[#cccccc] border border-[#3c3c3c] focus:border-blue-500 outline-none px-2 py-1 text-sm rounded"
        />
      </div>
      <div className="text-xs text-gray-500 mt-4">
        Search functionality is a placeholder.
      </div>
    </div>
  );
};

const ExtensionsPanel: React.FC = () => {
  return (
    <div className="p-4 flex flex-col space-y-4">
      <div className="flex flex-col">
        <input 
          type="text" 
          placeholder="Search Extensions in Marketplace" 
          className="bg-[#3c3c3c] text-[#cccccc] border border-[#3c3c3c] focus:border-blue-500 outline-none px-2 py-1 text-sm rounded"
        />
      </div>
      <div className="text-xs text-gray-500 mt-4">
        Extensions are not supported in this offline PWA version.
      </div>
    </div>
  );
};
