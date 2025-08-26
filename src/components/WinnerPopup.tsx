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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
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

      <div className={`relative bg-gradient-to-br ${bgGradient} rounded-3xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md lg:max-w-lg w-full mx-4 shadow-2xl transform transition-all duration-500 my-8 max-h-[90vh] overflow-y-auto ${
        showContent ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/70 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="text-center mb-4 sm:mb-6">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="bg-yellow-400 rounded-full p-3 sm:p-4 animate-pulse">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-yellow-800" />
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-2 flex-wrap">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-300 mr-1 sm:mr-2 animate-spin" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">🎉 WINNER! 🎉</h2>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-300 ml-1 sm:ml-2 animate-spin" />
          </div>
          
          <p className="text-white/80 text-base sm:text-lg">Congratulations!</p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="text-center mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 break-words">{winner.name}</h3>
            <div className="inline-block bg-white/30 rounded-full px-3 py-1 sm:px-4 sm:py-2">
              <span className="text-white font-medium text-sm sm:text-base">{winner.department}</span>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center text-white">
              <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-white/80 flex-shrink-0" />
              <div>
                <div className="text-xs sm:text-sm text-white/70">Supervisor</div>
                <div className="font-medium text-sm sm:text-base break-words">{winner.supervisor}</div>
              </div>
            </div>

            <div className="flex items-center text-white">
              <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-white/80 flex-shrink-0" />
              <div>
                <div className="text-xs sm:text-sm text-white/70">Department</div>
                <div className="font-medium text-sm sm:text-base break-words">{winner.department}</div>
              </div>
            </div>

            <div className="flex items-center text-white">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-white/80 flex-shrink-0" />
              <div>
                <div className="text-xs sm:text-sm text-white/70">Discovery Score</div>
                <div className="font-medium text-sm sm:text-base">{winner.discoveryScore}</div>
              </div>
            </div>

            <div className="flex items-center text-white">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-white/80 flex-shrink-0" />
              <div>
                <div className="text-xs sm:text-sm text-white/70">NPS Score</div>
                <div className="font-medium text-sm sm:text-base">{winner.nps}</div>
              </div>
            </div>

            <div className="flex items-center text-white">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-white/80 flex-shrink-0" />
              <div>
                <div className="text-xs sm:text-sm text-white/70">Prize Amount</div>
                <div className="font-bold text-lg sm:text-xl text-yellow-300">₹5,000</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl sm:text-3xl lg:text-4xl mb-2">🎊 🎉 🏆 🎉 🎊</div>
          <p className="text-white/90 text-xs sm:text-sm">
            You've won ₹5,000 in the GABI V2 Scavenger Hunt!
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 sm:mt-6 bg-white/20 hover:bg-white/30 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-colors duration-200 backdrop-blur-sm border border-white/30 text-sm sm:text-base"
        >
          Continue Drawing 🎯
        </button>
      </div>
    </div>
  );
};

export default WinnerPopup;