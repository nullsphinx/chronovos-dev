import { useState } from 'react';
import { TAG_HIERARCHY, getTopLevelTags, TagNode } from '../data/tags';

interface TagFilterMenuProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export function TagFilterMenu({ selectedTags, onTagToggle }: TagFilterMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const topLevelTags = getTopLevelTags();

  const getAllDescendantTags = (tagName: string): string[] => {
    const node = findNode(TAG_HIERARCHY, tagName);
    if (!node) return [];
    
    let descendants: string[] = [];
    if (node.children) {
      node.children.forEach(child => {
        descendants.push(child.name);
        descendants = descendants.concat(getAllDescendantTags(child.name));
      });
    }
    return descendants;
  };

  const handleTagSelect = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    const allDescendants = getAllDescendantTags(tag);
    
    if (isSelected) {
      onTagToggle(tag);
      allDescendants.forEach(descendant => {
        if (selectedTags.includes(descendant)) {
          onTagToggle(descendant);
        }
      });
    } else {
      onTagToggle(tag);
      allDescendants.forEach(descendant => {
        if (!selectedTags.includes(descendant)) {
          onTagToggle(descendant);
        }
      });
    }
  };

  const isTagGroupSelected = (tagName: string) => {
    const allDescendants = getAllDescendantTags(tagName);
    const isSelected = selectedTags.includes(tagName);
    const allDescendantsSelected = allDescendants.every(tag => selectedTags.includes(tag));
    return isSelected && allDescendantsSelected;
  };

  const findNode = (nodes: TagNode[], target: string): TagNode | undefined => {
    for (const node of nodes) {
      if (node.name === target) return node;
      if (node.children) {
        const found = findNode(node.children, target);
        if (found) return found;
      }
    }
    return undefined;
  };

  const renderTagHierarchy = (tag: string, level: number = 0) => {
    const node = findNode(TAG_HIERARCHY, tag);
    const children = node?.children || [];
    const isSelected = selectedTags.includes(tag);
    const isGroupSelected = isTagGroupSelected(tag);

    return (
      <div key={tag} className="space-y-0.5">
        <button
          onClick={() => handleTagSelect(tag)}
          className={`w-full text-left px-2 py-1 rounded text-xs transition-all duration-200 ${
            isSelected || isGroupSelected
              ? 'bg-primary-600/80 text-white hover:bg-primary-700/80'
              : 'bg-neutral-800/50 text-neutral-200 hover:bg-neutral-700/50'
          }`}
          style={{ marginLeft: `${level * 0.5}rem` }}
        >
          {tag}
        </button>
        {children.map(childNode => renderTagHierarchy(childNode.name, level + 1))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-neutral-900/95 backdrop-blur-sm">
      <div className="p-2 border-b border-neutral-800">
        <h2 className="text-sm font-semibold text-neutral-100 mb-2">Filter by Tags</h2>
        <input
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-1 text-xs bg-neutral-800 text-neutral-100 rounded border border-neutral-700 focus:outline-none focus:border-primary-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {topLevelTags.map(tag => renderTagHierarchy(tag))}
      </div>
    </div>
  );
} 