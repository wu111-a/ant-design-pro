import { Input, Tree } from 'antd';
import { useState } from 'react';

const { Search } = Input;

const treeData = [
  {
    title: 'Node 1',
    key: '1',
    children: [
      {
        title: 'Child Node 1',
        key: '1-1',
      },
      {
        title: 'Child Node 2',
        key: '1-2',
      },
    ],
  },
  {
    title: 'Node 2',
    key: '2',
  },
];

const TreeWithSearch = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onSearch = (value) => {
    const expandedKeys = treeData
      .map((node) => {
        if (node.title.toLowerCase().includes(value.toLowerCase())) {
          return getParentKeys(node.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const getParentKeys = (key, tree, parentKeys = []) => {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKeys.push(node.key);
        } else if (getParentKeys(key, node.children, parentKeys)) {
          parentKeys.push(node.key);
        }
      }
    }
    return parentKeys;
  };

  const renderTreeNodes = (data) =>
    data.map((node) => {
      const { title, key, children } = node;
      const isMatched = title.toLowerCase().includes(searchValue.toLowerCase());

      if (children) {
        return (
          <Tree.TreeNode title={isMatched ? <strong>{title}</strong> : title} key={key}>
            {renderTreeNodes(children)}
          </Tree.TreeNode>
        );
      }

      return <Tree.TreeNode title={isMatched ? <strong>{title}</strong> : title} key={key} />;
    });

  return (
    <div>
      <Search
        style={{ marginBottom: 8 }}
        placeholder="Search"
        onChange={(e) => onSearch(e.target.value)}
      />
      <Tree
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onExpand={(keys) => setExpandedKeys(keys)}
      >
        {renderTreeNodes(treeData)}
      </Tree>
    </div>
  );
};

export default TreeWithSearch;
