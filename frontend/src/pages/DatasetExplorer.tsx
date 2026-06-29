import React, { useState, useMemo } from 'react';
import { GlassCard } from '../components/GlassCard';
import { Search, Database, ListFilter, HelpCircle, ArrowUpDown, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import datasetJson from '../assets/titanic_dataset.json';

interface Passenger {
  passengerId: number;
  survived: number;
  pclass: number;
  name: string;
  sex: string;
  age: number | null;
  sibSp: number;
  parch: number;
  ticket: string;
  fare: number;
  cabin: string | null;
  embarked: string | null;
}

export const DatasetExplorer: React.FC = () => {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSex, setFilterSex] = useState('all');
  const [filterPclass, setFilterPclass] = useState('all');
  const [filterSurvived, setFilterSurvived] = useState('all');
  const [filterEmbarked, setFilterEmbarked] = useState('all');
  
  // Sorting State
  const [sortField, setSortField] = useState<keyof Passenger>('passengerId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Tab State
  const [activeSubTab, setActiveSubTab] = useState<'explorer' | 'dictionary'>('explorer');

  const passengers: Passenger[] = datasetJson as Passenger[];

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterSex('all');
    setFilterPclass('all');
    setFilterSurvived('all');
    setFilterEmbarked('all');
    setSortField('passengerId');
    setSortDirection('asc');
    setCurrentPage(1);
  };

  // Sort Handler
  const handleSort = (field: keyof Passenger) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Filtered & Sorted Passengers Memo
  const filteredAndSortedPassengers = useMemo(() => {
    let result = [...passengers];

    // 1. Text Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.ticket.toLowerCase().includes(term) ||
          (p.cabin && p.cabin.toLowerCase().includes(term))
      );
    }

    // 2. Sex Filter
    if (filterSex !== 'all') {
      result = result.filter((p) => p.sex === filterSex);
    }

    // 3. Pclass Filter
    if (filterPclass !== 'all') {
      result = result.filter((p) => p.pclass === parseInt(filterPclass));
    }

    // 4. Survived Filter
    if (filterSurvived !== 'all') {
      result = result.filter((p) => p.survived === parseInt(filterSurvived));
    }

    // 5. Embarked Filter
    if (filterEmbarked !== 'all') {
      result = result.filter((p) => p.embarked === filterEmbarked);
    }

    // 6. Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle nulls in sorting (e.g. Age)
      if (aVal === null || aVal === undefined) return sortDirection === 'asc' ? 1 : -1;
      if (bVal === null || bVal === undefined) return sortDirection === 'asc' ? -1 : 1;

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [passengers, searchTerm, filterSex, filterPclass, filterSurvived, filterEmbarked, sortField, sortDirection]);

  // Pagination Calculations
  const paginatedPassengers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedPassengers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedPassengers, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedPassengers.length / rowsPerPage) || 1;

  // Summary Metrics Memo
  const summaryMetrics = useMemo(() => {
    const total = filteredAndSortedPassengers.length;
    if (total === 0) return { survivalRate: 0, avgAge: 0, avgFare: 0 };

    const survivedCount = filteredAndSortedPassengers.filter((p) => p.survived === 1).length;
    
    let ageSum = 0;
    let ageCount = 0;
    let fareSum = 0;
    
    filteredAndSortedPassengers.forEach((p) => {
      fareSum += p.fare;
      if (p.age !== null) {
        ageSum += p.age;
        ageCount++;
      }
    });

    return {
      survivalRate: (survivedCount / total) * 100,
      avgAge: ageCount > 0 ? ageSum / ageCount : 0,
      avgFare: fareSum / total
    };
  }, [filteredAndSortedPassengers]);

  // Feature dictionary data
  const featureDictionary = [
    { column: 'PassengerId', meaning: 'Unique identifier for each passenger', type: 'Integer (Index)' },
    { column: 'Survived', meaning: 'Survival classifier target (0 = Perished, 1 = Survived)', type: 'Binary (0 or 1)' },
    { column: 'Pclass', meaning: 'Passenger socio-economic ticketing class (1 = Upper, 2 = Middle, 3 = Lower)', type: 'Ordinal (1, 2, 3)' },
    { column: 'Name', meaning: 'Full name details including family title', type: 'String' },
    { column: 'Sex', meaning: 'Biological sex designation', type: 'Categorical (male, female)' },
    { column: 'Age', meaning: 'Age in fractional years (interpolated if estimated)', type: 'Continuous Float' },
    { column: 'SibSp', meaning: 'Count of siblings / spouses traveling aboard the Titanic', type: 'Integer (Discrete)' },
    { column: 'Parch', meaning: 'Count of parents / children traveling aboard the Titanic', type: 'Integer (Discrete)' },
    { column: 'Ticket', meaning: 'Unique passenger ticket alphanumeric sequence', type: 'String' },
    { column: 'Fare', meaning: 'Passenger ticket fare price paid in British Pounds (GBP)', type: 'Continuous Float' },
    { column: 'Cabin', meaning: 'Allocated cabin room designation letter and number', type: 'String (Nullable)' },
    { column: 'Embarked', meaning: 'Port of Embarkation (C = Cherbourg, Q = Queenstown, S = Southampton)', type: 'Categorical' }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Database className="w-8 h-8 text-indigo-500 dark:text-cyan-400" /> Dataset Explorer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mt-1">
            Browse, search, and analyze historical records from the 891-passenger training database.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex p-1 rounded-xl bg-slate-200/50 dark:bg-white/5 border dark:border-white/5 border-slate-200 max-w-xs">
          <button
            onClick={() => setActiveSubTab('explorer')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${activeSubTab === 'explorer' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
          >
            Data Explorer
          </button>
          <button
            onClick={() => setActiveSubTab('dictionary')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${activeSubTab === 'dictionary' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
          >
            Feature Dictionary
          </button>
        </div>
      </div>

      {activeSubTab === 'explorer' ? (
        <>
          {/* Summary metrics cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white/60 dark:bg-slate-900/40 rounded-2xl border dark:border-white/5 border-slate-200/50 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Filtered Records</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                {filteredAndSortedPassengers.length} <span className="text-xs text-slate-400 font-normal">/ {passengers.length}</span>
              </span>
            </div>

            <div className="p-4 bg-white/60 dark:bg-slate-900/40 rounded-2xl border dark:border-white/5 border-slate-200/50 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Survival Rate</span>
              <span className="text-2xl font-black text-emerald-500 mt-1">
                {summaryMetrics.survivalRate.toFixed(1)}%
              </span>
            </div>

            <div className="p-4 bg-white/60 dark:bg-slate-900/40 rounded-2xl border dark:border-white/5 border-slate-200/50 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Average Age</span>
              <span className="text-2xl font-black text-indigo-500 dark:text-cyan-400 mt-1">
                {summaryMetrics.avgAge > 0 ? `${summaryMetrics.avgAge.toFixed(1)} yrs` : 'N/A'}
              </span>
            </div>

            <div className="p-4 bg-white/60 dark:bg-slate-900/40 rounded-2xl border dark:border-white/5 border-slate-200/50 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Average Fare</span>
              <span className="text-2xl font-black text-indigo-500 dark:text-cyan-400 mt-1">
                £{summaryMetrics.avgFare.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Filtering panel */}
          <GlassCard className="p-5 border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/40">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              {/* Search */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    placeholder="Search by passenger or ticket..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              {/* Sex filter */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Gender</label>
                <select
                  value={filterSex}
                  onChange={(e) => { setFilterSex(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-indigo-500/30"
                >
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Class Filter */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Passenger Class</label>
                <select
                  value={filterPclass}
                  onChange={(e) => { setFilterPclass(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-indigo-500/30"
                >
                  <option value="all">All Classes</option>
                  <option value="1">1st Class (Upper)</option>
                  <option value="2">2nd Class (Middle)</option>
                  <option value="3">3rd Class (Lower)</option>
                </select>
              </div>

              {/* Survival Filter */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Outcome</label>
                <select
                  value={filterSurvived}
                  onChange={(e) => { setFilterSurvived(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2.5 rounded-xl border dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-white text-xs outline-none focus:ring-1 focus:ring-indigo-500/30"
                >
                  <option value="all">All Outcomes</option>
                  <option value="1">Survived</option>
                  <option value="0">Perished</option>
                </select>
              </div>

              {/* Reset button */}
              <button
                onClick={handleResetFilters}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            </div>
          </GlassCard>

          {/* Dataset Table Card */}
          <GlassCard className="border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/40 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b dark:border-white/5 border-slate-200/80 bg-slate-50/50 dark:bg-slate-950/20 text-slate-400 font-bold uppercase">
                    <th onClick={() => handleSort('passengerId')} className="py-4 px-4 cursor-pointer hover:text-indigo-500 select-none">
                      ID <ArrowUpDown className="inline w-3 h-3 ml-1" />
                    </th>
                    <th onClick={() => handleSort('name')} className="py-4 px-4 cursor-pointer hover:text-indigo-500 select-none">
                      Passenger <ArrowUpDown className="inline w-3 h-3 ml-1" />
                    </th>
                    <th onClick={() => handleSort('pclass')} className="py-4 px-4 cursor-pointer hover:text-indigo-500 select-none">
                      Class <ArrowUpDown className="inline w-3 h-3 ml-1" />
                    </th>
                    <th onClick={() => handleSort('sex')} className="py-4 px-4 cursor-pointer hover:text-indigo-500 select-none">
                      Gender <ArrowUpDown className="inline w-3 h-3 ml-1" />
                    </th>
                    <th onClick={() => handleSort('age')} className="py-4 px-4 cursor-pointer hover:text-indigo-500 select-none">
                      Age <ArrowUpDown className="inline w-3 h-3 ml-1" />
                    </th>
                    <th onClick={() => handleSort('fare')} className="py-4 px-4 cursor-pointer hover:text-indigo-500 select-none">
                      Fare <ArrowUpDown className="inline w-3 h-3 ml-1" />
                    </th>
                    <th onClick={() => handleSort('ticket')} className="py-4 px-4 cursor-pointer hover:text-indigo-500 select-none">
                      Ticket <ArrowUpDown className="inline w-3 h-3 ml-1" />
                    </th>
                    <th className="py-4 px-4">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-white/5 divide-slate-100">
                  {paginatedPassengers.length > 0 ? (
                    paginatedPassengers.map((p) => (
                      <tr key={p.passengerId} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-400">{p.passengerId}</td>
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{p.name}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold
                            ${p.pclass === 1 ? 'bg-indigo-500/10 text-indigo-600 dark:text-cyan-400' : ''}
                            ${p.pclass === 2 ? 'bg-cyan-500/10 text-cyan-600' : ''}
                            ${p.pclass === 3 ? 'bg-slate-500/10 text-slate-500' : ''}
                          `}>
                            {p.pclass === 1 ? '1st Class' : p.pclass === 2 ? '2nd Class' : '3rd Class'}
                          </span>
                        </td>
                        <td className="py-3 px-4 capitalize font-medium">{p.sex}</td>
                        <td className="py-3 px-4 font-medium">{p.age !== null ? `${Math.floor(p.age)} yrs` : '—'}</td>
                        <td className="py-3 px-4 font-bold font-mono">£{p.fare.toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{p.ticket}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1
                            ${p.survived === 1 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            }
                          `}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.survived === 1 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {p.survived === 1 ? 'Survived' : 'Perished'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                        No passenger records matching your query parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t dark:border-white/5 border-slate-200/80 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-3">
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
                  className="px-2 py-1 rounded-lg border dark:border-white/10 bg-white dark:bg-slate-950 outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>
                  Showing {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, filteredAndSortedPassengers.length)} of {filteredAndSortedPassengers.length} passengers
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border dark:border-white/5 bg-white dark:bg-slate-900 text-slate-500 hover:text-indigo-500 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border dark:border-white/5 bg-white dark:bg-slate-900 text-slate-500 hover:text-indigo-500 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        </>
      ) : (
        /* Feature dictionary grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureDictionary.map((feat) => (
            <GlassCard key={feat.column} className="p-5 border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-slate-900/40 flex flex-col justify-between h-40">
              <div>
                <span className="font-mono text-indigo-600 dark:text-cyan-400 font-bold text-sm bg-indigo-500/5 dark:bg-cyan-500/5 px-2 py-0.5 rounded-lg">
                  {feat.column}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3.5 leading-relaxed">
                  {feat.meaning}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4">
                <HelpCircle className="w-3.5 h-3.5" /> {feat.type}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
