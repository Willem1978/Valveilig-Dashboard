import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, LineChart, Line } from 'recharts';

// =============================================================================
// KLEURENPALET - Geoptimaliseerd voor leesbaarheid (WCAG AA contrast)
// =============================================================================
const KLEUREN = {
  primair: '#0D6560',       // Iets donkerder teal voor beter contrast
  primairLicht: '#CCFBF1',
  
  laag: '#15803D',          // Donkerder groen
  laagLicht: '#DCFCE7',
  matig: '#C2410C',         // Donkerder oranje
  matigLicht: '#FED7AA',
  hoog: '#B91C1C',          // Donkerder rood
  hoogLicht: '#FEE2E2',
  
  achtergrond: '#F8FAFC',
  wit: '#FFFFFF',
  rand: '#CBD5E1',          // Iets donkerder voor betere zichtbaarheid
  
  tekst: '#0F172A',         // Zeer donker - hoofdtekst
  tekstSub: '#334155',      // Donkerder dan voorheen (was #475569)
  tekstLicht: '#64748B',    // Donkerder dan voorheen (was #94A3B8)
  
  wijk1: '#2563EB',         // Donkerder blauw
  wijk2: '#16A34A',         // Donkerder groen
  wijk3: '#D97706',         // Donkerder amber
  wijk4: '#9333EA',         // Donkerder paars
  
  fysioA: '#6366F1',
  fysioB: '#14B8A6',
  fysioC: '#F97316',
};

const MAANDEN = [
  { id: 1, kort: 'Jan', naam: 'Januari' },
  { id: 2, kort: 'Feb', naam: 'Februari' },
  { id: 3, kort: 'Mrt', naam: 'Maart' },
  { id: 4, kort: 'Apr', naam: 'April' },
  { id: 5, kort: 'Mei', naam: 'Mei' },
  { id: 6, kort: 'Jun', naam: 'Juni' },
  { id: 7, kort: 'Jul', naam: 'Juli' },
  { id: 8, kort: 'Aug', naam: 'Augustus' },
  { id: 9, kort: 'Sep', naam: 'September' },
  { id: 10, kort: 'Okt', naam: 'Oktober' },
  { id: 11, kort: 'Nov', naam: 'November' },
  { id: 12, kort: 'Dec', naam: 'December' },
];

const JAREN = [2023, 2024, 2025];

// =============================================================================
// DATA
// =============================================================================
const WIJKEN = [
  { code: 'WK150900', naam: 'Varsseveld', kleur: KLEUREN.wijk1 },
  { code: 'WK150901', naam: 'Silvolde-Terborg', kleur: KLEUREN.wijk2 },
  { code: 'WK150902', naam: 'Ulft-Etten', kleur: KLEUREN.wijk3 },
  { code: 'WK150903', naam: 'Overig Gendringen', kleur: KLEUREN.wijk4 },
];

const KERNEN = [
  { id: 'K01', naam: 'Varsseveld', wijk: 'WK150900', x: 75, y: 25, inw65plus: 1680 },
  { id: 'K02', naam: 'Westendorp', wijk: 'WK150900', x: 55, y: 35, inw65plus: 395 },
  { id: 'K03', naam: 'Sinderen', wijk: 'WK150900', x: 45, y: 30, inw65plus: 290 },
  { id: 'K04', naam: 'Terborg', wijk: 'WK150901', x: 25, y: 45, inw65plus: 1125 },
  { id: 'K05', naam: 'Silvolde', wijk: 'WK150901', x: 40, y: 55, inw65plus: 1310 },
  { id: 'K06', naam: 'Heelweg', wijk: 'WK150901', x: 35, y: 40, inw65plus: 185 },
  { id: 'K07', naam: 'Bontebrug', wijk: 'WK150901', x: 50, y: 48, inw65plus: 75 },
  { id: 'K08', naam: 'Ulft', wijk: 'WK150902', x: 38, y: 70, inw65plus: 2480 },
  { id: 'K09', naam: 'Etten', wijk: 'WK150902', x: 55, y: 80, inw65plus: 445 },
  { id: 'K10', naam: 'Gendringen', wijk: 'WK150903', x: 30, y: 85, inw65plus: 1020 },
  { id: 'K11', naam: 'Netterden', wijk: 'WK150903', x: 10, y: 95, inw65plus: 240 },
  { id: 'K12', naam: 'Megchelen', wijk: 'WK150903', x: 22, y: 98, inw65plus: 205 },
  { id: 'K13', naam: 'Breedenbroek', wijk: 'WK150903', x: 65, y: 88, inw65plus: 175 },
  { id: 'K14', naam: 'Varsselder', wijk: 'WK150903', x: 48, y: 92, inw65plus: 155 },
  { id: 'K15', naam: 'Voorst', wijk: 'WK150903', x: 28, y: 78, inw65plus: 115 },
];

// Gedetailleerde testdata per jaar, maand, leeftijd, geslacht en kern
const genereerTestData = () => {
  const data = [];
  let id = 1;
  
  KERNEN.forEach(kern => {
    const basisTests = Math.floor(Math.random() * 20) + 10;
    
    JAREN.forEach(jaar => {
      // Meer tests in latere jaren (programma groeit)
      const jaarFactor = jaar === 2023 ? 0.6 : jaar === 2024 ? 1.0 : 0.9; // 2025 is nog niet compleet
      
      MAANDEN.forEach(maand => {
        // 2025 heeft alleen data t/m huidige maand (december)
        if (jaar === 2025 && maand.id > 12) return;
        
        const seizoenFactor = [9, 10, 11].includes(maand.id) ? 1.4 : 
                             [1, 2, 12].includes(maand.id) ? 0.8 : 1;
        const maandTests = Math.floor(basisTests * jaarFactor * seizoenFactor * (0.8 + Math.random() * 0.4));
        
        ['65-74', '75-84', '85+'].forEach(leeftijd => {
          const leeftijdFactor = leeftijd === '65-74' ? 0.42 : leeftijd === '75-84' ? 0.39 : 0.19;
          const leeftijdTests = Math.floor(maandTests * leeftijdFactor);
          
          ['Man', 'Vrouw'].forEach(geslacht => {
            const geslachtFactor = geslacht === 'Vrouw' ? 0.57 : 0.43;
            const tests = Math.max(1, Math.floor(leeftijdTests * geslachtFactor));
            
            const hoogKans = leeftijd === '85+' ? 0.50 : leeftijd === '75-84' ? 0.37 : 0.23;
            const matigKans = leeftijd === '85+' ? 0.38 : leeftijd === '75-84' ? 0.41 : 0.42;
            
            const hoog = Math.floor(tests * hoogKans);
            const matig = Math.floor(tests * matigKans);
            const laag = tests - hoog - matig;
            
            data.push({
              id: id++,
              kern: kern.id,
              kernNaam: kern.naam,
              wijk: kern.wijk,
              jaar,
              maand: maand.id,
              maandNaam: maand.kort,
              leeftijd,
              geslacht,
              tests,
              laag: Math.max(0, laag),
              matig,
              hoog,
            });
          });
        });
      });
    });
  });
  
  return data;
};

const TESTDATA = genereerTestData();

// Fysio data - alleen wat we weten: aanmeldingen per fysio per maand
const FYSIO_DATA = [
  { id: 'fysioA', naam: 'Fysio A', kleur: KLEUREN.fysioA, kern: 'K08', locatie: 'Ulft' },
  { id: 'fysioB', naam: 'Fysio B', kleur: KLEUREN.fysioB, kern: 'K04', locatie: 'Terborg' },
  { id: 'fysioC', naam: 'Fysio C', kleur: KLEUREN.fysioC, kern: 'K01', locatie: 'Varsseveld' },
];

// Simpele aanmeldingen data - alleen aantal per fysio per maand per jaar
const genereerFysioAanmeldingen = () => {
  const aanmeldingen = [];
  
  JAREN.forEach(jaar => {
    const jaarFactor = jaar === 2023 ? 0.7 : jaar === 2024 ? 1.0 : 0.95;
    
    MAANDEN.forEach(maand => {
      if (jaar === 2025 && maand.id > 12) return;
      
      FYSIO_DATA.forEach(fysio => {
        const basisAantal = fysio.id === 'fysioA' ? 14 : fysio.id === 'fysioB' ? 9 : 7;
        const seizoenFactor = [9, 10, 11].includes(maand.id) ? 1.3 : [7, 8].includes(maand.id) ? 0.7 : 1;
        const aantal = Math.max(0, Math.floor(basisAantal * jaarFactor * seizoenFactor * (0.8 + Math.random() * 0.4)));
        
        aanmeldingen.push({
          fysio: fysio.id,
          jaar,
          maand: maand.id,
          aantal,
        });
      });
    });
  });
  
  return aanmeldingen;
};

