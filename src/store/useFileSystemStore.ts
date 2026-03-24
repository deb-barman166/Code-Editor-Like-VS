import { create } from 'zustand';
import { get, set } from 'idb-keyval';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  content?: string;
  language?: string;
}

interface FileSystemState {
  files: Record<string, FileNode>;
  isLoaded: boolean;
  loadFiles: () => Promise<void>;
  createFile: (name: string, parentId: string | null, type: 'file' | 'folder', content?: string) => Promise<string>;
  updateFileContent: (id: string, content: string) => Promise<void>;
  renameFile: (id: string, newName: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  getFile: (id: string) => FileNode | undefined;
  getChildren: (parentId: string | null) => FileNode[];
}

const FS_KEY = 'vscode-pwa-fs';

const defaultFiles: Record<string, FileNode> = {
  'root': { id: 'root', name: 'root', type: 'folder', parentId: null },
  '1': { id: '1', name: 'index.html', type: 'file', parentId: 'root', language: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello World</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>' },
  '2': { id: '2', name: 'main.js', type: 'file', parentId: 'root', language: 'javascript', content: 'console.log("Hello World");' },
  '3': { id: '3', name: 'style.css', type: 'file', parentId: 'root', language: 'css', content: 'body {\n  background-color: #1e1e1e;\n  color: white;\n}' },
};

export const useFileSystemStore = create<FileSystemState>((setStore, getStore) => ({
  files: {},
  isLoaded: false,

  loadFiles: async () => {
    try {
      const storedFiles = await get<Record<string, FileNode>>(FS_KEY);
      if (storedFiles) {
        setStore({ files: storedFiles, isLoaded: true });
      } else {
        await set(FS_KEY, defaultFiles);
        setStore({ files: defaultFiles, isLoaded: true });
      }
    } catch (error) {
      console.error('Failed to load files from IndexedDB', error);
      setStore({ files: defaultFiles, isLoaded: true });
    }
  },

  createFile: async (name, parentId, type, content = '') => {
    const id = Date.now().toString();
    const extension = name.split('.').pop()?.toLowerCase();
    
    let language = 'plaintext';
    if (type === 'file') {
      const langMap: Record<string, string> = {
        'js': 'javascript', 'ts': 'typescript', 'jsx': 'javascript', 'tsx': 'typescript',
        'html': 'html', 'css': 'css', 'json': 'json', 'md': 'markdown', 'py': 'python',
        'cpp': 'cpp', 'c': 'c', 'java': 'java'
      };
      language = langMap[extension || ''] || 'plaintext';
    }

    const newNode: FileNode = { id, name, type, parentId, content, language };
    
    const newFiles = { ...getStore().files, [id]: newNode };
    setStore({ files: newFiles });
    await set(FS_KEY, newFiles);
    return id;
  },

  updateFileContent: async (id, content) => {
    const files = getStore().files;
    if (!files[id] || files[id].type !== 'file') return;

    const newFiles = {
      ...files,
      [id]: { ...files[id], content }
    };
    setStore({ files: newFiles });
    await set(FS_KEY, newFiles);
  },

  renameFile: async (id, newName) => {
    const files = getStore().files;
    if (!files[id]) return;

    const newFiles = {
      ...files,
      [id]: { ...files[id], name: newName }
    };
    
    // Update language if extension changed
    if (files[id].type === 'file') {
      const extension = newName.split('.').pop()?.toLowerCase();
      const langMap: Record<string, string> = {
        'js': 'javascript', 'ts': 'typescript', 'jsx': 'javascript', 'tsx': 'typescript',
        'html': 'html', 'css': 'css', 'json': 'json', 'md': 'markdown', 'py': 'python',
        'cpp': 'cpp', 'c': 'c', 'java': 'java'
      };
      newFiles[id].language = langMap[extension || ''] || 'plaintext';
    }

    setStore({ files: newFiles });
    await set(FS_KEY, newFiles);
  },

  deleteFile: async (id) => {
    const files = getStore().files;
    if (!files[id]) return;

    const newFiles = { ...files };
    
    // Recursively delete children if it's a folder
    const deleteRecursive = (nodeId: string) => {
      const children = Object.values(newFiles).filter(f => f.parentId === nodeId);
      children.forEach(child => deleteRecursive(child.id));
      delete newFiles[nodeId];
    };
    
    deleteRecursive(id);
    
    setStore({ files: newFiles });
    await set(FS_KEY, newFiles);
  },

  getFile: (id) => getStore().files[id],

  getChildren: (parentId) => {
    return Object.values(getStore().files)
      .filter(f => f.parentId === parentId)
      .sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'folder' ? -1 : 1;
      });
  }
}));
