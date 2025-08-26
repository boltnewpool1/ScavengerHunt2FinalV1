import React, { useState, useMemo } from 'react';
import { Users, Search, Filter, Trophy, Target, Star, Building, User, Sparkles, Award, TrendingUp } from 'lucide-react';
import guidesData from '../data/guides.json';

interface Guide {
  name: string;
  supervisor: string;
  department: string;
  discoveryScore: string;
  nps: number;
}

interface GuidesListingProps {
  onClose: () => void;
}

const GuidesListing: React.FC<GuidesListingProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const guides: Guide[] = guidesData;
  const departments = ['All', ...Array.from(new Set(guides.map(guide => guide.department)))];

  const filteredAndSortedGuides = useMemo(() => {
    let filtered = guides.filter(guide => {
      const matchesSearch = guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guide.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'All' || guide.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'department':
          aValue = a.department;
          bValue = b.department;
          break;
        case 'supervisor':
          aValue = a.supervisor;
          bValue = b.supervisor;
          break;
        case 'discoveryScore':
          aValue = parseFloat(a.discoveryScore.replace('%', ''));
          bValue = parseFloat(b.discoveryScore.replace('%', ''));
          break;
        case 'nps':
          aValue = a.nps;
          bValue = b.nps;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      }
    });

    return filtered;
  }, [guides, searchTerm, selectedDepartment, sortBy, sortOrder]);

  const departmentStats = useMemo(() => {
    return departments.slice(1).map(dept => {
      const deptGuides = guides.filter(g => g.department === dept);
      const avgNPS = deptGuides.reduce((sum, g) => sum + g.nps, 0) / deptGuides.length;
      const perfectScores = deptGuides.filter(g => g.discoveryScore === '100.00%').length;
      return {
        name: dept,
        count: deptGuides.length,
        avgNPS: avgNPS.toFixed(1),
        perfectScores
      };
    });
  }, [guides]);

  const departmentColors = {
    'International Messaging': 'from-blue-500 to-purple-600',
    'APAC': 'from-green-500 to-teal-600',
    'India Messaging': 'from-orange-500 to-red-600'
  };

  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score.replace('%', ''));
    if (numScore === 100) return 'text-green-600 bg-green-100';
    if (numScore >= 66.67) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getNPSColor = (nps: number) => {
    if (nps >= 80) return 'text-green-600 bg-green-100';
    if (nps >= 70) return 'text-blue-600 bg-blue-100';
    if (nps >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Floating Orbs Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-20 animate-float-${i % 4}`}
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(45deg, 
                hsl(${Math.random() * 360}, 70%, 60%), 
                hsl(${Math.random() * 360}, 70%, 80%))`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/image.png" 
              alt="GABI Logo" 
              className="w-16 h-16 object-contain rounded-2xl shadow-2xl border-4 border-white/20 bg-white/10 backdrop-blur-sm p-2 mr-4"
            />
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <Users className="w-10 h-10 mr-3 text-yellow-300" />
                Shortlisted Guides
                <Sparkles className="w-8 h-8 ml-3 text-pink-300 animate-spin" />
              </h1>
              <p className="text-xl text-white/80">
                🌟 Meet our amazing GABI V2 participants! 🌟
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="mb-6 bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 backdrop-blur-sm"
          >
            ← Back to Raffle
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{guides.length}</div>
                <div className="text-sm opacity-90">Total Guides</div>
              </div>
              <Users className="w-12 h-12 opacity-80" />
            </div>
          </div>
          
          {departmentStats.map((dept, index) => (
            <div key={dept.name} className={`bg-gradient-to-r ${Object.values(departmentColors)[index]} text-white p-6 rounded-2xl shadow-xl`}>
              <div className="text-center">
                <div className="text-2xl font-bold">{dept.count}</div>
                <div className="text-sm opacity-90 mb-2">{dept.name}</div>
                <div className="text-xs opacity-75">
                  Avg NPS: {dept.avgNPS} | Perfect: {dept.perfectScores}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search guides or supervisors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/20 text-white placeholder-white/60 rounded-lg border border-white/30 focus:border-white/50 focus:outline-none backdrop-blur-sm"
              />
            </div>
            
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 bg-white/20 text-white rounded-lg border border-white/30 focus:border-white/50 focus:outline-none backdrop-blur-sm"
            >
              {departments.map(dept => (
                <option key={dept} value={dept} className="bg-gray-800 text-white">
                  {dept}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/20 text-white rounded-lg border border-white/30 focus:border-white/50 focus:outline-none backdrop-blur-sm"
            >
              <option value="name" className="bg-gray-800 text-white">Sort by Name</option>
              <option value="department" className="bg-gray-800 text-white">Sort by Department</option>
              <option value="supervisor" className="bg-gray-800 text-white">Sort by Supervisor</option>
              <option value="discoveryScore" className="bg-gray-800 text-white">Sort by Discovery Score</option>
              <option value="nps" className="bg-gray-800 text-white">Sort by NPS</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm flex items-center justify-center"
            >
              <TrendingUp className={`w-5 h-5 mr-2 ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform`} />
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
          
          <div className="mt-4 text-white/80 text-center">
            Showing {filteredAndSortedGuides.length} of {guides.length} guides
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedGuides.map((guide, index) => (
            <div
              key={`${guide.name}-${index}`}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{guide.name}</h3>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                  departmentColors[guide.department as keyof typeof departmentColors] || 'from-gray-500 to-gray-600'
                } text-white`}>
                  {guide.department}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-white/90">
                  <Building className="w-4 h-4 mr-2 text-white/70" />
                  <div>
                    <div className="text-xs text-white/60">Supervisor</div>
                    <div className="font-medium text-sm">{guide.supervisor}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-2 text-white/70" />
                    <div>
                      <div className="text-xs text-white/60">Discovery Score</div>
                      <div className={`font-bold text-sm px-2 py-1 rounded ${getScoreColor(guide.discoveryScore)}`}>
                        {guide.discoveryScore}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-white/70" />
                    <div>
                      <div className="text-xs text-white/60">NPS Score</div>
                      <div className={`font-bold text-sm px-2 py-1 rounded ${getNPSColor(guide.nps)}`}>
                        {guide.nps}
                      </div>
                    </div>
                  </div>
                </div>

                {(guide.discoveryScore === '100.00%' || guide.nps >= 80) && (
                  <div className="flex items-center justify-center mt-3 pt-3 border-t border-white/20">
                    <Award className="w-4 h-4 text-yellow-300 mr-1" />
                    <span className="text-yellow-300 text-xs font-medium">
                      {guide.discoveryScore === '100.00%' && guide.nps >= 80 ? 'Perfect Performer!' :
                       guide.discoveryScore === '100.00%' ? 'Discovery Champion!' : 'NPS Star!'}
                    </span>
                    <Sparkles className="w-4 h-4 text-yellow-300 ml-1 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedGuides.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white/70 mb-2">No guides found</h3>
            <p className="text-white/50">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-white/60 mt-12">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/image.png" 
              alt="GABI Logo" 
              className="w-8 h-8 object-contain rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-1"
            />
          </div>
          <p className="mb-2">🌟 All our amazing GABI V2 participants! 🌟</p>
          <p className="text-sm">Best of luck to everyone in the raffle draw!</p>
        </div>
      </div>
    </div>
  );
};

export default GuidesListing;