const FYSIO_AANMELDINGEN = genereerFysioAanmeldingen();

const RISICOFACTOREN = [
  { 
    id: 1, 
    label: 'Gevallen afgelopen jaar', 
    perc: 42, // % van ALLE respondenten (iedereen krijgt deze vraag)
    basis: 'alle',
    l65: 32, l75: 45, l85: 58, 
    toelichting: 'Belangrijkste voorspeller voor toekomstige vallen. Iedereen beantwoordt deze vraag.' 
  },
  { 
    id: 2, 
    label: 'Valangst', 
    perc: 38, // % van NIET-VALLERS (58% van totaal)
    basis: 'niet-gevallen',
    basisPerc: 58,
    l65: 28, l75: 42, l85: 55, 
    toelichting: 'Alleen gevraagd aan mensen die NIET zijn gevallen (58% van respondenten).' 
  },
  { 
    id: 3, 
    label: 'Moeite met bewegen', 
    perc: 31, // % van NIET-VALLERS ZONDER VALANGST
    basis: 'niet-gevallen-geen-angst',
    basisPerc: 36, // 58% × 62% (geen valangst)
    l65: 18, l75: 35, l85: 52, 
    toelichting: 'Alleen gevraagd aan mensen die NIET zijn gevallen én GEEN valangst hebben (36% van respondenten).' 
  },
  { 
    id: 4, 
    label: 'Verwondingen + dokter', 
    perc: 57, // % van VALLERS (42% van totaal)
    basis: 'gevallen',
    basisPerc: 42,
    l65: 45, l75: 60, l85: 72, 
    toelichting: 'Alleen gevraagd aan mensen die WEL zijn gevallen (42% van respondenten).' 
  },
  { 
    id: 5, 
    label: 'Meerdere keren gevallen', 
    perc: 67, // % van VALLERS
    basis: 'gevallen',
    basisPerc: 42,
    l65: 55, l75: 70, l85: 82, 
    toelichting: 'Alleen gevraagd aan mensen die WEL zijn gevallen (42% van respondenten).' 
  },
  { 
    id: 6, 
    label: 'Val door flauwvallen', 
    perc: 19, // % van VALLERS
    basis: 'gevallen',
    basisPerc: 42,
    l65: 12, l75: 21, l85: 28, 
    toelichting: 'Alleen gevraagd aan mensen die WEL zijn gevallen (42% van respondenten).' 
  },
  { 
    id: 7, 
    label: 'Kon niet zelf opstaan', 
    perc: 36, // % van VALLERS
    basis: 'gevallen',
    basisPerc: 42,
    l65: 22, l75: 40, l85: 58, 
    toelichting: 'Alleen gevraagd aan mensen die WEL zijn gevallen (42% van respondenten).' 
  },
  { 
    id: 8, 
    label: 'Beperking dagelijkse taken', 
    perc: 18, // % van mensen met MATIG of HOOG risico
    basis: 'verhoogd-risico',
    basisPerc: 66, // matig + hoog risico
    l65: 8, l75: 20, l85: 35, 
    toelichting: 'Alleen gevraagd aan mensen met matig of hoog risico (66% van respondenten).' 
  },
];

const PREVENTIE = [
  { id: 1, label: 'Evenwichtsoefeningen 2x/week', perc: 32, hoogRisico: 21, advies: 'Start eenvoudige oefeningen of cursus "In Balans".' },
  { id: 2, label: 'Huisaanpassingen gedaan', perc: 44, hoogRisico: 38, advies: 'Vraag gratis woningscan aan.' },
  { id: 3, label: 'Jaarlijkse medicijncontrole', perc: 58, hoogRisico: 48, advies: 'Vraag medicijnreview bij 5+ medicijnen.' },
  { id: 4, label: 'Dagelijks voldoende eiwitten', perc: 61, hoogRisico: 55, advies: 'Eet eiwitrijk bij elke maaltijd.' },
  { id: 5, label: 'Jaarlijkse oogcontrole', perc: 65, hoogRisico: 52, advies: 'Laat jaarlijks ogen controleren.' },
  { id: 6, label: 'Stevige schoenen dragen', perc: 72, hoogRisico: 64, advies: 'Kies schoenen met stevige hiel.' },
];

// =============================================================================
// BASIS COMPONENTEN
// =============================================================================

const Card = ({ children, padding = true }) => (
  <div style={{
    backgroundColor: KLEUREN.wit,
    borderRadius: '12px',
    border: `1px solid ${KLEUREN.rand}`,
    padding: padding ? '24px' : '0',
    height: '100%',
    boxSizing: 'border-box',
  }}>
    {children}
  </div>
);

const CardTitle = ({ children, sub }) => (
  <div style={{ marginBottom: '16px' }}>
    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: KLEUREN.tekst }}>{children}</h3>
    {sub && <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: KLEUREN.tekstSub }}>{sub}</p>}
  </div>
);

const InfoPanel = ({ type = 'info', children }) => {
  const styles = {
    info: { bg: KLEUREN.primairLicht, border: KLEUREN.primair },
    warning: { bg: KLEUREN.matigLicht, border: KLEUREN.matig },
    danger: { bg: KLEUREN.hoogLicht, border: KLEUREN.hoog },
    success: { bg: KLEUREN.laagLicht, border: KLEUREN.laag },
  };
  const s = styles[type];
  
  return (
    <div style={{
      padding: '16px 20px',
      backgroundColor: s.bg,
      borderLeft: `4px solid ${s.border}`,
      borderRadius: '0 8px 8px 0',
      fontSize: '14px',
      lineHeight: 1.6,
      color: KLEUREN.tekst,
    }}>
      {children}
    </div>
  );
};

const StatCard = ({ label, value, unit, sub, color, icon }) => (
  <Card>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '28px', fontWeight: 700, color: color || KLEUREN.tekst, lineHeight: 1 }}>{value}</span>
          {unit && <span style={{ fontSize: '18px', fontWeight: 500, color: KLEUREN.tekstSub }}>{unit}</span>}
        </div>
        {sub && <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: KLEUREN.tekstSub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</p>}
      </div>
      {icon && (
        <div style={{
          width: '44px', height: '44px', borderRadius: '10px',
          backgroundColor: color ? `${color}20` : KLEUREN.primairLicht,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', flexShrink: 0, marginLeft: '12px',
        }}>{icon}</div>
      )}
    </div>
  </Card>
);

const ProgressBar = ({ label, value, max = 100, color, showValue = true }) => (
  <div style={{ marginBottom: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
      <span style={{ fontSize: '13px', fontWeight: 500, color: KLEUREN.tekst, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '12px' }}>{label}</span>
      {showValue && <span style={{ fontSize: '14px', fontWeight: 700, color: color || KLEUREN.primair, flexShrink: 0 }}>{value}%</span>}
    </div>
    <div style={{ height: '8px', backgroundColor: KLEUREN.achtergrond, borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: '100%', backgroundColor: color || KLEUREN.primair, borderRadius: '4px', transition: 'width 0.3s ease' }} />
    </div>
  </div>
);

const Badge = ({ children, color }) => (
  <span style={{
    display: 'inline-block', padding: '4px 10px', borderRadius: '12px',
    fontSize: '12px', fontWeight: 600, backgroundColor: `${color}20`, color: color,
  }}>{children}</span>
);

const TabButton = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: '14px 24px', 
    border: 'none',
    borderBottom: active ? `3px solid ${KLEUREN.primair}` : '3px solid transparent',
    borderRadius: '0', 
    cursor: 'pointer',
    fontSize: '14px', 
    fontWeight: active ? 700 : 500, 
    fontFamily: 'inherit',
    backgroundColor: active ? KLEUREN.wit : 'transparent',
    color: active ? KLEUREN.primair : KLEUREN.tekstLicht,
    transition: 'all 0.2s ease', 
    whiteSpace: 'nowrap',
  }}>
    {children}
  </button>
);

const Checkbox = ({ checked, onChange, label }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: KLEUREN.tekst }}>
    <input type="checkbox" checked={checked} onChange={onChange} style={{ width: '16px', height: '16px', accentColor: KLEUREN.primair, cursor: 'pointer' }} />
    {label}
  </label>
);

const FilterChip = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: '6px 14px', borderRadius: '16px', cursor: 'pointer',
    fontSize: '12px', fontWeight: 500, fontFamily: 'inherit',
    border: `1px solid ${active ? KLEUREN.primair : KLEUREN.rand}`,
    backgroundColor: active ? KLEUREN.primairLicht : KLEUREN.wit,
    color: active ? KLEUREN.primair : KLEUREN.tekstSub,
    transition: 'all 0.15s ease',
  }}>
    {children}
  </button>
);

