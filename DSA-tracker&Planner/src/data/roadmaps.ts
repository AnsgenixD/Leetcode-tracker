import { CuratedRoadmap } from '../types';

export const CURATED_ROADMAPS: CuratedRoadmap[] = [
  {
    id: 'blind75',
    name: 'Blind 75',
    description: 'The standard curated list of 75 essential LeetCode questions to master DSA pattern fundamentals.',
    problems: [
      // Arrays & Hashing
      {
        id: 'contains-duplicate',
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        category: 'Arrays & Hashing',
        url: 'https://leetcode.com/problems/contains-duplicate/'
      },
      {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        category: 'Arrays & Hashing',
        url: 'https://leetcode.com/problems/two-sum/'
      },
      {
        id: 'valid-anagram',
        title: 'Valid Anagram',
        difficulty: 'Easy',
        category: 'Arrays & Hashing',
        url: 'https://leetcode.com/problems/valid-anagram/'
      },
      {
        id: 'group-anagrams',
        title: 'Group Anagrams',
        difficulty: 'Medium',
        category: 'Arrays & Hashing',
        url: 'https://leetcode.com/problems/group-anagrams/'
      },
      {
        id: 'top-k-frequent-elements',
        title: 'Top K Frequent Elements',
        difficulty: 'Medium',
        category: 'Arrays & Hashing',
        url: 'https://leetcode.com/problems/top-k-frequent-elements/'
      },
      {
        id: 'product-of-array-except-self',
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        category: 'Arrays & Hashing',
        url: 'https://leetcode.com/problems/product-of-array-except-self/'
      },
      // Two Pointers
      {
        id: 'valid-palindrome',
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        category: 'Two Pointers',
        url: 'https://leetcode.com/problems/valid-palindrome/'
      },
      {
        id: '3sum',
        title: '3Sum',
        difficulty: 'Medium',
        category: 'Two Pointers',
        url: 'https://leetcode.com/problems/3sum/'
      },
      {
        id: 'container-with-most-water',
        title: 'Container With Most Water',
        difficulty: 'Medium',
        category: 'Two Pointers',
        url: 'https://leetcode.com/problems/container-with-most-water/'
      },
      // Sliding Window
      {
        id: 'best-time-to-buy-and-sell-stock',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        category: 'Sliding Window',
        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'
      },
      {
        id: 'longest-substring-without-repeating-characters',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        category: 'Sliding Window',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'
      },
      {
        id: 'longest-repeating-character-replacement',
        title: 'Longest Repeating Character Replacement',
        difficulty: 'Medium',
        category: 'Sliding Window',
        url: 'https://leetcode.com/problems/longest-repeating-character-replacement/'
      },
      {
        id: 'minimum-window-substring',
        title: 'Minimum Window Substring',
        difficulty: 'Hard',
        category: 'Sliding Window',
        url: 'https://leetcode.com/problems/minimum-window-substring/'
      },
      // Stack
      {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        category: 'Stack',
        url: 'https://leetcode.com/problems/valid-parentheses/'
      },
      // Binary Search
      {
        id: 'search-in-rotated-sorted-array',
        title: 'Search in Rotated Sorted Array',
        difficulty: 'Medium',
        category: 'Binary Search',
        url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/'
      },
      {
        id: 'find-minimum-in-rotated-sorted-array',
        title: 'Find Minimum in Rotated Sorted Array',
        difficulty: 'Medium',
        category: 'Binary Search',
        url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/'
      },
      // Linked List
      {
        id: 'reverse-linked-list',
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/reverse-linked-list/'
      },
      {
        id: 'merge-two-sorted-lists',
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/merge-two-sorted-lists/'
      },
      {
        id: 'reorder-list',
        title: 'Reorder List',
        difficulty: 'Medium',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/reorder-list/'
      },
      {
        id: 'remove-nth-node-from-end-of-list',
        title: 'Remove Nth Node From End of List',
        difficulty: 'Medium',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/'
      },
      {
        id: 'linked-list-cycle',
        title: 'Linked List Cycle',
        difficulty: 'Easy',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/linked-list-cycle/'
      },
      {
        id: 'merge-k-sorted-lists',
        title: 'Merge k Sorted Lists',
        difficulty: 'Hard',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/merge-k-sorted-lists/'
      },
      // Trees
      {
        id: 'invert-binary-tree',
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        category: 'Trees',
        url: 'https://leetcode.com/problems/invert-binary-tree/'
      },
      {
        id: 'maximum-depth-of-binary-tree',
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'Easy',
        category: 'Trees',
        url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/'
      },
      {
        id: 'same-tree',
        title: 'Same Tree',
        difficulty: 'Easy',
        category: 'Trees',
        url: 'https://leetcode.com/problems/same-tree/'
      },
      {
        id: 'subtree-of-another-tree',
        title: 'Subtree of Another Tree',
        difficulty: 'Easy',
        category: 'Trees',
        url: 'https://leetcode.com/problems/subtree-of-another-tree/'
      },
      {
        id: 'lowest-common-ancestor-of-a-binary-search-tree',
        title: 'Lowest Common Ancestor of a Binary Search Tree',
        difficulty: 'Medium',
        category: 'Trees',
        url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/'
      },
      {
        id: 'binary-tree-level-order-traversal',
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'Medium',
        category: 'Trees',
        url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/'
      },
      {
        id: 'validate-binary-search-tree',
        title: 'Validate Binary Search Tree',
        difficulty: 'Medium',
        category: 'Trees',
        url: 'https://leetcode.com/problems/validate-binary-search-tree/'
      },
      {
        id: 'kth-smallest-element-in-a-bst',
        title: 'Kth Smallest Element in a BST',
        difficulty: 'Medium',
        category: 'Trees',
        url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/'
      },
      // Backtracking
      {
        id: 'combination-sum',
        title: 'Combination Sum',
        difficulty: 'Medium',
        category: 'Backtracking',
        url: 'https://leetcode.com/problems/combination-sum/'
      },
      {
        id: 'word-search',
        title: 'Word Search',
        difficulty: 'Medium',
        category: 'Backtracking',
        url: 'https://leetcode.com/problems/word-search/'
      },
      // Graphs
      {
        id: 'number-of-islands',
        title: 'Number of Islands',
        difficulty: 'Medium',
        category: 'Graphs',
        url: 'https://leetcode.com/problems/number-of-islands/'
      },
      {
        id: 'clone-graph',
        title: 'Clone Graph',
        difficulty: 'Medium',
        category: 'Graphs',
        url: 'https://leetcode.com/problems/clone-graph/'
      },
      {
        id: 'pacific-atlantic-water-flow',
        title: 'Pacific Atlantic Water Flow',
        difficulty: 'Medium',
        category: 'Graphs',
        url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/'
      },
      {
        id: 'course-schedule',
        title: 'Course Schedule',
        difficulty: 'Medium',
        category: 'Graphs',
        url: 'https://leetcode.com/problems/course-schedule/'
      },
      // Dynamic Programming
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/climbing-stairs/'
      },
      {
        id: 'house-robber',
        title: 'House Robber',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/house-robber/'
      },
      {
        id: 'house-robber-ii',
        title: 'House Robber II',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/house-robber-ii/'
      },
      {
        id: 'coin-change',
        title: 'Coin Change',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/coin-change/'
      },
      {
        id: 'longest-increasing-subsequence',
        title: 'Longest Increasing Subsequence',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/longest-increasing-subsequence/'
      },
      {
        id: 'longest-common-subsequence',
        title: 'Longest Common Subsequence',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/longest-common-subsequence/'
      }
    ]
  },
  {
    id: 'neetcode150',
    name: 'NeetCode 150',
    description: 'A comprehensive, hand-picked set of 150 problems across typical algorithmic interview structures.',
    problems: [
      // Arrays & Hashing
      {
        id: 'contains-duplicate',
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        category: 'Arrays & Hashing',
        url: 'https://leetcode.com/problems/contains-duplicate/'
      },
      {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        category: 'Arrays & Hashing',
        url: 'https://leetcode.com/problems/two-sum/'
      },
      {
        id: 'valid-anagram',
        title: 'Valid Anagram',
        difficulty: 'Easy',
        category: 'Arrays & Hashing',
        url: 'https://leetcode.com/problems/valid-anagram/'
      },
      {
        id: 'group-anagrams',
        title: 'Group Anagrams',
        difficulty: 'Medium',
        category: 'Arrays & Hashing',
        url: 'https://leetcode.com/problems/group-anagrams/'
      },
      {
        id: 'top-k-frequent-elements',
        title: 'Top K Frequent Elements',
        difficulty: 'Medium',
        category: 'Arrays & Hashing',
        url: 'https://leetcode.com/problems/top-k-frequent-elements/'
      },
      {
        id: 'product-of-array-except-self',
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        category: 'Arrays & Hashing',
        url: 'https://leetcode.com/problems/product-of-array-except-self/'
      },
      {
        id: 'valid-sudoku',
        title: 'Valid Sudoku',
        difficulty: 'Medium',
        category: 'Arrays & Hashing',
        url: 'https://leetcode.com/problems/valid-sudoku/'
      },
      {
        id: 'longest-consecutive-sequence',
        title: 'Longest Consecutive Sequence',
        difficulty: 'Medium',
        category: 'Arrays & Hashing',
        url: 'https://leetcode.com/problems/longest-consecutive-sequence/'
      },
      // Two Pointers
      {
        id: 'valid-palindrome',
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        category: 'Two Pointers',
        url: 'https://leetcode.com/problems/valid-palindrome/'
      },
      {
        id: 'two-sum-ii-input-array-is-sorted',
        title: 'Two Sum II - Input Array Is Sorted',
        difficulty: 'Medium',
        category: 'Two Pointers',
        url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/'
      },
      {
        id: '3sum',
        title: '3Sum',
        difficulty: 'Medium',
        category: 'Two Pointers',
        url: 'https://leetcode.com/problems/3sum/'
      },
      {
        id: 'container-with-most-water',
        title: 'Container With Most Water',
        difficulty: 'Medium',
        category: 'Two Pointers',
        url: 'https://leetcode.com/problems/container-with-most-water/'
      },
      {
        id: 'trapping-rain-water',
        title: 'Trapping Rain Water',
        difficulty: 'Hard',
        category: 'Two Pointers',
        url: 'https://leetcode.com/problems/trapping-rain-water/'
      },
      // Sliding Window
      {
        id: 'best-time-to-buy-and-sell-stock',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        category: 'Sliding Window',
        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'
      },
      {
        id: 'longest-substring-without-repeating-characters',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        category: 'Sliding Window',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'
      },
      {
        id: 'longest-repeating-character-replacement',
        title: 'Longest Repeating Character Replacement',
        difficulty: 'Medium',
        category: 'Sliding Window',
        url: 'https://leetcode.com/problems/longest-repeating-character-replacement/'
      },
      {
        id: 'permutation-in-string',
        title: 'Permutation in String',
        difficulty: 'Medium',
        category: 'Sliding Window',
        url: 'https://leetcode.com/problems/permutation-in-string/'
      },
      {
        id: 'minimum-window-substring',
        title: 'Minimum Window Substring',
        difficulty: 'Hard',
        category: 'Sliding Window',
        url: 'https://leetcode.com/problems/minimum-window-substring/'
      },
      // Stack
      {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        category: 'Stack',
        url: 'https://leetcode.com/problems/valid-parentheses/'
      },
      {
        id: 'min-stack',
        title: 'Min Stack',
        difficulty: 'Medium',
        category: 'Stack',
        url: 'https://leetcode.com/problems/min-stack/'
      },
      {
        id: 'evaluate-reverse-polish-notation',
        title: 'Evaluate Reverse Polish Notation',
        difficulty: 'Medium',
        category: 'Stack',
        url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/'
      },
      {
        id: 'generate-parentheses',
        title: 'Generate Parentheses',
        difficulty: 'Medium',
        category: 'Stack',
        url: 'https://leetcode.com/problems/generate-parentheses/'
      },
      {
        id: 'daily-temperatures',
        title: 'Daily Temperatures',
        difficulty: 'Medium',
        category: 'Stack',
        url: 'https://leetcode.com/problems/daily-temperatures/'
      },
      // Binary Search
      {
        id: 'binary-search',
        title: 'Binary Search',
        difficulty: 'Easy',
        category: 'Binary Search',
        url: 'https://leetcode.com/problems/binary-search/'
      },
      {
        id: 'search-a-2d-matrix',
        title: 'Search a 2D Matrix',
        difficulty: 'Medium',
        category: 'Binary Search',
        url: 'https://leetcode.com/problems/search-a-2d-matrix/'
      },
      {
        id: 'koko-eating-bananas',
        title: 'Koko Eating Bananas',
        difficulty: 'Medium',
        category: 'Binary Search',
        url: 'https://leetcode.com/problems/koko-eating-bananas/'
      },
      {
        id: 'search-in-rotated-sorted-array',
        title: 'Search in Rotated Sorted Array',
        difficulty: 'Medium',
        category: 'Binary Search',
        url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/'
      },
      {
        id: 'find-minimum-in-rotated-sorted-array',
        title: 'Find Minimum in Rotated Sorted Array',
        difficulty: 'Medium',
        category: 'Binary Search',
        url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/'
      },
      // Linked List
      {
        id: 'reverse-linked-list',
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/reverse-linked-list/'
      },
      {
        id: 'merge-two-sorted-lists',
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/merge-two-sorted-lists/'
      },
      {
        id: 'reorder-list',
        title: 'Reorder List',
        difficulty: 'Medium',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/reorder-list/'
      },
      {
        id: 'remove-nth-node-from-end-of-list',
        title: 'Remove Nth Node From End of List',
        difficulty: 'Medium',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/'
      },
      {
        id: 'linked-list-cycle',
        title: 'Linked List Cycle',
        difficulty: 'Easy',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/linked-list-cycle/'
      },
      {
        id: 'add-two-numbers',
        title: 'Add Two Numbers',
        difficulty: 'Medium',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/add-two-numbers/'
      },
      {
        id: 'copy-list-with-random-pointer',
        title: 'Copy List with Random Pointer',
        difficulty: 'Medium',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/copy-list-with-random-pointer/'
      },
      {
        id: 'find-the-duplicate-number',
        title: 'Find the Duplicate Number',
        difficulty: 'Medium',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/find-the-duplicate-number/'
      },
      {
        id: 'lru-cache',
        title: 'LRU Cache',
        difficulty: 'Medium',
        category: 'Linked List',
        url: 'https://leetcode.com/problems/lru-cache/'
      },
      // Trees
      {
        id: 'invert-binary-tree',
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        category: 'Trees',
        url: 'https://leetcode.com/problems/invert-binary-tree/'
      },
      {
        id: 'maximum-depth-of-binary-tree',
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'Easy',
        category: 'Trees',
        url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/'
      },
      {
        id: 'same-tree',
        title: 'Same Tree',
        difficulty: 'Easy',
        category: 'Trees',
        url: 'https://leetcode.com/problems/same-tree/'
      },
      {
        id: 'subtree-of-another-tree',
        title: 'Subtree of Another Tree',
        difficulty: 'Easy',
        category: 'Trees',
        url: 'https://leetcode.com/problems/subtree-of-another-tree/'
      },
      {
        id: 'lowest-common-ancestor-of-a-binary-search-tree',
        title: 'Lowest Common Ancestor of a Binary Search Tree',
        difficulty: 'Medium',
        category: 'Trees',
        url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/'
      },
      {
        id: 'binary-tree-level-order-traversal',
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'Medium',
        category: 'Trees',
        url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/'
      },
      {
        id: 'validate-binary-search-tree',
        title: 'Validate Binary Search Tree',
        difficulty: 'Medium',
        category: 'Trees',
        url: 'https://leetcode.com/problems/validate-binary-search-tree/'
      },
      {
        id: 'kth-smallest-element-in-a-bst',
        title: 'Kth Smallest Element in a BST',
        difficulty: 'Medium',
        category: 'Trees',
        url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/'
      },
      {
        id: 'diameter-of-binary-tree',
        title: 'Diameter of Binary Tree',
        difficulty: 'Easy',
        category: 'Trees',
        url: 'https://leetcode.com/problems/diameter-of-binary-tree/'
      },
      {
        id: 'balanced-binary-tree',
        title: 'Balanced Binary Tree',
        difficulty: 'Easy',
        category: 'Trees',
        url: 'https://leetcode.com/problems/balanced-binary-tree/'
      },
      // Backtracking
      {
        id: 'subsets',
        title: 'Subsets',
        difficulty: 'Medium',
        category: 'Backtracking',
        url: 'https://leetcode.com/problems/subsets/'
      },
      {
        id: 'combination-sum',
        title: 'Combination Sum',
        difficulty: 'Medium',
        category: 'Backtracking',
        url: 'https://leetcode.com/problems/combination-sum/'
      },
      {
        id: 'permutations',
        title: 'Permutations',
        difficulty: 'Medium',
        category: 'Backtracking',
        url: 'https://leetcode.com/problems/permutations/'
      },
      {
        id: 'subsets-ii',
        title: 'Subsets II',
        difficulty: 'Medium',
        category: 'Backtracking',
        url: 'https://leetcode.com/problems/subsets-ii/'
      },
      {
        id: 'word-search',
        title: 'Word Search',
        difficulty: 'Medium',
        category: 'Backtracking',
        url: 'https://leetcode.com/problems/word-search/'
      },
      // Graphs
      {
        id: 'number-of-islands',
        title: 'Number of Islands',
        difficulty: 'Medium',
        category: 'Graphs',
        url: 'https://leetcode.com/problems/number-of-islands/'
      },
      {
        id: 'max-area-of-island',
        title: 'Max Area of Island',
        difficulty: 'Medium',
        category: 'Graphs',
        url: 'https://leetcode.com/problems/max-area-of-island/'
      },
      {
        id: 'clone-graph',
        title: 'Clone Graph',
        difficulty: 'Medium',
        category: 'Graphs',
        url: 'https://leetcode.com/problems/clone-graph/'
      },
      {
        id: 'pacific-atlantic-water-flow',
        title: 'Pacific Atlantic Water Flow',
        difficulty: 'Medium',
        category: 'Graphs',
        url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/'
      },
      {
        id: 'course-schedule',
        title: 'Course Schedule',
        difficulty: 'Medium',
        category: 'Graphs',
        url: 'https://leetcode.com/problems/course-schedule/'
      },
      {
        id: 'course-schedule-ii',
        title: 'Course Schedule II',
        difficulty: 'Medium',
        category: 'Graphs',
        url: 'https://leetcode.com/problems/course-schedule-ii/'
      },
      // Dynamic Programming
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/climbing-stairs/'
      },
      {
        id: 'min-cost-climbing-stairs',
        title: 'Min Cost Climbing Stairs',
        difficulty: 'Easy',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/min-cost-climbing-stairs/'
      },
      {
        id: 'house-robber',
        title: 'House Robber',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/house-robber/'
      },
      {
        id: 'house-robber-ii',
        title: 'House Robber II',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/house-robber-ii/'
      },
      {
        id: 'decode-ways',
        title: 'Decode Ways',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/decode-ways/'
      },
      {
        id: 'coin-change',
        title: 'Coin Change',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/coin-change/'
      },
      {
        id: 'longest-increasing-subsequence',
        title: 'Longest Increasing Subsequence',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/longest-increasing-subsequence/'
      },
      {
        id: 'longest-common-subsequence',
        title: 'Longest Common Subsequence',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/longest-common-subsequence/'
      }
    ]
  },
  {
    id: 'dsa-fundamentals',
    name: 'DSA Fundamental Roadmap',
    description: 'A sequential curriculum structured strictly step-by-step from core to advanced data structures.',
    problems: [
      // Arrays
      {
        id: 'contains-duplicate',
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        category: 'Arrays',
        url: 'https://leetcode.com/problems/contains-duplicate/'
      },
      {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        category: 'Arrays',
        url: 'https://leetcode.com/problems/two-sum/'
      },
      {
        id: 'product-of-array-except-self',
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        category: 'Arrays',
        url: 'https://leetcode.com/problems/product-of-array-except-self/'
      },
      {
        id: 'longest-consecutive-sequence',
        title: 'Longest Consecutive Sequence',
        difficulty: 'Medium',
        category: 'Arrays',
        url: 'https://leetcode.com/problems/longest-consecutive-sequence/'
      },
      // Linked Lists
      {
        id: 'reverse-linked-list',
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        category: 'Linked Lists',
        url: 'https://leetcode.com/problems/reverse-linked-list/'
      },
      {
        id: 'merge-two-sorted-lists',
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        category: 'Linked Lists',
        url: 'https://leetcode.com/problems/merge-two-sorted-lists/'
      },
      {
        id: 'linked-list-cycle',
        title: 'Linked List Cycle',
        difficulty: 'Easy',
        category: 'Linked Lists',
        url: 'https://leetcode.com/problems/linked-list-cycle/'
      },
      {
        id: 'remove-nth-node-from-end-of-list',
        title: 'Remove Nth Node From End of List',
        difficulty: 'Medium',
        category: 'Linked Lists',
        url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/'
      },
      // Trees
      {
        id: 'invert-binary-tree',
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        category: 'Trees',
        url: 'https://leetcode.com/problems/invert-binary-tree/'
      },
      {
        id: 'maximum-depth-of-binary-tree',
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'Easy',
        category: 'Trees',
        url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/'
      },
      {
        id: 'validate-binary-search-tree',
        title: 'Validate Binary Search Tree',
        difficulty: 'Medium',
        category: 'Trees',
        url: 'https://leetcode.com/problems/validate-binary-search-tree/'
      },
      {
        id: 'binary-tree-level-order-traversal',
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'Medium',
        category: 'Trees',
        url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/'
      },
      // Graphs
      {
        id: 'number-of-islands',
        title: 'Number of Islands',
        difficulty: 'Medium',
        category: 'Graphs',
        url: 'https://leetcode.com/problems/number-of-islands/'
      },
      {
        id: 'max-area-of-island',
        title: 'Max Area of Island',
        difficulty: 'Medium',
        category: 'Graphs',
        url: 'https://leetcode.com/problems/max-area-of-island/'
      },
      {
        id: 'clone-graph',
        title: 'Clone Graph',
        difficulty: 'Medium',
        category: 'Graphs',
        url: 'https://leetcode.com/problems/clone-graph/'
      },
      // Sorting
      {
        id: 'merge-sorted-array',
        title: 'Merge Sorted Array',
        difficulty: 'Easy',
        category: 'Sorting',
        url: 'https://leetcode.com/problems/merge-sorted-array/'
      },
      {
        id: 'sort-colors',
        title: 'Sort Colors',
        difficulty: 'Medium',
        category: 'Sorting',
        url: 'https://leetcode.com/problems/sort-colors/'
      },
      {
        id: 'top-k-frequent-elements',
        title: 'Top K Frequent Elements',
        difficulty: 'Medium',
        category: 'Sorting',
        url: 'https://leetcode.com/problems/top-k-frequent-elements/'
      },
      // Dynamic Programming
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/climbing-stairs/'
      },
      {
        id: 'house-robber',
        title: 'House Robber',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/house-robber/'
      },
      {
        id: 'coin-change',
        title: 'Coin Change',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/coin-change/'
      },
      {
        id: 'longest-increasing-subsequence',
        title: 'Longest Increasing Subsequence',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        url: 'https://leetcode.com/problems/longest-increasing-subsequence/'
      }
    ]
  }
];
