import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// --- CONSTANTS & TYPES ---
const STORAGE_KEY = 'pathan_samaj_trust_data';
const REGISTRATION_FEE = 34000;
const MUSLIM_MALE_REGISTRATION_FEE = 9000;

// --- UTILS ---
const formatCurrency = (num: number): string => new Intl.NumberFormat('en-IN').format(num);
const numberToGujaratiWords = (num: number): string => {
  if (num === 0) return 'શૂન્ય';
  const units = ['', 'એક', 'બે', 'ત્રણ', 'ચાર', 'પાંચ', 'છ', 'સાત', 'આઠ', 'નવ', 'દસ', 'અગિયાર', 'બાર', 'તેર', 'ચૌદ', 'પંદર', 'સોળ', 'સત્તર', 'અઢાર', 'ઓગણીસ'];
  const tens = ['', '', 'વીસ', 'ત્રીસ', 'ચાલીસ', 'પચાસ', 'સાઠ', 'સિત્તર', 'એંસી', 'નેવું'];
  const convert = (n: number): string => {
    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
    if (n < 1000) return units[Math.floor(n / 100)] + ' સો ' + (n % 100 !== 0 ? convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' હજાર ' + (n % 1000 !== 0 ? convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' લાખ ' + (n % 100000 !== 0 ? convert(n % 100000) : '');
    return n.toString();
  };
  return convert(num) + ' રૂપિયા પૂરા';
};

// --- COMPONENTS ---

const Header = ({ currentView, setView }: any) => (
  <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
    <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center space-x-3 cursor-pointer mb-3 md:mb-0" onClick={() => setView('HOME')}>
        <div className="bg-white p-1.5 rounded-full"><i className="fas fa-hand-holding-heart text-emerald-800 text-xl"></i></div>
        <div>
          <h1 className="text-lg font-bold">પઠાન સમાજ ચેરિટેબલ ટ્રસ્ટ</h1>
          <p className="text-[10px] text-emerald-200 font-semibold uppercase">મુસ્લિમ સ્વામિનારાયણ એકતા સમાજ</p>
        </div>
      </div>
      <nav className="flex flex-wrap justify-center gap-2">
        <button onClick={() => setView('HOME')} className={`px-3 py-1 rounded-lg text-xs ${currentView === 'HOME' ? 'bg-emerald-700 font-bold' : ''}`}>હોમ</button>
        <button onClick={() => setView('REGISTER')} className={`px-3 py-1 rounded-lg text-xs ${currentView === 'REGISTER' ? 'bg-emerald-700 font-bold' : ''}`}>રજિસ્ટ્રેશન</button>
        <button onClick={() => setView('DIRECTORY')} className={`px-3 py-1 rounded-lg text-xs ${currentView === 'DIRECTORY' ? 'bg-emerald-700 font-bold' : ''}`}>યાદી</button>
        <button onClick={() => setView('FUND')} className={`px-3 py-1 rounded-lg text-xs ${currentView === 'FUND' ? 'bg-emerald-700 font-bold' : ''}`}>ફંડ</button>
      </nav>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-slate-900 text-white py-8 mt-10">
    <div className="container mx-auto px-4 text-center">
      <p className="text-xs text-slate-400">© {new Date().getFullYear()} પઠાન સમાજ ચેરિટેબલ ટ્રસ્ટ. મુસ્લિમ સ્વામિનારાયણ એકતા સમાજ.</p>
    </div>
  </footer>
);

// --- MAIN APP ---
const App: React.FC = () => {
  const [view, setView] = useState('HOME');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { members: [], donations: [] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header currentView={view} setView={setView} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {view === 'HOME' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-700 to-indigo-900 text-white p-10 rounded-3xl shadow-xl text-center">
              <h2 className="text-3xl font-bold mb-4">પઠાન સમાજ ચેરિટેબલ ટ્રસ્ટમાં આપનું સ્વાગત છે</h2>
              <div className="flex justify-center gap-4 mt-6">
                <button onClick={() => setView('REGISTER')} className="bg-white text-emerald-800 px-6 py-3 rounded-xl font-bold">નવું રજિસ્ટ્રેશન</button>
                <button onClick={() => setView('DIRECTORY')} className="bg-emerald-600 px-6 py-3 rounded-xl font-bold">સભ્યોની યાદી</button>
              </div>
            </div>
            <div className="bg-amber-500 text-white p-8 rounded-3xl shadow-lg text-center cursor-pointer" onClick={() => setView('DIKRI_YOJNA')}>
               <h3 className="text-2xl font-bold italic">પઠાન દીકરી યોજના (૧ કરોડ સહાય)</h3>
               <p className="mt-2 text-sm">પટેલ સમાજની દીકરી જો મુસ્લિમ સમાજના છોકરા જોડે પરણે તો ૧ કરોડની સહાય.</p>
            </div>
          </div>
        )}

        {view === 'REGISTER' && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-emerald-800">નવું સભ્ય રજિસ્ટ્રેશન</h2>
            <p className="text-center text-slate-500 py-10">રજિસ્ટ્રેશન ફોર્મ લોડ થઈ રહ્યું છે...</p>
            <button onClick={() => setView('HOME')} className="w-full bg-emerald-700 text-white py-3 rounded-xl font-bold mt-4">પાછા જાઓ</button>
          </div>
        )}

        {view === 'DIRECTORY' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
             <div className="p-6 bg-slate-50 border-b">
               <h2 className="text-lg font-bold">નોંધાયેલા સભ્યો ({data.members.length})</h2>
             </div>
             <div className="p-6 text-center text-slate-400">સભ્યોની યાદી ખાલી છે. નવું રજિસ્ટ્રેશન કરો.</div>
          </div>
        )}

        {view === 'FUND' && (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">ફંડ અને હિસાબ</h2>
            <div className="bg-slate-900 text-emerald-400 p-8 rounded-2xl text-center">
               <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">ટ્રસ્ટનું કુલ બેલેન્સ</p>
               <h3 className="text-4xl font-bold">₹0.00</h3>
            </div>
          </div>
        )}

        {view === 'DIKRI_YOJNA' && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-amber-600 mb-4 italic">૧ કરોડ સહાય ફોર્મ</h2>
            <p className="text-slate-500 mb-6">આ યોજના માટે પાત્ર સભ્ય શોધો.</p>
            <button onClick={() => setView('HOME')} className="bg-slate-100 px-6 py-2 rounded-xl text-xs font-bold">પાછા</button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