// =============================================================================
// FILTER COMPONENT
// =============================================================================
const FilterPanel = ({ filters, setFilters }) => {
  const [expanded, setExpanded] = useState(false); // Default ingeklapt
  
  const toggleJaar = (jaar) => {
    const nieuweJaren = filters.jaren.includes(jaar)
      ? filters.jaren.filter(j => j !== jaar)
      : [...filters.jaren, jaar];
    setFilters({ ...filters, jaren: nieuweJaren });
  };
  
  const toggleMaand = (maandId) => {
    const nieuweMaanden = filters.maanden.includes(maandId)
      ? filters.maanden.filter(m => m !== maandId)
      : [...filters.maanden, maandId];
    setFilters({ ...filters, maanden: nieuweMaanden });
  };
  
  const selecteerAlleMaanden = () => setFilters({ ...filters, maanden: MAANDEN.map(m => m.id) });
  const deselecteerAlleMaanden = () => setFilters({ ...filters, maanden: [] });
  
  const toggleLeeftijd = (leeftijd) => {
    const nieuweLeeftijden = filters.leeftijden.includes(leeftijd)
      ? filters.leeftijden.filter(l => l !== leeftijd)
      : [...filters.leeftijden, leeftijd];
    setFilters({ ...filters, leeftijden: nieuweLeeftijden });
  };
  
  const toggleGeslacht = (geslacht) => {
    const nieuweGeslachten = filters.geslachten.includes(geslacht)
      ? filters.geslachten.filter(g => g !== geslacht)
      : [...filters.geslachten, geslacht];
    setFilters({ ...filters, geslachten: nieuweGeslachten });
  };
  
  const resetFilters = () => {
    setFilters({
      jaren: JAREN, // Reset naar alle jaren
      maanden: MAANDEN.map(m => m.id),
      leeftijden: ['65-74', '75-84', '85+'],
      geslachten: ['Man', 'Vrouw'],
    });
  };
  
  const actieveFilters = 
    filters.jaren.length !== JAREN.length ||
    filters.maanden.length < 12 || 
    filters.leeftijden.length < 3 || 
    filters.geslachten.length < 2;

  // Bepaal geselecteerde periode tekst
  const getPeriodeTekst = () => {
    if (filters.jaren.length === 0) return 'Geen jaar geselecteerd';
    if (filters.jaren.length === 1) return `${filters.jaren[0]}`;
    if (filters.jaren.length === JAREN.length) return `${JAREN[0]} - ${JAREN[JAREN.length - 1]}`;
    return filters.jaren.sort().join(', ');
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: expanded ? '16px' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: KLEUREN.tekst }}>🔍 Filters</h3>
          {actieveFilters && <Badge color={KLEUREN.primair}>Actief</Badge>}
          <span style={{ fontSize: '12px', color: KLEUREN.tekstSub }}>
            Periode: {getPeriodeTekst()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {actieveFilters && (
            <button onClick={resetFilters} style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', backgroundColor: KLEUREN.achtergrond, color: KLEUREN.tekstSub, fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Reset</button>
          )}
          <button onClick={() => setExpanded(!expanded)} style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', backgroundColor: KLEUREN.achtergrond, color: KLEUREN.tekstSub, fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            {expanded ? '▲ Inklappen' : '▼ Uitklappen'}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Eerste rij: Jaren en Maanden */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '24px' }}>
            {/* Jaren */}
            <div>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>
                Jaar ({filters.jaren.length}/{JAREN.length})
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {JAREN.map(jaar => (
                  <FilterChip
                    key={jaar}
                    active={filters.jaren.includes(jaar)}
                    onClick={() => toggleJaar(jaar)}
                  >
                    {jaar}
                  </FilterChip>
                ))}
              </div>
            </div>
            
            {/* Maanden */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Maanden ({filters.maanden.length}/12)</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={selecteerAlleMaanden} style={{ background: 'none', border: 'none', fontSize: '12px', color: KLEUREN.primair, cursor: 'pointer', fontFamily: 'inherit' }}>Alles</button>
                  <button onClick={deselecteerAlleMaanden} style={{ background: 'none', border: 'none', fontSize: '12px', color: KLEUREN.tekstSub, cursor: 'pointer', fontFamily: 'inherit' }}>Geen</button>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {MAANDEN.map(m => (
                  <FilterChip key={m.id} active={filters.maanden.includes(m.id)} onClick={() => toggleMaand(m.id)}>{m.kort}</FilterChip>
                ))}
              </div>
            </div>
          </div>
          
          {/* Tweede rij: Leeftijd en Geslacht */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '24px' }}>
            {/* Leeftijd */}
            <div>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Leeftijd</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['65-74', '75-84', '85+'].map(leeftijd => (
                  <FilterChip key={leeftijd} active={filters.leeftijden.includes(leeftijd)} onClick={() => toggleLeeftijd(leeftijd)}>
                    {leeftijd}
                  </FilterChip>
                ))}
              </div>
            </div>
            
            {/* Geslacht */}
            <div>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Geslacht</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Man', 'Vrouw'].map(geslacht => (
                  <FilterChip key={geslacht} active={filters.geslachten.includes(geslacht)} onClick={() => toggleGeslacht(geslacht)}>
                    {geslacht}
                  </FilterChip>
                ))}
              </div>
            </div>
            
            {/* Placeholder voor balans */}
            <div></div>
          </div>
        </div>
      )}
    </Card>
  );
};

