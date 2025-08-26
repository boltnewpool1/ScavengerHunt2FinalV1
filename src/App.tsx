import React, { useState, useEffect } from 'react';
import { Trophy, Settings, Play, RotateCcw, Sparkles, Database, Users } from 'lucide-react';
import FloatingOrbs from './components/FloatingOrbs';
import Confetti from './components/Confetti';
import RaffleWheel from './components/RaffleWheel';
import WinnersDashboard from './components/WinnersDashboard';
import WinnerPopup from './components/WinnerPopup';
import GuidesListing from './components/GuidesListing';
import { supabase, Winner } from './lib/supabase';
import guidesData from './data/guides.json';

interface Guide {
  name: string;
  supervisor: string;
  department: string;
  discoveryScore: string;
  nps: number;
}

function App() {
  const [guides] = useState<Guide[]>(guidesData);
  const [dbWinners, setDbWinners] = useState<Winner[]>([]);
  const [winnersPerDepartment, setWinnersPerDepartment] = useState({
    'International Messaging': 2,
    'APAC': 2,
    'India Messaging': 2
  });
  const [isDrawing, setIsDrawing] = useState({
    'International Messaging': false,
    'APAC': false,
    'India Messaging': false
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showGuidesListing, setShowGuidesListing] = useState(false);
  const [winnerPopup, setWinnerPopup] = useState<{ isOpen: boolean; winner: Guide | null }>({
    isOpen: false,
    winner: null
  });
  const [currentWinners, setCurrentWinners] = useState<{[key: string]: Guide[]}>({
    'International Messaging': [],
    'APAC': [],
    'India Messaging': []
  });

  const departments = ['International Messaging', 'APAC', 'India Messaging'];

  // Fetch winners from database on component mount
  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const { data, error } = await supabase
        .from('winners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDbWinners(data || []);
    } catch (error) {
      console.error('Error fetching winners:', error);
    }
  };
  const getGuidesByDepartment = (department: string) => {
    return guides.filter(guide => guide.department === department);
  };

  const handleWinnerSelected = (department: string, winner: Guide) => {
    // Save winner to database
    saveWinnerToDatabase(winner);
    
    setCurrentWinners(prev => ({
      ...prev,
      [department]: [...prev[department], winner]
    }));
    
    // Show winner popup
    setWinnerPopup({ isOpen: true, winner });
    
    setShowConfetti(true);
    
    // Stop drawing for this department
    setIsDrawing(prev => ({ ...prev, [department]: false }));
  };

  const saveWinnerToDatabase = async (winner: Guide) => {
    try {
      const { error } = await supabase
        .from('winners')
        .insert([
          {
            name: winner.name,
            supervisor: winner.supervisor,
            department: winner.department,
            prize_amount: 5000
          }
        ]);

      if (error) {
        console.error('Error saving winner to database:', error);
      } else {
        // Refresh winners list after successful insert
        fetchWinners();
      }
    } catch (error) {
      console.error('Error saving winner:', error);
    }
  };

  const startDraw = (department: string) => {
    const availableGuides = getGuidesByDepartment(department).filter(
      guide => !currentWinners[department].some(w => w.name === guide.name)
    );
    
    if (availableGuides.length === 0) return;
    
    setIsDrawing(prev => ({ ...prev, [department]: true }));
  };

  const drawAllWinners = async (department: string) => {
    const maxWinners = winnersPerDepartment[department as keyof typeof winnersPerDepartment];
    const currentCount = currentWinners[department].length;
    
    if (currentCount >= maxWinners) return;
    
    for (let i = currentCount; i < maxWinners; i++) {
      const availableGuides = getGuidesByDepartment(department).filter(
        guide => !currentWinners[department].some(w => w.name === guide.name)
      );
      
      if (availableGuides.length === 0) break;
      
      setIsDrawing(prev => ({ ...prev, [department]: true }));
      
      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      setIsDrawing(prev => ({ ...prev, [department]: false }));
      
      // Wait before next draw
      if (i < maxWinners - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const resetAll = () => {
    setCurrentWinners({
      'International Messaging': [],
      'APAC': [],
      'India Messaging': []
    });
    setIsDrawing({
      'International Messaging': false,
      'APAC': false,
      'India Messaging': false
    });
  };

  const updateWinnersCount = (department: string, count: number) => {
    setWinnersPerDepartment(prev => ({
      ...prev,
      [department]: Math.max(1, Math.min(count, getGuidesByDepartment(department).length))
    }));
  };

  // Calculate real-time prize pool from database
  const totalWinners = dbWinners.length;
  const totalPrizePool = dbWinners.reduce((sum, winner) => sum + winner.prize_amount, 0);
  const remainingPrizePool = 30000 - totalPrizePool;

  // Show guides listing page
  if (showGuidesListing) {
    return <GuidesListing onClose={() => setShowGuidesListing(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <FloatingOrbs />
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <img 
                src="/GABI v2 Scavenger Hunt (1).gif" 
                alt="GABI V2 Logo" 
                className="w-64 sm:w-80 lg:w-96 h-32 sm:h-48 lg:h-56 object-contain rounded-2xl shadow-2xl border-4 border-white/20 bg-white/10 backdrop-blur-sm p-4"
              />
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 animate-bounce">
                <Trophy className="w-6 h-6 text-yellow-800" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">
            GABI V2 Scavenger Hunt
          </h1>
          <p className="text-xl text-white/80 mb-6">
            🎉 Raffle Draw Contest 🎉
          </p>
          <div className="flex items-center justify-center space-x-8 text-white/90">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-300">{totalWinners}</div>
              <div className="text-sm">Total Winners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">₹{remainingPrizePool.toLocaleString()}</div>
              <div className="text-sm">Remaining Prize Pool</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-300">₹{totalPrizePool.toLocaleString()}</div>
              <div className="text-sm">Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300">{guides.length}</div>
              <div className="text-sm">Total Guides</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          <div className="hidden sm:flex items-center mr-4">
            <img 
              src="/image.png" 
              alt="GABI Logo" 
              className="w-10 h-10 object-contain rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-1"
            />
          </div>
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 backdrop-blur-sm flex items-center"
          >
            <Database className="w-4 h-4 mr-2" />
            {showDashboard ? 'Hide Dashboard' : 'Show Dashboard'}
          </button>
          <button
            onClick={() => setShowGuidesListing(true)}
            className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 backdrop-blur-sm flex items-center"
          >
            <Users className="w-4 h-4 mr-2" />
            View All Guides
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 backdrop-blur-sm flex items-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
          <button
            onClick={resetAll}
            className="bg-red-500/80 hover:bg-red-500 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 backdrop-blur-sm flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Winners Per Department
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {departments.map(dept => (
                <div key={dept} className="text-center">
                  <label className="block text-white/80 text-sm mb-2">{dept}</label>
                  <input
                    type="number"
                    min="1"
                    max={getGuidesByDepartment(dept).length}
                    value={winnersPerDepartment[dept as keyof typeof winnersPerDepartment]}
                    onChange={(e) => updateWinnersCount(dept, parseInt(e.target.value))}
                    className="w-20 px-3 py-2 bg-white/20 text-white rounded-lg text-center backdrop-blur-sm border border-white/30 focus:border-white/50 focus:outline-none"
                  />
                  <div className="text-white/60 text-xs mt-1">
                    Max: {getGuidesByDepartment(dept).length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Winners Dashboard */}
        {showDashboard && (
          <div className="mb-8">
            <WinnersDashboard onWinnersUpdate={fetchWinners} />
          </div>
        )}

        {/* Raffle Wheels */}
        {!showDashboard && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {departments.map(department => (
              <div key={department} className="space-y-4">
                <RaffleWheel
                  department={department}
                  guides={getGuidesByDepartment(department)}
                  winnersCount={winnersPerDepartment[department as keyof typeof winnersPerDepartment]}
                  onWinnerSelected={(winner) => handleWinnerSelected(department, winner)}
                  isDrawing={isDrawing[department as keyof typeof isDrawing]}
                />
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => startDraw(department)}
                    disabled={isDrawing[department as keyof typeof isDrawing] || 
                             currentWinners[department].length >= winnersPerDepartment[department as keyof typeof winnersPerDepartment]}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Draw One
                  </button>
                  
                  <button
                    onClick={() => drawAllWinners(department)}
                    disabled={isDrawing[department as keyof typeof isDrawing] || 
                             currentWinners[department].length >= winnersPerDepartment[department as keyof typeof winnersPerDepartment]}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Draw All
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {!showDashboard && (
          <div className="text-center text-white/60">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/image.png" 
                alt="GABI Logo" 
                className="w-12 h-12 object-contain rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-2"
              />
            </div>
            <p className="mb-2">🎊 Good luck to all participants! 🎊</p>
            <p className="text-sm">Each winner receives ₹5,000 prize money | Total Pool: ₹30,000</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs text-white/50">
                Imagined, Designed and Developed by <span className="font-semibold text-white/70">Abhishekh Dey</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Winner Popup */}
      <WinnerPopup
        isOpen={winnerPopup.isOpen}
        winner={winnerPopup.winner}
        onClose={() => setWinnerPopup({ isOpen: false, winner: null })}
      />
    </div>
  );
}

export default App;