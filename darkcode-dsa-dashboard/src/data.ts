/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DSATopic } from './types';

export const DEFAULT_DSA_ROADMAP: DSATopic[] = [
  {
    id: 'arrays-hashing',
    name: 'Arrays & Hashing',
    iconName: 'Grid',
    description: 'Fundamental lookup patterns, hashing counters, and array positioning.',
    problems: [
      {
        id: 'contains-duplicate',
        title: 'Contains Duplicate',
        url: 'https://leetcode.com/problems/contains-duplicate/',
        difficulty: 'Easy',
        topicId: 'arrays-hashing'
      },
      {
        id: 'two-sum',
        title: 'Two Sum',
        url: 'https://leetcode.com/problems/two-sum/',
        difficulty: 'Easy',
        topicId: 'arrays-hashing'
      },
      {
        id: 'group-anagrams',
        title: 'Group Anagrams',
        url: 'https://leetcode.com/problems/group-anagrams/',
        difficulty: 'Medium',
        topicId: 'arrays-hashing'
      },
      {
        id: 'product-of-array-except-self',
        title: 'Product of Array Except Self',
        url: 'https://leetcode.com/problems/product-of-array-except-self/',
        difficulty: 'Medium',
        topicId: 'arrays-hashing'
      }
    ]
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    iconName: 'ArrowLeftRight',
    description: 'Linear scanning using dual indexes to find pairs, subsets, or palindromes.',
    problems: [
      {
        id: 'valid-palindrome',
        title: 'Valid Palindrome',
        url: 'https://leetcode.com/problems/valid-palindrome/',
        difficulty: 'Easy',
        topicId: 'two-pointers'
      },
      {
        id: 'two-sum-ii',
        title: 'Two Sum II - Input Array Is Sorted',
        url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
        difficulty: 'Medium',
        topicId: 'two-pointers'
      },
      {
        id: '3sum',
        title: '3Sum',
        url: 'https://leetcode.com/problems/3sum/',
        difficulty: 'Medium',
        topicId: 'two-pointers'
      },
      {
        id: 'container-with-most-water',
        title: 'Container With Most Water',
        url: 'https://leetcode.com/problems/container-with-most-water/',
        difficulty: 'Medium',
        topicId: 'two-pointers'
      }
    ]
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    iconName: 'Minimize2',
    description: 'Dynamic subarray boundaries to capture optimal contiguous segments.',
    problems: [
      {
        id: 'best-time-to-buy-and-sell-stock',
        title: 'Best Time to Buy and Sell Stock',
        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        difficulty: 'Easy',
        topicId: 'sliding-window'
      },
      {
        id: 'longest-substring-without-repeating-characters',
        title: 'Longest Substring Without Repeating Characters',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        difficulty: 'Medium',
        topicId: 'sliding-window'
      },
      {
        id: 'longest-repeating-character-replacement',
        title: 'Longest Repeating Character Replacement',
        url: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
        difficulty: 'Medium',
        topicId: 'sliding-window'
      }
    ]
  },
  {
    id: 'stack',
    name: 'Stack',
    iconName: 'Layers',
    description: 'Last-In, First-Out (LIFO) tracking for nested patterns, parentheses, and evaluations.',
    problems: [
      {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        url: 'https://leetcode.com/problems/valid-parentheses/',
        difficulty: 'Easy',
        topicId: 'stack'
      },
      {
        id: 'min-stack',
        title: 'Min Stack',
        url: 'https://leetcode.com/problems/min-stack/',
        difficulty: 'Medium',
        topicId: 'stack'
      },
      {
        id: 'evaluate-reverse-polish-notation',
        title: 'Evaluate Reverse Polish Notation',
        url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
        difficulty: 'Medium',
        topicId: 'stack'
      }
    ]
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    iconName: 'Search',
    description: 'O(log N) partitioning of ordered arrays to narrow coordinates quickly.',
    problems: [
      {
        id: 'binary-search-prob',
        title: 'Binary Search',
        url: 'https://leetcode.com/problems/binary-search/',
        difficulty: 'Easy',
        topicId: 'binary-search'
      },
      {
        id: 'search-a-2d-matrix',
        title: 'Search a 2D Matrix',
        url: 'https://leetcode.com/problems/search-a-2d-matrix/',
        difficulty: 'Medium',
        topicId: 'binary-search'
      },
      {
        id: 'find-minimum-in-rotated-sorted-array',
        title: 'Find Minimum in Rotated Sorted Array',
        url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
        difficulty: 'Medium',
        topicId: 'binary-search'
      }
    ]
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    iconName: 'GitFork',
    description: 'Node chaining, pointer manipulation, and cycle tracking strategies.',
    problems: [
      {
        id: 'reverse-linked-list',
        title: 'Reverse Linked List',
        url: 'https://leetcode.com/problems/reverse-linked-list/',
        difficulty: 'Easy',
        topicId: 'linked-list'
      },
      {
        id: 'merge-two-sorted-lists',
        title: 'Merge Two Sorted Lists',
        url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
        difficulty: 'Easy',
        topicId: 'linked-list'
      },
      {
        id: 'linked-list-cycle',
        title: 'Linked List Cycle',
        url: 'https://leetcode.com/problems/linked-list-cycle/',
        difficulty: 'Easy',
        topicId: 'linked-list'
      },
      {
        id: 'remove-nth-node-from-end-of-list',
        title: 'Remove Nth Node From End of List',
        url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
        difficulty: 'Medium',
        topicId: 'linked-list'
      }
    ]
  },
  {
    id: 'trees',
    name: 'Trees & Graphs',
    iconName: 'GitMerge',
    description: 'Hierarchical node traversal, preorder/inorder parsing, and shortest-path solutions.',
    problems: [
      {
        id: 'invert-binary-tree',
        title: 'Invert Binary Tree',
        url: 'https://leetcode.com/problems/invert-binary-tree/',
        difficulty: 'Easy',
        topicId: 'trees'
      },
      {
        id: 'maximum-depth-of-binary-tree',
        title: 'Maximum Depth of Binary Tree',
        url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
        difficulty: 'Easy',
        topicId: 'trees'
      },
      {
        id: 'validate-binary-search-tree',
        title: 'Validate Binary Search Tree',
        url: 'https://leetcode.com/problems/validate-binary-search-tree/',
        difficulty: 'Medium',
        topicId: 'trees'
      },
      {
        id: 'number-of-islands',
        title: 'Number of Islands',
        url: 'https://leetcode.com/problems/number-of-islands/',
        difficulty: 'Medium',
        topicId: 'trees'
      }
    ]
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    iconName: 'CornerDownLeft',
    description: 'Permutation, combinations, and exhausting search spaces recursively.',
    problems: [
      {
        id: 'subsets',
        title: 'Subsets',
        url: 'https://leetcode.com/problems/subsets/',
        difficulty: 'Medium',
        topicId: 'backtracking'
      },
      {
        id: 'combination-sum',
        title: 'Combination Sum',
        url: 'https://leetcode.com/problems/combination-sum/',
        difficulty: 'Medium',
        topicId: 'backtracking'
      },
      {
        id: 'permutations',
        title: 'Permutations',
        url: 'https://leetcode.com/problems/permutations/',
        difficulty: 'Medium',
        topicId: 'backtracking'
      }
    ]
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    iconName: 'TrendingUp',
    description: 'Breaking issues into reusable overlapping sub-problems using memoization or tabulating.',
    problems: [
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        url: 'https://leetcode.com/problems/climbing-stairs/',
        difficulty: 'Easy',
        topicId: 'dynamic-programming'
      },
      {
        id: 'house-robber',
        title: 'House Robber',
        url: 'https://leetcode.com/problems/house-robber/',
        difficulty: 'Medium',
        topicId: 'dynamic-programming'
      },
      {
        id: 'coin-change',
        title: 'Coin Change',
        url: 'https://leetcode.com/problems/coin-change/',
        difficulty: 'Medium',
        topicId: 'dynamic-programming'
      },
      {
        id: 'longest-increasing-subsequence',
        title: 'Longest Increasing Subsequence',
        url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
        difficulty: 'Medium',
        topicId: 'dynamic-programming'
      }
    ]
  }
];