// =============================================================================
// FYSIO COMPONENT - Alleen bekende data
// =============================================================================
const FysioAanmeldingenPanel = ({ filters, totaalHoogRisico }) => {
  const [selectedFysio, setSelectedFysio] = useState(null);
  
  // Filter aanmeldingen op geselecteerde jaren en maanden
  const gefilterdAanmeldingen = useMemo(() => {
    return FYSIO_AANMELDINGEN.filter(a => 
      filters.jaren.includes(a.jaar) &&
      filters.maanden.includes(a.maand)
    );
  }, [filters.jaren, filters.maanden]);
  
  // Totalen berekenen
  const totalen = useMemo(() => {
    const perFysio = FYSIO_DATA.map(f => ({
      ...f,
      aantal: gefilterdAanmeldingen.filter(a => a.fysio === f.id).reduce((sum, a) => sum + a.aantal, 0),
    }));
    const totaalAanmeldingen = perFysio.reduce((sum, f) => sum + f.aantal, 0);
    return { perFysio, totaalAanmeldingen };
  }, [gefilterdAanmeldingen]);
  
  // Aanmeldingspercentage
  const aanmeldingsPercentage = totaalHoogRisico > 0 ? Math.round((totalen.totaalAanmeldingen / totaalHoogRisico) * 100) : 0;
  const nietAangemeld = totaalHoogRisico - totalen.totaalAanmeldingen;
  
  // Trend data voor grafiek - per jaar/maand combinatie
  const trendData = useMemo(() => {
    // Als meerdere jaren, toon per jaar
    if (filters.jaren.length > 1) {
      return filters.jaren.map(jaar => {
        const jaarData = gefilterdAanmeldingen.filter(a => a.jaar === jaar);
        return {
          periode: jaar.toString(),
          'Fysio A': jaarData.filter(a => a.fysio === 'fysioA').reduce((s, a) => s + a.aantal, 0),
          'Fysio B': jaarData.filter(a => a.fysio === 'fysioB').reduce((s, a) => s + a.aantal, 0),
          'Fysio C': jaarData.filter(a => a.fysio === 'fysioC').reduce((s, a) => s + a.aantal, 0),
          totaal: jaarData.reduce((s, a) => s + a.aantal, 0),
        };
      });
    }
    
    // Anders toon per maand
    return MAANDEN.map(m => {
      const maandData = gefilterdAanmeldingen.filter(a => a.maand === m.id);
      return {
        periode: m.kort,
        'Fysio A': maandData.filter(a => a.fysio === 'fysioA').reduce((s, a) => s + a.aantal, 0),
        'Fysio B': maandData.filter(a => a.fysio === 'fysioB').reduce((s, a) => s + a.aantal, 0),
        'Fysio C': maandData.filter(a => a.fysio === 'fysioC').reduce((s, a) => s + a.aantal, 0),
        totaal: maandData.reduce((s, a) => s + a.aantal, 0),
        inSelectie: filters.maanden.includes(m.id),
      };
    });
  }, [gefilterdAanmeldingen, filters.jaren, filters.maanden]);

  // Marktaandeel per fysio
  const marktaandeel = totalen.perFysio.map(f => ({
    ...f,
    percentage: totalen.totaalAanmeldingen > 0 ? Math.round((f.aantal / totalen.totaalAanmeldingen) * 100) : 0,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Hoofdstatistieken */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <StatCard 
          label="Totaal hoog risico" 
          value={totaalHoogRisico} 
          sub="Personen in selectie" 
          color={KLEUREN.hoog} 
          icon="⚠️" 
        />
        <StatCard 
          label="Aangemeld bij fysio" 
          value={totalen.totaalAanmeldingen} 
          sub={`${aanmeldingsPercentage}% van hoog risico`}
          color={KLEUREN.primair} 
          icon="🏥" 
        />
        <StatCard 
          label="Niet aangemeld" 
          value={nietAangemeld > 0 ? nietAangemeld : 0} 
          sub={`${100 - aanmeldingsPercentage}% nog te bereiken`}
          color={KLEUREN.matig} 
          icon="📋" 
        />
        <StatCard 
          label="Aanmeldingsgraad" 
          value={aanmeldingsPercentage} 
          unit="%" 
          sub="Conversie hoog risico"
          color={aanmeldingsPercentage >= 50 ? KLEUREN.laag : aanmeldingsPercentage >= 30 ? KLEUREN.matig : KLEUREN.hoog} 
          icon="📈" 
        />
      </div>

      {/* Kaart en verdeling */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* Kaart met fysio locaties */}
        <Card>
          <CardTitle sub="Locatie fysiotherapeuten in de gemeente">Fysio-praktijken op de kaart</CardTitle>
          <svg viewBox="0 0 100 110" style={{ width: '100%', maxHeight: '280px', backgroundColor: '#F1F5F9', borderRadius: '8px' }}>
            {/* Achtergrond kernen (lichtgrijs) */}
            {KERNEN.map(kern => (
              <g key={kern.id}>
                <circle 
                  cx={kern.x} 
                  cy={kern.y} 
                  r={3} 
                  fill={KLEUREN.rand}
                  opacity={0.5}
                />
                <text 
                  x={kern.x} 
                  y={kern.y + 6} 
                  textAnchor="middle" 
                  style={{ fontSize: '2.5px', fill: KLEUREN.tekstLicht, pointerEvents: 'none' }}
                >
                  {kern.naam}
                </text>
              </g>
            ))}
            
            {/* Fysio locaties */}
            {FYSIO_DATA.map(fysio => {
              const kern = KERNEN.find(k => k.id === fysio.kern);
              if (!kern) return null;
              const fysioData = marktaandeel.find(m => m.id === fysio.id);
              const isSelected = selectedFysio === fysio.id;
              // Grootte gebaseerd op aantal aanmeldingen
              const r = Math.max(5, Math.min(10, (fysioData?.aantal || 0) / 30));
              
              return (
                <g key={fysio.id}>
                  {/* Glow effect voor geselecteerde */}
                  {isSelected && (
                    <circle cx={kern.x} cy={kern.y} r={r + 3} fill={fysio.kleur} opacity={0.3} />
                  )}
                  {/* Hoofdcirkel */}
                  <circle 
                    cx={kern.x} 
                    cy={kern.y} 
                    r={r} 
                    fill={fysio.kleur}
                    stroke="#fff"
                    strokeWidth="2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedFysio(isSelected ? null : fysio.id)}
                  />
                  {/* Fysio icoon */}
                  <text 
                    x={kern.x} 
                    y={kern.y + 1.5} 
                    textAnchor="middle" 
                    style={{ fontSize: '5px', fill: '#fff', pointerEvents: 'none' }}
                  >
                    🏥
                  </text>
                  {/* Label */}
                  <text 
                    x={kern.x} 
                    y={kern.y + r + 5} 
                    textAnchor="middle" 
                    style={{ fontSize: '3.5px', fontWeight: 600, fill: fysio.kleur, pointerEvents: 'none' }}
                  >
                    {fysio.naam}
                  </text>
                  {/* Aantal aanmeldingen */}
                  <text 
                    x={kern.x} 
                    y={kern.y + r + 8.5} 
                    textAnchor="middle" 
                    style={{ fontSize: '3px', fill: KLEUREN.tekstSub, pointerEvents: 'none' }}
                  >
                    {fysioData?.aantal || 0} aanm.
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Legenda */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
            {FYSIO_DATA.map(f => (
              <div 
                key={f.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: selectedFysio === f.id ? `${f.kleur}20` : 'transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedFysio(selectedFysio === f.id ? null : f.id)}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: f.kleur }} />
                <span style={{ fontSize: '12px', color: KLEUREN.tekstSub }}>{f.naam} ({f.locatie})</span>
              </div>
            ))}
          </div>
          
          {/* Detail bij selectie */}
          {selectedFysio && (() => {
            const fysio = marktaandeel.find(f => f.id === selectedFysio);
            if (!fysio) return null;
            return (
              <div style={{ 
                marginTop: '12px', 
                padding: '12px', 
                backgroundColor: `${fysio.kleur}15`, 
                borderRadius: '8px',
                borderLeft: `4px solid ${fysio.kleur}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{fysio.naam}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: KLEUREN.tekstSub }}>{fysio.locatie}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: fysio.kleur }}>{fysio.aantal}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: KLEUREN.tekstSub }}>{fysio.percentage}% van totaal</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </Card>

        {/* Verdeling per fysio */}
        <Card>
          <CardTitle sub="Geselecteerde periode">Verdeling per praktijk</CardTitle>
          
          {/* Pie chart zonder labels */}
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={marktaandeel}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="aantal"
                paddingAngle={2}
              >
                {marktaandeel.map((entry, i) => (
                  <Cell key={i} fill={entry.kleur} />
                ))}
              </Pie>
              <Tooltip formatter={(v, name, props) => [`${v} aanmeldingen (${props.payload.percentage}%)`, props.payload.naam]} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Details per fysio */}
          <div style={{ marginTop: '12px' }}>
            {marktaandeel.map((f, i) => (
              <div key={f.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: KLEUREN.achtergrond,
                borderRadius: '8px',
                marginBottom: i < 2 ? '8px' : 0,
                borderLeft: `4px solid ${f.kleur}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onClick={() => setSelectedFysio(selectedFysio === f.id ? null : f.id)}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{f.naam}</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: KLEUREN.tekstSub }}>
                    {f.locatie} • {f.percentage}% van aanmeldingen
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: f.kleur }}>{f.aantal}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Grafiek */}
      <Card>
        <CardTitle sub={filters.jaren.length > 1 ? 'Per jaar' : 'Per maand'}>
          Aanmeldingen over tijd {filters.jaren.length === 1 ? filters.jaren[0] : `${Math.min(...filters.jaren)} - ${Math.max(...filters.jaren)}`}
        </CardTitle>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={trendData} barCategoryGap="15%">
            <CartesianGrid strokeDasharray="3 3" stroke={KLEUREN.rand} />
            <XAxis dataKey="periode" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value, name) => [value, name]} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="Fysio A" stackId="a" fill={KLEUREN.fysioA} radius={[0, 0, 0, 0]} />
            <Bar dataKey="Fysio B" stackId="a" fill={KLEUREN.fysioB} radius={[0, 0, 0, 0]} />
            <Bar dataKey="Fysio C" stackId="a" fill={KLEUREN.fysioC} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Inzichten */}
      <Card>
        <CardTitle>Wat kunnen we hieruit opmaken?</CardTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          
          <div style={{ padding: '16px', backgroundColor: KLEUREN.achtergrond, borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              <h4 style={{ margin: 0, fontSize: '14px' }}>Bereik</h4>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: KLEUREN.tekstSub, lineHeight: 1.6 }}>
              Van de <strong>{totaalHoogRisico}</strong> personen met hoog valrisico heeft 
              <strong style={{ color: aanmeldingsPercentage >= 50 ? KLEUREN.laag : KLEUREN.hoog }}> {aanmeldingsPercentage}%</strong> zich 
              aangemeld voor een fysiek onderzoek. 
              {aanmeldingsPercentage < 50 && (
                <span> Er is ruimte om <strong>{nietAangemeld}</strong> personen nog te bereiken.</span>
              )}
            </p>
          </div>
          
          <div style={{ padding: '16px', backgroundColor: KLEUREN.achtergrond, borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>🏥</span>
              <h4 style={{ margin: 0, fontSize: '14px' }}>Capaciteit</h4>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: KLEUREN.tekstSub, lineHeight: 1.6 }}>
              <strong>{marktaandeel[0]?.naam}</strong> in {marktaandeel[0]?.locatie} verwerkt de meeste aanmeldingen ({marktaandeel[0]?.percentage}%). 
              De spreiding over de drie praktijken kan helpen bij capaciteitsplanning.
            </p>
          </div>
          
          <div style={{ padding: '16px', backgroundColor: KLEUREN.achtergrond, borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>📅</span>
              <h4 style={{ margin: 0, fontSize: '14px' }}>Seizoenspatroon</h4>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: KLEUREN.tekstSub, lineHeight: 1.6 }}>
              De aanmeldingen pieken in <strong>september-november</strong>, 
              mogelijk door de "Week tegen Vallen" en najaarsvoorlichting. 
              In de zomermaanden is er een dip.
            </p>
          </div>
        </div>
        
        {/* Actiepunten */}
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: KLEUREN.primairLicht, borderRadius: '10px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: KLEUREN.primair }}>💡 Mogelijke acties</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: KLEUREN.tekstSub, lineHeight: 1.8 }}>
            <li>Onderzoek waarom <strong>{100 - aanmeldingsPercentage}%</strong> van de hoog-risico personen zich niet aanmeldt</li>
            <li>Overweeg actieve doorverwijzing vanuit de huisartsenpraktijk na een positieve valrisicotest</li>
            <li>Versterk voorlichting in rustigere maanden (januari-februari, juli-augustus)</li>
            <li>Monitor of de huidige capaciteit voldoende is als het bereik toeneemt</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

// =============================================================================
// KAART COMPONENT
// =============================================================================
const GemeenteKaart = ({ stats, wijkFilter, selected, onSelect }) => {
  const [hover, setHover] = useState(null);
  
  const visible = wijkFilter === 'alle' ? stats : stats.filter(k => {
    const kern = KERNEN.find(x => x.id === k.kern);
    return kern && kern.wijk === wijkFilter;
  });
  
  const getColor = (k) => {
    if (k.tests === 0) return KLEUREN.tekstLicht;
    const p = (k.hoog / k.tests) * 100;
    if (p > 40) return KLEUREN.hoog;
    if (p > 30) return KLEUREN.matig;
    return KLEUREN.laag;
  };

  return (
    <div>
      <svg viewBox="0 0 100 110" style={{ width: '100%', maxHeight: '320px', backgroundColor: '#F1F5F9', borderRadius: '8px' }}>
        {visible.map(k => {
          const kern = KERNEN.find(x => x.id === k.kern);
          if (!kern) return null;
          const isSelected = selected === k.kern;
          const isHover = hover === k.kern;
          const r = k.tests === 0 ? 2 : Math.max(3, Math.min(7, k.tests / 40));
          const wijk = WIJKEN.find(w => w.code === kern.wijk);
          
          return (
            <g key={k.kern}>
              <circle cx={kern.x} cy={kern.y} r={r + 1.5} fill="none" stroke={wijk?.kleur || '#666'} strokeWidth={isSelected ? 2 : 1} opacity={isSelected || isHover ? 1 : 0.5} />
              <circle cx={kern.x} cy={kern.y} r={r} fill={getColor(k)} stroke="#fff" strokeWidth="1" style={{ cursor: 'pointer' }} opacity={isSelected || isHover ? 1 : 0.8}
                onMouseEnter={() => setHover(k.kern)} onMouseLeave={() => setHover(null)} onClick={() => onSelect(isSelected ? null : k.kern)} />
              <text x={kern.x} y={kern.y + r + 5} textAnchor="middle" style={{ fontSize: '3px', fontWeight: isSelected ? 600 : 400, fill: KLEUREN.tekst, pointerEvents: 'none' }}>
                {kern.naam}
              </text>
            </g>
          );
        })}
      </svg>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {WIJKEN.map(w => (
            <div key={w.code} style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: wijkFilter === 'alle' || wijkFilter === w.code ? 1 : 0.3 }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: w.kleur }} />
              <span style={{ fontSize: '12px', color: KLEUREN.tekstSub }}>{w.naam}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[{ c: KLEUREN.laag, l: '<30%' }, { c: KLEUREN.matig, l: '30-40%' }, { c: KLEUREN.hoog, l: '>40%' }].map((x, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: x.c }} />
              <span style={{ fontSize: '12px', color: KLEUREN.tekstSub }}>{x.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// HOOFDCOMPONENT
// =============================================================================
export default function ValrisicoDashboard() {
  const [tab, setTab] = useState('overzicht');
  const [wijk, setWijk] = useState('alle');
  const [kern, setKern] = useState(null);
  const [filters, setFilters] = useState({
    jaren: JAREN, // Standaard alle jaren
    maanden: MAANDEN.map(m => m.id),
    leeftijden: ['65-74', '75-84', '85+'],
    geslachten: ['Man', 'Vrouw'],
  });

  const gefilterdData = useMemo(() => {
    return TESTDATA.filter(d => 
      filters.jaren.includes(d.jaar) &&
      filters.maanden.includes(d.maand) &&
      filters.leeftijden.includes(d.leeftijd) &&
      filters.geslachten.includes(d.geslacht) &&
      (wijk === 'alle' || d.wijk === wijk)
    );
  }, [filters, wijk]);

  const stats = useMemo(() => {
    const tests = gefilterdData.reduce((a, d) => a + d.tests, 0);
    const laag = gefilterdData.reduce((a, d) => a + d.laag, 0);
    const matig = gefilterdData.reduce((a, d) => a + d.matig, 0);
    const hoog = gefilterdData.reduce((a, d) => a + d.hoog, 0);
    
    // Bepaal welke kernen in de selectie zitten
    const kernenInSelectie = [...new Set(gefilterdData.map(d => d.kern))];
    const inw65plus = KERNEN
      .filter(k => wijk === 'alle' || k.wijk === wijk)
      .reduce((a, k) => a + k.inw65plus, 0);
    
    const perKern = KERNEN.map(k => {
      const kernData = gefilterdData.filter(d => d.kern === k.id);
      return {
        kern: k.id, naam: k.naam, wijk: k.wijk,
        inw65plus: k.inw65plus,
        tests: kernData.reduce((a, d) => a + d.tests, 0),
        laag: kernData.reduce((a, d) => a + d.laag, 0),
        matig: kernData.reduce((a, d) => a + d.matig, 0),
        hoog: kernData.reduce((a, d) => a + d.hoog, 0),
      };
    }).filter(k => k.tests > 0);
    
    // Bereik = tests / inwoners 65+
    const bereik = inw65plus > 0 ? Math.round((tests / inw65plus) * 100) : 0;
    
    return {
      tests, laag, matig, hoog,
      pLaag: tests > 0 ? Math.round(laag / tests * 100) : 0,
      pMatig: tests > 0 ? Math.round(matig / tests * 100) : 0,
      pHoog: tests > 0 ? Math.round(hoog / tests * 100) : 0,
      kernen: perKern.length,
      perKern,
      inw65plus,
      bereik,
    };
  }, [gefilterdData, wijk]);

  const trendData = useMemo(() => {
    return MAANDEN.filter(m => filters.maanden.includes(m.id)).map(m => {
      const maandData = gefilterdData.filter(d => d.maand === m.id);
      return {
        maand: m.kort,
        tests: maandData.reduce((a, d) => a + d.tests, 0),
        hoog: maandData.reduce((a, d) => a + d.hoog, 0),
      };
    });
  }, [gefilterdData, filters.maanden]);

  const demografieData = useMemo(() => {
    const perLeeftijd = ['65-74', '75-84', '85+'].map(l => {
      const data = gefilterdData.filter(d => d.leeftijd === l);
      return {
        groep: `${l} jaar`,
        tests: data.reduce((a, d) => a + d.tests, 0),
        laag: data.reduce((a, d) => a + d.laag, 0),
        matig: data.reduce((a, d) => a + d.matig, 0),
        hoog: data.reduce((a, d) => a + d.hoog, 0),
      };
    });
    
    const perGeslacht = ['Man', 'Vrouw'].map(g => {
      const data = gefilterdData.filter(d => d.geslacht === g);
      return {
        groep: g,
        tests: data.reduce((a, d) => a + d.tests, 0),
        laag: data.reduce((a, d) => a + d.laag, 0),
        matig: data.reduce((a, d) => a + d.matig, 0),
        hoog: data.reduce((a, d) => a + d.hoog, 0),
      };
    });
    
    return { perLeeftijd, perGeslacht };
  }, [gefilterdData]);

  const pieData = [
    { name: 'Laag', value: stats.laag, color: KLEUREN.laag },
    { name: 'Matig', value: stats.matig, color: KLEUREN.matig },
    { name: 'Hoog', value: stats.hoog, color: KLEUREN.hoog },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: KLEUREN.achtergrond, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: KLEUREN.tekst }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: KLEUREN.wit, borderBottom: `1px solid ${KLEUREN.rand}`, padding: '12px 16px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: KLEUREN.primair, display: 'flex', alignItems: 'center', justifyContent: 'center', color: KLEUREN.wit, fontSize: '16px', flexShrink: 0 }}>🛡️</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Valrisico Dashboard</h1>
              <p style={{ margin: 0, fontSize: '11px', color: KLEUREN.tekstSub }}>Gemeente Oude IJsselstreek</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <select value={wijk} onChange={(e) => { setWijk(e.target.value); setKern(null); }}
              style={{ padding: '6px 28px 6px 10px', borderRadius: '6px', border: `1px solid ${KLEUREN.rand}`, backgroundColor: KLEUREN.wit, fontSize: '12px', color: KLEUREN.tekst, cursor: 'pointer' }}>
              <option value="alle">Alle wijken</option>
              {WIJKEN.map(w => <option key={w.code} value={w.code}>{w.naam}</option>)}
            </select>
          </div>
        </div>
      </header>

      {/* ACTIEVE FILTERS BALK */}
      <div style={{ backgroundColor: KLEUREN.primairLicht, borderBottom: `1px solid ${KLEUREN.rand}`, padding: '10px 16px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: KLEUREN.primair }}>Actieve filters:</span>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Wijk */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: KLEUREN.wit, padding: '4px 10px', borderRadius: '6px', border: `1px solid ${KLEUREN.rand}` }}>
              <span style={{ fontSize: '10px', color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Wijk:</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: KLEUREN.tekst }}>
                {wijk === 'alle' ? 'Alle wijken' : WIJKEN.find(w => w.code === wijk)?.naam}
              </span>
            </div>
            
            {/* Jaren */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: KLEUREN.wit, padding: '4px 10px', borderRadius: '6px', border: `1px solid ${filters.jaren.length === JAREN.length ? KLEUREN.rand : KLEUREN.matig}` }}>
              <span style={{ fontSize: '10px', color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Jaar:</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: filters.jaren.length === JAREN.length ? KLEUREN.tekst : KLEUREN.matig }}>
                {filters.jaren.length === JAREN.length ? 'Alle' : filters.jaren.length === 1 ? filters.jaren[0] : filters.jaren.sort().join(', ')}
              </span>
            </div>
            
            {/* Maanden */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: KLEUREN.wit, padding: '4px 10px', borderRadius: '6px', border: `1px solid ${filters.maanden.length === 12 ? KLEUREN.rand : KLEUREN.matig}` }}>
              <span style={{ fontSize: '10px', color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Maanden:</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: filters.maanden.length === 12 ? KLEUREN.tekst : KLEUREN.matig }}>
                {filters.maanden.length === 12 ? 'Alle' : filters.maanden.length === 0 ? 'Geen' : `${filters.maanden.length} van 12`}
              </span>
            </div>
            
            {/* Leeftijd */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: KLEUREN.wit, padding: '4px 10px', borderRadius: '6px', border: `1px solid ${filters.leeftijden.length === 3 ? KLEUREN.rand : KLEUREN.matig}` }}>
              <span style={{ fontSize: '10px', color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Leeftijd:</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: filters.leeftijden.length === 3 ? KLEUREN.tekst : KLEUREN.matig }}>
                {filters.leeftijden.length === 3 ? 'Alle' : filters.leeftijden.join(', ')}
              </span>
            </div>
            
            {/* Geslacht */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: KLEUREN.wit, padding: '4px 10px', borderRadius: '6px', border: `1px solid ${filters.geslachten.length === 2 ? KLEUREN.rand : KLEUREN.matig}` }}>
              <span style={{ fontSize: '10px', color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Geslacht:</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: filters.geslachten.length === 2 ? KLEUREN.tekst : KLEUREN.matig }}>
                {filters.geslachten.length === 2 ? 'M + V' : filters.geslachten[0]}
              </span>
            </div>
          </div>
          
          {/* Resultaat teller */}
          <div style={{ marginLeft: 'auto', fontSize: '12px', color: KLEUREN.tekstSub }}>
            <strong style={{ color: KLEUREN.primair }}>{stats.tests.toLocaleString()}</strong> tests van <strong>{stats.inw65plus.toLocaleString()}</strong> inwoners 65+
          </div>
        </div>
      </div>

      {/* NAVIGATIE */}
      <nav style={{ backgroundColor: KLEUREN.wit, borderBottom: `1px solid ${KLEUREN.rand}`, overflowX: 'auto' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', paddingLeft: '16px', paddingRight: '16px', minWidth: 'max-content' }}>
          {[
            { id: 'overzicht', label: '📊 Overzicht' },
            { id: 'risico', label: '⚠️ Risicofactoren' },
            { id: 'actie', label: '💡 Aanbevelingen' },
            { id: 'preventie', label: '💪 Preventie' },
            { id: 'demografie', label: '👥 Demografie' },
            { id: 'kaart', label: '🗺️ Geografisch' },
            { id: 'fysio', label: '🏥 Fysio-aanmeldingen' },
          ].map(t => (
            <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</TabButton>
          ))}
        </div>
      </nav>

      {/* CONTENT */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }}>
        
        {/* FILTERS */}
        <div style={{ marginBottom: '20px' }}>
          <FilterPanel filters={filters} setFilters={setFilters} />
        </div>

        {/* === OVERZICHT === */}
        {tab === 'overzicht' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <InfoPanel type="info">
              <strong>Over dit dashboard:</strong> De Valrisicotest van VeiligheidNL is afgenomen bij inwoners van 65+ in Oude IJsselstreek. 
              In de geselecteerde wijk(en) wonen <strong>{stats.inw65plus.toLocaleString()}</strong> inwoners van 65 jaar en ouder, 
              waarvan <strong>{stats.tests.toLocaleString()}</strong> de test hebben gedaan ({stats.bereik}% bereik).
            </InfoPanel>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              <StatCard label="Inwoners 65+" value={stats.inw65plus.toLocaleString()} sub="In geselecteerde wijk(en)" icon="👥" />
              <StatCard label="Tests afgenomen" value={stats.tests.toLocaleString()} sub={`${stats.bereik}% bereik`} icon="📋" />
              <StatCard label="Laag risico" value={stats.pLaag} unit="%" sub={`${stats.laag} personen`} color={KLEUREN.laag} icon="✓" />
              <StatCard label="Matig risico" value={stats.pMatig} unit="%" sub={`${stats.matig} personen`} color={KLEUREN.matig} icon="⚡" />
              <StatCard label="Hoog risico" value={stats.pHoog} unit="%" sub={`${stats.hoog} personen`} color={KLEUREN.hoog} icon="⚠️" />
              <StatCard label="Verhoogd risico" value={stats.matig + stats.hoog} sub="Matig + Hoog" color={KLEUREN.primair} icon="🎯" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <Card>
                <CardTitle sub="Gefilterde selectie">Verdeling risiconiveau</CardTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={[
                    { niveau: 'Laag', aantal: stats.laag, percentage: stats.pLaag },
                    { niveau: 'Matig', aantal: stats.matig, percentage: stats.pMatig },
                    { niveau: 'Hoog', aantal: stats.hoog, percentage: stats.pHoog },
                  ]} layout="vertical" barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" stroke={KLEUREN.rand} horizontal={false} />
                    <XAxis type="number" domain={[0, 'auto']} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="niveau" width={50} tick={{ fontSize: 12, fontWeight: 500 }} />
                    <Tooltip 
                      formatter={(value, name, props) => [`${value} personen (${props.payload.percentage}%)`, 'Aantal']}
                    />
                    <Bar 
                      dataKey="aantal" 
                      radius={[0, 6, 6, 0]}
                      label={{ position: 'right', fontSize: 12, fontWeight: 600, formatter: (value) => value }}
                    >
                      <Cell fill={KLEUREN.laag} />
                      <Cell fill={KLEUREN.matig} />
                      <Cell fill={KLEUREN.hoog} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '12px' }}>
                  {[
                    { label: 'Laag', value: stats.pLaag, color: KLEUREN.laag },
                    { label: 'Matig', value: stats.pMatig, color: KLEUREN.matig },
                    { label: 'Hoog', value: stats.pHoog, color: KLEUREN.hoog },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color }} />
                      <span style={{ fontSize: '13px', color: KLEUREN.tekstSub }}>{item.label}: <strong style={{ color: item.color }}>{item.value}%</strong></span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardTitle sub="Geselecteerde maanden">Trend over de tijd</CardTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={KLEUREN.rand} />
                    <XAxis dataKey="maand" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Area type="monotone" dataKey="tests" name="Totaal" fill={KLEUREN.primairLicht} stroke={KLEUREN.primair} />
                    <Area type="monotone" dataKey="hoog" name="Hoog risico" fill={KLEUREN.hoogLicht} stroke={KLEUREN.hoog} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <CardTitle>Belangrijkste bevindingen</CardTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <InfoPanel type="danger">
                  <strong>{stats.pHoog}% heeft hoog valrisico</strong><br />
                  Dit zijn {stats.hoog} personen die baat hebben bij intensieve begeleiding.
                </InfoPanel>
                <InfoPanel type="warning">
                  <strong>{stats.matig + stats.hoog} met verhoogd risico</strong><br />
                  Totaal aantal personen met matig of hoog risico in de selectie.
                </InfoPanel>
                <InfoPanel type="success">
                  <strong>{stats.pLaag}% heeft laag risico</strong><br />
                  Focus op behoud door preventieve voorlichting.
                </InfoPanel>
              </div>
            </Card>
          </div>
        )}

        {/* === FYSIO AANMELDINGEN === */}
        {tab === 'fysio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <InfoPanel type="info">
              <strong>Fysiek valrisico-onderzoek:</strong> Personen met een hoog valrisico kunnen zich aanmelden 
              voor een uitgebreid fysiek onderzoek bij een van de drie aangesloten fysiotherapeuten. 
              Hieronder ziet u het totaal aantal hoog-risico personen en hoeveel zich hebben aangemeld.
            </InfoPanel>
            
            <FysioAanmeldingenPanel filters={filters} totaalHoogRisico={stats.hoog} />
          </div>
        )}

        {/* === RISICOFACTOREN === */}
        {tab === 'risico' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <InfoPanel type="info">
              <strong>Toelichting vragenlogica:</strong> De Valrisicotest volgt een beslisboom. Niet iedereen krijgt alle vragen: 
              vraag 2-3 zijn alleen voor niet-vallers, vraag 4-7 alleen voor vallers, vraag 8 alleen bij verhoogd risico. 
              De percentages zijn berekend over de respondenten die de betreffende vraag daadwerkelijk hebben beantwoord. 
              Bij elke vraag staat <em>n=X%</em> om aan te geven welk deel van de respondenten deze vraag kreeg.
            </InfoPanel>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <Card>
                <CardTitle sub="Percentage van respondenten die de vraag beantwoordden">Prevalentie per risicofactor</CardTitle>
                {RISICOFACTOREN.map(f => (
                  <div key={f.id} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: KLEUREN.tekst, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '12px' }}>
                        {f.id}. {f.label}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        {f.basisPerc && (
                          <span style={{ fontSize: '12px', color: KLEUREN.tekstSub, backgroundColor: KLEUREN.achtergrond, padding: '2px 6px', borderRadius: '4px' }}>
                            n={f.basisPerc}%
                          </span>
                        )}
                        <span style={{ fontSize: '14px', fontWeight: 700, color: f.perc > 50 ? KLEUREN.hoog : f.perc > 30 ? KLEUREN.matig : KLEUREN.primair }}>
                          {f.perc}%
                        </span>
                      </div>
                    </div>
                    <div style={{ height: '8px', backgroundColor: KLEUREN.achtergrond, borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${Math.min((f.perc / 100) * 100, 100)}%`, 
                        height: '100%', 
                        backgroundColor: f.perc > 50 ? KLEUREN.hoog : f.perc > 30 ? KLEUREN.matig : KLEUREN.primair, 
                        borderRadius: '4px', 
                        transition: 'width 0.3s ease' 
                      }} />
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: KLEUREN.tekstSub, lineHeight: 1.4 }}>{f.toelichting}</p>
                  </div>
                ))}
              </Card>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Card>
                  <CardTitle sub="Vergelijking leeftijdsgroepen">Risicoprofiel per leeftijd</CardTitle>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={RISICOFACTOREN.slice(0, 6).map(f => ({ factor: f.label.substring(0, 10), '65-74': f.l65, '75-84': f.l75, '85+': f.l85 }))}>
                      <PolarGrid stroke={KLEUREN.rand} />
                      <PolarAngleAxis dataKey="factor" tick={{ fontSize: 9 }} />
                      <PolarRadiusAxis domain={[0, 60]} tick={{ fontSize: 8 }} />
                      <Radar name="65-74" dataKey="65-74" stroke={KLEUREN.laag} fill={KLEUREN.laag} fillOpacity={0.2} />
                      <Radar name="75-84" dataKey="75-84" stroke={KLEUREN.matig} fill={KLEUREN.matig} fillOpacity={0.2} />
                      <Radar name="85+" dataKey="85+" stroke={KLEUREN.hoog} fill={KLEUREN.hoog} fillOpacity={0.2} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>

                <Card>
                  <CardTitle>Kerninterpretatie</CardTitle>
                  <div style={{ fontSize: '13px', lineHeight: 1.7, color: KLEUREN.tekstSub }}>
                    <p style={{ margin: '0 0 12px 0' }}>
                      <strong style={{ color: KLEUREN.tekst }}>42% is gevallen</strong> — van alle geteste 65-plussers. Dit bepaalt welke vervolgvragen worden gesteld.
                    </p>
                    <p style={{ margin: '0 0 12px 0' }}>
                      <strong style={{ color: KLEUREN.tekst }}>67% viel meerdere keren</strong> — van de vallers. Recidive is een belangrijke risicofactor.
                    </p>
                    <p style={{ margin: '0 0 12px 0' }}>
                      <strong style={{ color: KLEUREN.tekst }}>38% heeft valangst</strong> — van de niet-vallers. Angst leidt tot vermijding en minder bewegen.
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong style={{ color: KLEUREN.tekst }}>19% viel door flauwvallen</strong> — van de vallers. Dit vereist medisch onderzoek naar onderliggende oorzaken.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* === PREVENTIE === */}
        {tab === 'preventie' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <InfoPanel type="info">
              <strong>Preventief gedrag:</strong> De test meet 6 vormen van preventief gedrag. Doel: minimaal 80% past elke maatregel toe.
            </InfoPanel>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <Card>
                <CardTitle sub="Percentage dat de maatregel toepast">Huidige stand</CardTitle>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[...PREVENTIE].sort((a, b) => a.perc - b.perc)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={KLEUREN.rand} />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="label" width={180} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="perc" name="Doet dit" fill={KLEUREN.primair} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <CardTitle sub="Gerangschikt op impact">Prioritering</CardTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[...PREVENTIE].sort((a, b) => a.perc - b.perc).map((p, i) => (
                    <div key={p.id} style={{ padding: '14px', backgroundColor: i === 0 ? KLEUREN.hoogLicht : KLEUREN.achtergrond, borderRadius: '8px', borderLeft: `4px solid ${i === 0 ? KLEUREN.hoog : i < 3 ? KLEUREN.matig : KLEUREN.rand}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', flex: 1 }}>{p.label}</p>
                        {i === 0 && <Badge color={KLEUREN.hoog}>PRIORITEIT</Badge>}
                      </div>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '12px' }}>
                        <span><span style={{ color: KLEUREN.tekstSub }}>Gap:</span> <strong style={{ color: KLEUREN.hoog }}>{100 - p.perc}%</strong></span>
                        <span><span style={{ color: KLEUREN.tekstSub }}>Hoog-risico:</span> <strong>{p.hoogRisico}%</strong></span>
                      </div>
                      <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: KLEUREN.tekstSub }}>💡 {p.advies}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* === DEMOGRAFIE === */}
        {tab === 'demografie' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <InfoPanel type="info">
              <strong>Demografische analyse:</strong> De data hieronder is gefilterd op basis van uw selectie.
            </InfoPanel>

            <Card>
              <CardTitle>Risicoverdeling per leeftijd</CardTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={demografieData.perLeeftijd}>
                    <CartesianGrid strokeDasharray="3 3" stroke={KLEUREN.rand} />
                    <XAxis dataKey="groep" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="laag" name="Laag" fill={KLEUREN.laag} stackId="a" />
                    <Bar dataKey="matig" name="Matig" fill={KLEUREN.matig} stackId="a" />
                    <Bar dataKey="hoog" name="Hoog" fill={KLEUREN.hoog} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
                <div>
                  {demografieData.perLeeftijd.map((g, i) => (
                    <div key={i} style={{ padding: '12px', marginBottom: '12px', backgroundColor: KLEUREN.achtergrond, borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '13px' }}>{g.groep}</strong>
                        <span style={{ fontSize: '12px', color: KLEUREN.tekstSub }}>{g.tests} tests</span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                        <span style={{ color: KLEUREN.laag }}>{g.tests > 0 ? Math.round(g.laag / g.tests * 100) : 0}% laag</span>
                        <span style={{ color: KLEUREN.matig }}>{g.tests > 0 ? Math.round(g.matig / g.tests * 100) : 0}% matig</span>
                        <span style={{ color: KLEUREN.hoog }}>{g.tests > 0 ? Math.round(g.hoog / g.tests * 100) : 0}% hoog</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <CardTitle>Verschillen man/vrouw</CardTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {demografieData.perGeslacht.map((g, i) => (
                  <div key={i} style={{ padding: '20px', backgroundColor: KLEUREN.achtergrond, borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '16px' }}>{g.groep}</h4>
                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: KLEUREN.tekstSub }}>{g.tests} tests</p>
                      </div>
                      <span style={{ fontSize: '28px' }}>{i === 0 ? '👨' : '👩'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[
                        { l: 'Laag', v: g.tests > 0 ? Math.round(g.laag / g.tests * 100) : 0, c: KLEUREN.laag },
                        { l: 'Matig', v: g.tests > 0 ? Math.round(g.matig / g.tests * 100) : 0, c: KLEUREN.matig },
                        { l: 'Hoog', v: g.tests > 0 ? Math.round(g.hoog / g.tests * 100) : 0, c: KLEUREN.hoog },
                      ].map((x, j) => (
                        <div key={j} style={{ flex: 1, textAlign: 'center', padding: '10px', backgroundColor: KLEUREN.wit, borderRadius: '6px' }}>
                          <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: x.c }}>{x.v}%</p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: KLEUREN.tekstSub }}>{x.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* === KAART === */}
        {tab === 'kaart' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <InfoPanel type="info">
              <strong>Geografische spreiding:</strong> De kaart toont per kern het percentage hoog valrisico (kleur) 
              en het aantal tests (cirkelgrootte), gefilterd op uw selectie.
            </InfoPanel>

            <Card>
              <CardTitle sub="Valrisico per kern">Interactieve kaart</CardTitle>
              <GemeenteKaart stats={stats.perKern} wijkFilter={wijk} selected={kern} onSelect={setKern} />
              
              {kern && (() => {
                const k = stats.perKern.find(x => x.kern === kern);
                if (!k) return null;
                const kernInfo = KERNEN.find(x => x.id === kern);
                const w = WIJKEN.find(x => x.code === kernInfo?.wijk);
                const bereik = k.inw65plus > 0 ? Math.round((k.tests / k.inw65plus) * 100) : 0;
                return (
                  <div style={{ marginTop: '20px', padding: '20px', backgroundColor: KLEUREN.primairLicht, borderRadius: '10px', border: `2px solid ${w?.kleur}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '18px' }}>{k.naam}</h4>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: KLEUREN.tekstSub }}>{w?.naam}</p>
                      </div>
                      <button onClick={() => setKern(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: KLEUREN.tekstSub }}>×</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                      {[
                        { l: '65+ inwoners', v: k.inw65plus?.toLocaleString() },
                        { l: 'Tests', v: k.tests },
                        { l: 'Bereik', v: `${bereik}%`, c: KLEUREN.primair },
                        { l: 'Laag', v: `${k.tests > 0 ? Math.round(k.laag / k.tests * 100) : 0}%`, c: KLEUREN.laag },
                        { l: 'Matig', v: `${k.tests > 0 ? Math.round(k.matig / k.tests * 100) : 0}%`, c: KLEUREN.matig },
                        { l: 'Hoog', v: `${k.tests > 0 ? Math.round(k.hoog / k.tests * 100) : 0}%`, c: KLEUREN.hoog },
                      ].map((x, i) => (
                        <div key={i} style={{ textAlign: 'center', padding: '12px', backgroundColor: KLEUREN.wit, borderRadius: '8px' }}>
                          <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: x.c || KLEUREN.tekst }}>{x.v}</p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: KLEUREN.tekstSub }}>{x.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </Card>

            <Card padding={false}>
              <div style={{ padding: '24px 24px 16px 24px' }}>
                <CardTitle sub="Gesorteerd op percentage hoog risico">Overzicht kernen</CardTitle>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: KLEUREN.achtergrond }}>
                      <th style={{ textAlign: 'left', padding: '12px 24px', fontWeight: 600, color: KLEUREN.tekstSub }}>Kern</th>
                      <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: KLEUREN.tekstSub }}>Wijk</th>
                      <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: KLEUREN.tekstSub }}>65+ inw.</th>
                      <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600 }}>Tests</th>
                      <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: KLEUREN.primair }}>Bereik</th>
                      <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: KLEUREN.laag }}>Laag</th>
                      <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600, color: KLEUREN.matig }}>Matig</th>
                      <th style={{ textAlign: 'right', padding: '12px 24px', fontWeight: 600, color: KLEUREN.hoog }}>Hoog</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...stats.perKern].sort((a, b) => (b.hoog / b.tests) - (a.hoog / a.tests)).map(k => {
                      const kernInfo = KERNEN.find(x => x.id === k.kern);
                      const w = WIJKEN.find(x => x.code === kernInfo?.wijk);
                      const bereik = k.inw65plus > 0 ? Math.round((k.tests / k.inw65plus) * 100) : 0;
                      return (
                        <tr key={k.kern} style={{ borderBottom: `1px solid ${KLEUREN.rand}` }}>
                          <td style={{ padding: '12px 24px', fontWeight: 500 }}>{k.naam}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: w?.kleur }} />
                              {w?.naam}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', padding: '12px 16px', color: KLEUREN.tekstSub }}>{k.inw65plus?.toLocaleString()}</td>
                          <td style={{ textAlign: 'right', padding: '12px 16px' }}>{k.tests}</td>
                          <td style={{ textAlign: 'right', padding: '12px 16px', color: KLEUREN.primair, fontWeight: 600 }}>{bereik}%</td>
                          <td style={{ textAlign: 'right', padding: '12px 16px', color: KLEUREN.laag, fontWeight: 600 }}>{k.tests > 0 ? Math.round(k.laag / k.tests * 100) : 0}%</td>
                          <td style={{ textAlign: 'right', padding: '12px 16px', color: KLEUREN.matig, fontWeight: 600 }}>{k.tests > 0 ? Math.round(k.matig / k.tests * 100) : 0}%</td>
                          <td style={{ textAlign: 'right', padding: '12px 24px', color: KLEUREN.hoog, fontWeight: 600 }}>{k.tests > 0 ? Math.round(k.hoog / k.tests * 100) : 0}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* === AANBEVELINGEN === */}
        {tab === 'actie' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <InfoPanel type="info">
              <strong>Van data naar actie:</strong> Aanbevelingen geprioriteerd op impact en haalbaarheid.
            </InfoPanel>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <Card>
                <CardTitle sub="Hoogste verwachte impact">Top 3 interventies</CardTitle>
                {[
                  { titel: 'Beweegprogramma\'s uitbreiden', icon: '🏋️', prio: 'hoog', tekst: '68% doet geen evenwichtsoefeningen.', acties: ['Cursussen "In Balans"', 'Thuisoefenprogramma', 'Beweegtuin'] },
                  { titel: 'Woningchecks aanbieden', icon: '🏠', prio: 'hoog', tekst: '56% heeft geen huisaanpassingen.', acties: ['Gratis woningscans', 'Subsidie aanpassingen'] },
                  { titel: 'Fysio-doorverwijzing verbeteren', icon: '🏥', prio: 'hoog', tekst: 'Meer hoog-risico personen naar fysio.', acties: ['Actieve doorverwijzing huisarts', 'Directe koppeling testuitslag'] },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '16px', marginBottom: '12px', backgroundColor: i === 0 ? KLEUREN.hoogLicht : KLEUREN.achtergrond, borderRadius: '10px', borderLeft: `4px solid ${KLEUREN.hoog}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '24px' }}>{item.icon}</span>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '14px' }}>{item.titel}</h4>
                        <Badge color={KLEUREN.hoog}>{item.prio} prioriteit</Badge>
                      </div>
                    </div>
                    <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: KLEUREN.tekstSub }}>{item.tekst}</p>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: KLEUREN.tekstSub }}>
                      {item.acties.map((a, j) => <li key={j}>{a}</li>)}
                    </ul>
                  </div>
                ))}
              </Card>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Card>
                  <CardTitle>Doelgroepgerichte aanpak</CardTitle>
                  {[
                    { groep: '85+ jarigen', prio: 'hoog', tekst: 'Huisbezoeken, coaching.' },
                    { groep: 'Recidiverende vallers', prio: 'hoog', tekst: 'Multidisciplinair valteam.' },
                    { groep: 'Niet-aanmelders fysio', prio: 'matig', tekst: 'Actieve benadering.' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: i < 2 ? `1px solid ${KLEUREN.rand}` : 'none' }}>
                      <Badge color={item.prio === 'hoog' ? KLEUREN.hoog : KLEUREN.matig}>{item.prio}</Badge>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '13px' }}>{item.groep}</p>
                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: KLEUREN.tekstSub }}>{item.tekst}</p>
                      </div>
                    </div>
                  ))}
                </Card>

                <Card>
                  <CardTitle>KPI's om te volgen</CardTitle>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: KLEUREN.tekstSub, lineHeight: 1.8 }}>
                    <li>% hoog risico: doel daling naar 28%</li>
                    <li>Aanmeldingsgraad fysio: doel 50%</li>
                    <li>Deelname beweegprogramma's: doel 50%</li>
                    <li>Spreiding over fysiotherapeuten</li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: KLEUREN.wit, borderTop: `1px solid ${KLEUREN.rand}`, padding: '12px 16px', marginTop: '20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: KLEUREN.tekstSub, flexWrap: 'wrap', gap: '8px' }}>
          <span>Valrisico Dashboard • Gemeente Oude IJsselstreek • VeiligheidNL</span>
          <span>Data is geanonimiseerd • 2024</span>
        </div>
      </footer>
    </div>
  );
}
