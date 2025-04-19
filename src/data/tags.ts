export interface TagNode {
  name: string;
  children?: TagNode[];
}

export const TAG_HIERARCHY: TagNode[] = [
  {
    name: "Cultural",
    children: [
      {
        name: "Arts & Expression",
        children: [
          { name: "Visual Art" },
          { name: "Literature" },
          { name: "Music" },
          { name: "Architecture" },
          { name: "Performance" }
        ]
      },
      {
        name: "Daily Life",
        children: [
          { name: "Customs" },
          { name: "Fashion" },
          { name: "Food" },
          { name: "Social Practices" }
        ]
      },
      {
        name: "Belief Systems",
        children: [
          { name: "Religion" },
          { name: "Philosophy" },
          { name: "Mythology" },
          { name: "Ethics" }
        ]
      }
    ]
  },
  {
    name: "Economic",
    children: [
      {
        name: "Economic Theories & Systems",
        children: [
          { name: "Economic Theory" },
          { name: "Communism" },
          { name: "Capitalism" },
          { name: "Socialism" },
          { name: "Fascism" },
          { name: "Market Systems" }
        ]
      },
      {
        name: "Industrial Developments",
        children: [
          { name: "Manufacturing" },
          { name: "Agriculture" },
          { name: "Mining" },
          { name: "Construction" }
        ]
      },
      {
        name: "Trade & Commerce",
        children: [
          { name: "Trade Routes" },
          { name: "Maritime Trade" },
          { name: "Markets" },
          { name: "Commercial Laws" }
        ]
      }
    ]
  },
  {
    name: "Environmental",
    children: [
      {
        name: "Climate & Geography",
        children: [
          { name: "Natural Features" },
          { name: "Climate Events" },
          { name: "Weather Patterns" },
          { name: "Geographical Discovery" }
        ]
      },
      {
        name: "Human Impact",
        children: [
          { name: "Agriculture" },
          { name: "Urban Development" },
          { name: "Resource Extraction" },
          { name: "Environmental Change" }
        ]
      },
      {
        name: "Natural Events",
        children: [
          { name: "Natural Disasters" },
          { name: "Geological Events" },
          { name: "Astronomical Events" },
          { name: "Climate Changes" }
        ]
      }
    ]
  },
  {
    name: "Political",
    children: [
      {
        name: "Governance",
        children: [
          { name: "Empires" },
          { name: "Kingdoms" },
          { name: "City-States" },
          { name: "Republics" },
          { name: "Political Systems" }
        ]
      },
      {
        name: "Diplomacy",
        children: [
          { name: "Treaties" },
          { name: "Alliances" },
          { name: "Diplomatic Relations" },
          { name: "Peace Agreements" }
        ]
      },
      {
        name: "Conflict",
        children: [
          { name: "War" },
          { name: "Battle" },
          { name: "Civil Conflict" },
          { name: "Revolution" },
          { name: "Military Campaign" }
        ]
      },
      {
        name: "Law & Administration",
        children: [
          { name: "Legal Systems" },
          { name: "Administrative Systems" },
          { name: "Government Reforms" },
          { name: "Political Movements" }
        ]
      }
    ]
  },
  {
    name: "Scientific",
    children: [
      {
        name: "Mathematics",
        children: [
          { name: "Mathematical Theory" },
          { name: "Geometry" },
          { name: "Algebra" },
          { name: "Mathematical Tools" }
        ]
      },
      {
        name: "Natural Sciences",
        children: [
          { name: "Physics" },
          { name: "Chemistry" },
          { name: "Biology" },
          { name: "Astronomy" }
        ]
      },
      {
        name: "Technology",
        children: [
          { name: "Inventions" },
          { name: "Tools" },
          { name: "Machines" },
          { name: "Engineering" },
          { name: "Technical Innovations" }
        ]
      },
      {
        name: "Medicine",
        children: [
          { name: "Medical Discoveries" },
          { name: "Medical Practices" },
          { name: "Diseases" },
          { name: "Public Health" }
        ]
      },
      {
        name: "Scientific Movements",
        children: [
          { name: "Renaissance Science" },
          { name: "Enlightenment" },
          { name: "Scientific Revolution" },
          { name: "Other Major Shifts in Scientific Thought" }
        ]
      }
    ]
  },
  {
    name: "Social",
    children: [
      {
        name: "Social Structure",
        children: [
          { name: "Class Systems" },
          { name: "Social Hierarchy" },
          { name: "Family Structures" },
          { name: "Gender Roles" }
        ]
      },
      {
        name: "Education",
        children: [
          { name: "Learning Systems" },
          { name: "Universities" },
          { name: "Literary Traditions" },
          { name: "Knowledge Transfer" }
        ]
      },
      {
        name: "Population",
        children: [
          { name: "Migration" },
          { name: "Demographics" },
          { name: "Urbanization" },
          { name: "Settlement Patterns" }
        ]
      }
    ]
  }
];

// Helper function to get all child tags of a given tag
export function getAllChildTags(tagName: string): string[] {
  function findNode(nodes: TagNode[], target: string): TagNode | undefined {
    for (const node of nodes) {
      if (node.name === target) return node;
      if (node.children) {
        const found = findNode(node.children, target);
        if (found) return found;
      }
    }
    return undefined;
  }

  function collectTags(node: TagNode): string[] {
    const tags = [node.name];
    if (node.children) {
      node.children.forEach(child => {
        tags.push(...collectTags(child));
      });
    }
    return tags;
  }

  const node = findNode(TAG_HIERARCHY, tagName);
  if (!node) return [tagName];
  return collectTags(node);
}

// Helper function to get all available tags
export function getAllTags(): string[] {
  const tags = new Set<string>();
  
  function traverse(node: TagNode) {
    tags.add(node.name);
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  
  TAG_HIERARCHY.forEach(traverse);
  return Array.from(tags);
}

// Helper function to get top-level tags
export function getTopLevelTags(): string[] {
  return TAG_HIERARCHY.map(node => node.name);
}

// Helper function to get parent tag
export function getParentTag(tagName: string): string | null {
  function findParent(nodes: TagNode[], target: string, parent: string | null = null): string | null {
    for (const node of nodes) {
      if (node.name === target) return parent;
      if (node.children) {
        const found = findParent(node.children, target, node.name);
        if (found !== null) return found;
      }
    }
    return null;
  }

  return findParent(TAG_HIERARCHY, tagName);
} 