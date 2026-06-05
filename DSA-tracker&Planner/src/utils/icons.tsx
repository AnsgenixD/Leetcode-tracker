// src/utils/icons.tsx

import React from 'react';
import { 
  Grid, 
  ArrowLeftRight, 
  Compass, 
  Layers, 
  Search, 
  GitFork, 
  Activity, 
  RotateCcw, 
  TrendingUp, 
  Award 
} from 'lucide-react';

export function renderTopicIcon(iconName: string, size = 16): React.JSX.Element {
  switch (iconName) {
    case 'Grid': 
      return <Grid size={size} />;
    case 'ArrowLeftRight': 
      return <ArrowLeftRight size={size} />;
    case 'Minimize2': 
      return <Compass size={size} />;
    case 'Layers': 
      return <Layers size={size} />;
    case 'Search': 
      return <Search size={size} />;
    case 'GitFork': 
      return <GitFork size={size} />;
    case 'GitMerge': 
      return <Activity size={size} />;
    case 'CornerDownLeft': 
      return <RotateCcw size={size} />;
    case 'TrendingUp': 
      return <TrendingUp size={size} />;
    default: 
      return <Award size={size} />;
  }
}
