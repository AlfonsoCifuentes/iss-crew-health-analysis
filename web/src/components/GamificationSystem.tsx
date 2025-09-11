'use client';

import { useState, useEffect, useMemo } from 'react';
import { Trophy, Star, Target, Zap, Award, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  earned: boolean;
  progress: number;
  maxProgress: number;
  points: number;
  category: 'analysis' | 'exploration' | 'engagement' | 'expertise';
  rarity: 'common' | 'rare' | 'legendary';
}

interface UserStats {
  level: number;
  totalPoints: number;
  pointsToNextLevel: number;
  streakDays: number;
  totalAnalyses: number;
  reportsGenerated: number;
  simulationsRun: number;
  achievements: Achievement[];
}

export default function GamificationSystem() {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 5,
    totalPoints: 2340,
    pointsToNextLevel: 160,
    streakDays: 12,
    totalAnalyses: 47,
    reportsGenerated: 15,
    simulationsRun: 23,
    achievements: []
  });

  const [showAchievements, setShowAchievements] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const achievements: Achievement[] = useMemo(() => [
    {
      id: 'data_explorer',
      title: 'Data Explorer',
      description: 'View 10 different health metrics',
      icon: Target,
      earned: true,
      progress: 10,
      maxProgress: 10,
      points: 100,
      category: 'exploration',
      rarity: 'common'
    },
    {
      id: 'report_master',
      title: 'Report Master',
      description: 'Generate 5 custom reports',
      icon: Trophy,
      earned: true,
      progress: 5,
      maxProgress: 5,
      points: 250,
      category: 'analysis',
      rarity: 'rare'
    },
    {
      id: 'mars_pioneer',
      title: 'Mars Pioneer',
      description: 'Complete 10 Mars mission simulations',
      icon: Star,
      earned: false,
      progress: 7,
      maxProgress: 10,
      points: 500,
      category: 'expertise',
      rarity: 'legendary'
    },
    {
      id: 'streak_warrior',
      title: 'Streak Warrior',
      description: 'Use the platform for 7 consecutive days',
      icon: Zap,
      earned: true,
      progress: 12,
      maxProgress: 7,
      points: 300,
      category: 'engagement',
      rarity: 'rare'
    },
    {
      id: 'health_guardian',
      title: 'Health Guardian',
      description: 'Analyze crew health data 25 times',
      icon: Award,
      earned: false,
      progress: 18,
      maxProgress: 25,
      points: 400,
      category: 'analysis',
      rarity: 'rare'
    }
  ], []);

  useEffect(() => {
    // Load user stats from localStorage or API
    const savedStats = localStorage.getItem('iss-gamification-stats');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setUserStats(prev => ({ ...prev, ...parsed, achievements }));
    } else {
      setUserStats(prev => ({ ...prev, achievements }));
    }
  }, [achievements]);

  useEffect(() => {
    // Check for new achievements
    const unlockedAchievements = achievements.filter(a => 
      a.progress >= a.maxProgress && !userStats.achievements.some(ua => ua.id === a.id && ua.earned)
    );

    if (unlockedAchievements.length > 0) {
      const newAch = unlockedAchievements[0];
      setNewAchievement(newAch);
      setTimeout(() => setNewAchievement(null), 5000);
    }
  }, [userStats.totalAnalyses, userStats.reportsGenerated, achievements, userStats.achievements]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400/20 bg-gray-400/5';
      case 'rare': return 'text-blue-400 border-blue-400/20 bg-blue-400/5';
      case 'legendary': return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5';
      default: return 'text-gray-400 border-gray-400/20 bg-gray-400/5';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analysis': return BarChart3;
      case 'exploration': return Target;
      case 'engagement': return Calendar;
      case 'expertise': return Trophy;
      default: return Star;
    }
  };

  return (
    <>
      {/* Floating Stats Panel */}
      <div className="fixed top-20 right-4 z-30 bg-space-deep/95 backdrop-blur-md rounded-lg border border-space-deep/50 p-4 w-64">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-cosmic-white font-orbitron">Progress</h3>
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
          >
            <Trophy className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Level Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-cosmic-white/70">Level {userStats.level}</span>
              <span className="text-sm text-yellow-400">{userStats.totalPoints} pts</span>
            </div>
            <div className="w-full bg-space-deep/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((500 - userStats.pointsToNextLevel) / 500) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-cosmic-white/50 mt-1">{userStats.pointsToNextLevel} pts to next level</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-space-deep/30 rounded-lg p-2">
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-cosmic-white/70">Streak</span>
              </div>
              <div className="text-cosmic-white font-bold">{userStats.streakDays} days</div>
            </div>
            <div className="bg-space-deep/30 rounded-lg p-2">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-blue-400" />
                <span className="text-cosmic-white/70">Analyses</span>
              </div>
              <div className="text-cosmic-white font-bold">{userStats.totalAnalyses}</div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-cosmic-white">Recent Achievements</h4>
            {achievements.filter(a => a.earned).slice(-2).map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className="flex items-center space-x-2 p-2 bg-space-deep/30 rounded-lg">
                  <Icon className="w-4 h-4 text-yellow-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-cosmic-white truncate">
                      {achievement.title}
                    </div>
                    <div className="text-xs text-cosmic-white/60">+{achievement.points} pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Achievement Notification */}
      {newAchievement && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400/20 to-blue-400/20 backdrop-blur-md border border-yellow-400/30 rounded-lg p-4 w-80 animate-slide-in-right">
          <div className="flex items-start space-x-3">
            <div className="bg-yellow-400/20 p-2 rounded-full">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-yellow-400 mb-1">Achievement Unlocked!</div>
              <div className="text-cosmic-white font-medium">{newAchievement.title}</div>
              <div className="text-cosmic-white/70 text-sm">{newAchievement.description}</div>
              <div className="text-yellow-400 text-sm font-bold mt-1">+{newAchievement.points} points</div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Modal */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-space-deep/95 backdrop-blur-md rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-space-deep/50">
            <div className="p-6 border-b border-space-deep/50 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cosmic-white font-orbitron">Achievements</h2>
              <button
                onClick={() => setShowAchievements(false)}
                className="p-2 rounded-lg text-cosmic-white/70 hover:text-cosmic-white hover:bg-space-deep/50 transition-all duration-300"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  const CategoryIcon = getCategoryIcon(achievement.category);
                  const isEarned = achievement.earned;
                  
                  return (
                    <div
                      key={achievement.id}
                      className={`relative p-6 rounded-lg border-2 transition-all duration-300 ${
                        isEarned 
                          ? getRarityColor(achievement.rarity)
                          : 'border-space-deep/50 bg-space-deep/20 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-full ${
                          isEarned ? 'bg-current/10' : 'bg-space-deep/50'
                        }`}>
                          <Icon className={`w-6 h-6 ${isEarned ? 'text-current' : 'text-cosmic-white/30'}`} />
                        </div>
                        <div className="flex items-center space-x-1">
                          <CategoryIcon className="w-4 h-4 text-cosmic-white/50" />
                          <span className="text-xs text-cosmic-white/50 capitalize">{achievement.category}</span>
                        </div>
                      </div>
                      
                      <h3 className={`text-lg font-bold mb-2 ${
                        isEarned ? 'text-current' : 'text-cosmic-white/50'
                      }`}>
                        {achievement.title}
                      </h3>
                      
                      <p className="text-cosmic-white/70 text-sm mb-4">
                        {achievement.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-cosmic-white/50">Progress</span>
                          <span className="text-xs font-bold text-cosmic-white">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <div className="w-full bg-space-deep/50 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isEarned 
                                ? 'bg-gradient-to-r from-yellow-400 to-blue-400'
                                : 'bg-cosmic-white/20'
                            }`}
                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <span className={`text-sm font-bold ${
                          isEarned ? 'text-current' : 'text-cosmic-white/50'
                        }`}>
                          {achievement.points} points
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          achievement.rarity === 'legendary' ? 'border-yellow-400/30 text-yellow-400' :
                          achievement.rarity === 'rare' ? 'border-blue-400/30 text-blue-400' :
                          'border-gray-400/30 text-gray-400'
                        }`}>
                          {achievement.rarity}
                        </span>
                      </div>
                      
                      {isEarned && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-green-500 rounded-full p-1">
                            <Star className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