/**
 * Robustly normalizes and extracts the LeetCode slug from a given URL or slug name.
 * Handles forms like:
 * - https://leetcode.com/problems/two-sum/
 * - leetcode.com/problems/two-sum
 * - two-sum
 * - https://leetcode.com/problems/two-sum/description/
 */
export function extractLeetCodeSlug(input: string): string {
  if (!input) return '';
  let cleanInput = input.trim().toLowerCase();
  
  // Strip protocol and www if exists
  cleanInput = cleanInput.replace(/^(https?:\/\/)?(www\.)?/, '');
  
  // If it contains leetcode.com/problems/ or leetcode.cn/problems/
  const match = cleanInput.match(/(leetcode\.(com|cn))\/problems\/([a-z0-9\-]+)/);
  if (match && match[3]) {
    return match[3];
  }
  
  // If it's just a general string or has slashes
  const parts = cleanInput.split('/').filter(p => p.length > 0);
  if (parts.length > 0) {
    // If input is "leetcode.com/problems/two-sum", third part is "two-sum"
    const problemsIdx = parts.indexOf('problems');
    if (problemsIdx !== -1 && parts[problemsIdx + 1]) {
      return parts[problemsIdx + 1];
    }
    // Return last non-empty segment if user paste something like "/problems/two-sum/"
    return parts[parts.length - 1];
  }
  
  return cleanInput;
}
