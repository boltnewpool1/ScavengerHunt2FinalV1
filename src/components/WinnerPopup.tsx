import React, { useEffect, useState } from 'react';
import { Trophy, User, Building, DollarSign, X, Sparkles, Target, Star } from 'lucide-react';

interface Guide {
  name: string;
  supervisor: string;
  department: string;
  discoveryScore: string;
  nps: number;
}

interface WinnerPopupProps {
  isOpen: boolean;
  winner: Guide | null;
  onClose: () => void;
}

const WinnerPopup: React.FC<WinnerPopupProps> = ({ isOpen, winner, onClose }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Delay showing content for dramatic effect
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen || !winner) return null;

  const departmentColors = {
    'International Messaging': 'from-blue-500 to-purple-600',
    'APAC': 'from-green-500 to-teal-600',
    'India Messaging': 'from-orange-500 to-red-600'
  };

  const bgGradient = departmentColors[winner.department as keyof typeof departmentColors] || 'from-gray-500 to-gray-600';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              fontSize: `${20 + Math.random() * 20}px`,
            }}
          >
            {['🎉', '🎊', '🏆', '✨', '🎈', '🌟'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      <div className={`relative bg-gradient-to-br ${bgGradient} rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-500 ${
        showContent ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-yellow-400 rounded-full p-4 animate-pulse">
              <Trophy className="w-12 h-12 text-yellow-800" />
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-2">
            <Sparkles className="w-6 h-6 text-yellow-300 mr-2 animate-spin" />
            <h2 className="text-3xl font-bold text-white">🎉 WINNER! 🎉</h2>
            <Sparkles className="w-6 h-6 text-yellow-300 ml-2 animate-spin" />
          </div>
          
          <p className="text-white/80 text-lg">Congratulations!</p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-white mb-2">{winner.name}</h3>
            <div className="inline-block bg-white/30 rounded-full px-4 py-2">
              <span className="text-white font-medium">{winner.department}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-white">
              <User className="w-5 h-5 mr-3 text-white/80" />
              <div>
                <div className="text-sm text-white/70">Supervisor</div>
                <div className="font-medium">{winner.supervisor}</div>
              </div>
            </div>

            <div className="flex items-center text-white">
              <Building className="w-5 h-5 mr-3 text-white/80" />
              <div>
                <div className="text-sm text-white/70">Department</div>
                <div className="font-medium">{winner.department}</div>
              </div>
            </div>

            <div className="flex items-center text-white">
              <Target className="w-5 h-5 mr-3 text-white/80" />
              <div>
                <div className="text-sm text-white/70">Discovery Score</div>
                <div className="font-medium">{winner.discoveryScore}</div>
              </div>
            </div>

            <div className="flex items-center text-white">
              <Star className="w-5 h-5 mr-3 text-white/80" />
              <div>
                <div className="text-sm text-white/70">NPS Score</div>
                <div className="font-medium">{winner.nps}</div>
              </div>
            </div>

            <div className="flex items-center text-white">
              <DollarSign className="w-5 h-5 mr-3 text-white/80" />
              <div>
                <div className="text-sm text-white/70">Prize Amount</div>
                <div className="font-bold text-xl text-yellow-300">₹5,000</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-4xl mb-2">🎊 🎉 🏆 🎉 🎊</div>
          <p className="text-white/90 text-sm">
            You've won ₹5,000 in the GABI V2 Scavenger Hunt!
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 backdrop-blur-sm border border-white/30"
        >
          Continue Drawing 🎯
        </button>
      </div>
    </div>
  );
};

export default WinnerPopup;