import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, LineChart, Line } from 'recharts';

// =============================================================================
// ZLIMTHUIS HUISSTIJL - "Veilig wonen begint met inzicht"
// =============================================================================
const ZLIMTHUIS_LOGO = 'https://www.zlimthuis.nl/media/n5cpu0o3/logo-zlimthuis-2021-nieuwe-pay-off-rgb.png';

const KLEUREN = {
  // Zlimthuis primaire kleuren
  primair: '#0D6560',       // Zlimthuis teal/groen
  primairDonker: '#095450', // Donkerdere variant voor hover
  primairLicht: '#E6F7F5',  // Lichtere tint voor achtergronden
  
  // Risico kleuren (behouden voor duidelijkheid)
  laag: '#15803D',          // Groen - laag risico
  laagLicht: '#DCFCE7',
  matig: '#D97706',         // Oranje/amber - matig risico
  matigLicht: '#FEF3C7',
  hoog: '#DC2626',          // Rood - hoog risico
  hoogLicht: '#FEE2E2',
  
  // Neutrale kleuren
  achtergrond: '#F8FAFC',
  wit: '#FFFFFF',
  rand: '#E2E8F0',
  
  // Tekst kleuren
  tekst: '#1E293B',
  tekstSub: '#475569',
  tekstLicht: '#64748B',
  
  // Wijk kleuren (zachter, meer in lijn met Zlimthuis)
  wijk1: '#0D6560',         // Primair teal
  wijk2: '#2563EB',         // Blauw
  wijk3: '#7C3AED',         // Paars
  wijk4: '#059669',         // Emerald groen
  
  // Fysio kleuren
  fysioA: '#6366F1',
  fysioB: '#14B8A6',
  fysioC: '#F97316',
  
  // Accent kleuren
  accent: '#0EA5E9',        // Licht blauw voor links/accenten
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
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
    // Bereik van ~25% over 2 jaar, ~37.5% over 3 jaar = ~12.5% per jaar
    const basisPerJaar = kern.inw65plus * 0.125;
    
    JAREN.forEach(jaar => {
      const jaarFactor = jaar === 2023 ? 0.9 : jaar === 2024 ? 1.1 : 1.0;
      const jaarTests = Math.floor(basisPerJaar * jaarFactor);
      
      // Verdeel over maanden (niet uniform - meer in herfst)
      const maandVerdeling = MAANDEN.map(m => {
        if (jaar === 2025 && m.id > 12) return 0;
        const seizoenFactor = [9, 10, 11].includes(m.id) ? 1.4 : [7, 8].includes(m.id) ? 0.6 : 1;
        return seizoenFactor;
      });
      const totaalFactor = maandVerdeling.reduce((a, b) => a + b, 0);
      
      MAANDEN.forEach((maand, idx) => {
        if (jaar === 2025 && maand.id > 12) return;
        
        const maandTests = Math.floor(jaarTests * (maandVerdeling[idx] / totaalFactor));
        if (maandTests === 0) return;
        
        ['65-74', '75-84', '85+'].forEach(leeftijd => {
          // Verdeling naar leeftijd (gebaseerd op bevolkingsopbouw)
          const leeftijdFactor = leeftijd === '65-74' ? 0.50 : leeftijd === '75-84' ? 0.35 : 0.15;
          const leeftijdTests = Math.max(0, Math.floor(maandTests * leeftijdFactor));
          if (leeftijdTests === 0) return;
          
          ['Man', 'Vrouw'].forEach(geslacht => {
            const geslachtFactor = geslacht === 'Vrouw' ? 0.55 : 0.45;
            const tests = Math.max(0, Math.floor(leeftijdTests * geslachtFactor));
            if (tests === 0) return;
            
            // Risicoverdeling per leeftijdsgroep
            const hoogKans = leeftijd === '85+' ? 0.48 : leeftijd === '75-84' ? 0.35 : 0.22;
            const matigKans = leeftijd === '85+' ? 0.35 : leeftijd === '75-84' ? 0.40 : 0.43;
            
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
// BASIS COMPONENTEN - Zlimthuis styling
// =============================================================================

const Card = ({ children, padding = true, highlight = false }) => (
  <div style={{
    backgroundColor: KLEUREN.wit,
    borderRadius: '12px',
    border: highlight ? `2px solid ${KLEUREN.primair}` : `1px solid ${KLEUREN.rand}`,
    padding: padding ? '24px' : '0',
    height: '100%',
    boxSizing: 'border-box',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
    transition: 'box-shadow 0.2s ease',
  }}>
    {children}
  </div>
);

const CardTitle = ({ children, sub, icon }) => (
  <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
    {icon && (
      <div style={{ 
        width: '36px', height: '36px', borderRadius: '8px', 
        backgroundColor: KLEUREN.primairLicht, 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', flexShrink: 0
      }}>
        {icon}
      </div>
    )}
    <div>
      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: KLEUREN.tekst }}>{children}</h3>
      {sub && <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: KLEUREN.tekstSub }}>{sub}</p>}
    </div>
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
    
    // Bepaal welke kernen in de selectie zitten op basis van wijk filter
    const kernenInWijk = KERNEN.filter(k => wijk === 'alle' || k.wijk === wijk);
    const inw65plus = kernenInWijk.reduce((a, k) => a + k.inw65plus, 0);
    
    // Per kern statistieken - alleen kernen in de geselecteerde wijk(en)
    const perKern = kernenInWijk.map(k => {
      const kernData = gefilterdData.filter(d => d.kern === k.id);
      return {
        kern: k.id, 
        naam: k.naam, 
        wijk: k.wijk,
        inw65plus: k.inw65plus,
        tests: kernData.reduce((a, d) => a + d.tests, 0),
        laag: kernData.reduce((a, d) => a + d.laag, 0),
        matig: kernData.reduce((a, d) => a + d.matig, 0),
        hoog: kernData.reduce((a, d) => a + d.hoog, 0),
      };
    });
    
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

  // PDF Rapport genereren
  const generatePDF = () => {
    try {
      const currentDate = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
      const wijkNaam = wijk === 'alle' ? 'Alle wijken' : (WIJKEN.find(w => w.code === wijk)?.naam || wijk);
      const jarenTekst = filters.jaren.length === JAREN.length ? 'Alle' : filters.jaren.join(', ');
      const leeftijdTekst = filters.leeftijden.length === 3 ? 'Alle' : filters.leeftijden.join(', ');
      const geslachtTekst = filters.geslachten.length === 2 ? 'Man + Vrouw' : filters.geslachten[0];
      
      const laagstePreventie = [...PREVENTIE].sort((a, b) => a.perc - b.perc).slice(0, 3);
      const topKernen = [...stats.perKern].filter(k => k.tests > 0).sort((a, b) => (b.hoog / b.tests) - (a.hoog / a.tests)).slice(0, 3);
      
      const preventiePerc = PREVENTIE.find(p => p.id === 1)?.perc || 32;
      const woningPerc = 100 - (PREVENTIE.find(p => p.id === 2)?.perc || 44);

      const w = window.open('', '_blank');
      if (!w) {
        alert('Pop-up geblokkeerd! Sta pop-ups toe voor deze site.');
        return;
      }
      
      w.document.write('<html><head><meta charset="UTF-8"><title>Valrisico Rapport - Zlimthuis</title>');
      w.document.write('<style>');
      w.document.write('@page{size:A4;margin:15mm}*{box-sizing:border-box;margin:0;padding:0}');
      w.document.write('body{font-family:Arial,sans-serif;font-size:10pt;line-height:1.4;color:#1e293b;padding:20px}');
      w.document.write('.page{page-break-after:always;padding-bottom:20px}.page:last-child{page-break-after:avoid}');
      w.document.write('.header{background:#0D6560;color:white;padding:15px 20px;margin-bottom:15px;border-radius:8px;display:flex;align-items:center;justify-content:space-between}');
      w.document.write('.header-left{display:flex;align-items:center;gap:15px}');
      w.document.write('.header img{height:40px;background:white;padding:5px 10px;border-radius:6px}');;
      w.document.write('.header h1{font-size:18pt;margin-bottom:3px}.header p{font-size:9pt;opacity:0.9}');
      w.document.write('.section{margin-bottom:15px}.section-title{font-size:12pt;font-weight:bold;color:#0D6560;border-bottom:2px solid #0D6560;padding-bottom:4px;margin-bottom:10px}');
      w.document.write('.kpi-grid{display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap}');
      w.document.write('.kpi-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:10px;text-align:center;flex:1;min-width:100px}');
      w.document.write('.kpi-value{font-size:20pt;font-weight:bold}.green{color:#15803D}.orange{color:#C2410C}.red{color:#B91C1C}');
      w.document.write('.kpi-label{font-size:8pt;color:#64748b;margin-top:2px}');
      w.document.write('.filter-box{background:#CCFBF1;padding:8px 12px;border-radius:6px;font-size:9pt;margin-bottom:12px}');
      w.document.write('table{width:100%;border-collapse:collapse;font-size:9pt;margin-bottom:12px}');
      w.document.write('th,td{padding:6px 8px;text-align:left;border-bottom:1px solid #e2e8f0}th{background:#f8fafc;font-weight:600;color:#475569}');
      w.document.write('.badge{display:inline-block;padding:2px 6px;border-radius:8px;font-size:8pt;font-weight:600}');
      w.document.write('.badge-red{background:#fee2e2;color:#B91C1C}.badge-orange{background:#fed7aa;color:#C2410C}.badge-green{background:#dcfce7;color:#15803D}');
      w.document.write('.insight-box{background:#fffbeb;border-left:3px solid #f59e0b;padding:10px;margin-bottom:10px;font-size:9pt}');
      w.document.write('.insight-red{background:#fef2f2;border-color:#B91C1C}');
      w.document.write('.footer{font-size:8pt;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:8px;margin-top:15px;text-align:center}');
      w.document.write('.two-col{display:flex;gap:15px}.two-col>div{flex:1}');
      w.document.write('.leeswijzer{background:#f0f9ff;border:1px solid #0ea5e9;border-radius:6px;padding:12px;margin-bottom:12px}');
      w.document.write('.leeswijzer h3{color:#0369a1;font-size:10pt;margin-bottom:6px}');
      w.document.write('ul,ol{margin-left:18px;font-size:9pt}li{margin-bottom:3px}');
      w.document.write('.print-btn{background:#0D6560;color:white;border:none;padding:12px 30px;font-size:14px;font-weight:bold;border-radius:6px;cursor:pointer;margin:10px}');
      w.document.write('@media print{.no-print{display:none !important}}');
      w.document.write('</style></head><body>');
      
      // Print button
      w.document.write('<div class="no-print" style="text-align:center;padding:15px;background:#E6F7F5;margin-bottom:20px;border-radius:8px;border:1px solid #0D6560">');
      w.document.write('<button class="print-btn" onclick="window.print()">🖨️ Afdrukken / Opslaan als PDF</button>');
      w.document.write('<button class="print-btn" style="background:#666" onclick="window.close()">✕ Sluiten</button>');
      w.document.write('</div>');
      
      // PAGINA 1
      w.document.write('<div class="page">');
      w.document.write('<div class="header">');
      w.document.write('<div class="header-left">');
      w.document.write('<img src="' + ZLIMTHUIS_LOGO + '" alt="Zlimthuis" onerror="this.style.display=\'none\'"/>');
      w.document.write('<div><h1 style="font-size:18pt;margin:0">Valrisico Rapport</h1><p style="margin:3px 0 0 0;font-size:9pt;opacity:0.9">Gemeente Oude IJsselstreek</p></div>');
      w.document.write('</div>');
      w.document.write('<div style="text-align:right;font-size:9pt;opacity:0.9">' + currentDate + '</div>');
      w.document.write('</div>');
      
      w.document.write('<div class="leeswijzer"><h3>📖 Leeswijzer</h3>');
      w.document.write('<p style="margin-bottom:8px;font-size:9pt">Dit rapport geeft een samenvatting van de valrisico-analyse voor 65-plussers, gebaseerd op de VeiligheidNL Valrisicotest.</p>');
      w.document.write('<ul><li><b>Pagina 1:</b> Leeswijzer en begrippen</li><li><b>Pagina 2:</b> Kerncijfers en risicoverdeling</li><li><b>Pagina 3:</b> Aanbevelingen en actiepunten</li></ul></div>');
      
      w.document.write('<div class="section"><div class="section-title">Begrippen</div>');
      w.document.write('<table><tr><th style="width:25%">Begrip</th><th>Uitleg</th></tr>');
      w.document.write('<tr><td><b>Laag risico</b></td><td>Geen recente val, geen valangst, geen mobiliteitsproblemen</td></tr>');
      w.document.write('<tr><td><b>Matig risico</b></td><td>Eén of meer risicofactoren, maar geen ernstige val</td></tr>');
      w.document.write('<tr><td><b>Hoog risico</b></td><td>Ernstige val, meerdere vallen, of kan niet zelf opstaan</td></tr>');
      w.document.write('<tr><td><b>Bereik</b></td><td>Percentage 65-plussers dat de test heeft ingevuld</td></tr></table></div>');
      
      w.document.write('<div class="section"><div class="section-title">Geselecteerde data</div>');
      w.document.write('<div class="filter-box"><b>Filters:</b> Wijk: ' + wijkNaam + ' | Jaren: ' + jarenTekst + ' | Leeftijd: ' + leeftijdTekst + ' | Geslacht: ' + geslachtTekst + '</div>');
      w.document.write('<p style="font-size:9pt">Gebaseerd op <b>' + stats.tests.toLocaleString() + '</b> tests onder <b>' + stats.inw65plus.toLocaleString() + '</b> inwoners 65+ (bereik: ' + stats.bereik + '%).</p></div>');
      
      w.document.write('<div class="footer">Zlimthuis • Valrisico Dashboard • Pagina 1 van 3</div></div>');
      
      // PAGINA 2
      w.document.write('<div class="page">');
      w.document.write('<div class="section"><div class="section-title">Kerncijfers</div>');
      w.document.write('<div class="kpi-grid">');
      w.document.write('<div class="kpi-box"><div class="kpi-value">' + stats.tests.toLocaleString() + '</div><div class="kpi-label">Tests</div></div>');
      w.document.write('<div class="kpi-box"><div class="kpi-value">' + stats.bereik + '%</div><div class="kpi-label">Bereik</div></div>');
      w.document.write('<div class="kpi-box"><div class="kpi-value red">' + stats.pHoog + '%</div><div class="kpi-label">Hoog risico</div></div>');
      w.document.write('</div></div>');
      
      w.document.write('<div class="section"><div class="section-title">Risicoverdeling</div>');
      w.document.write('<div class="kpi-grid">');
      w.document.write('<div class="kpi-box"><div class="kpi-value green">' + stats.pLaag + '%</div><div class="kpi-label">Laag (' + stats.laag + ')</div></div>');
      w.document.write('<div class="kpi-box"><div class="kpi-value orange">' + stats.pMatig + '%</div><div class="kpi-label">Matig (' + stats.matig + ')</div></div>');
      w.document.write('<div class="kpi-box"><div class="kpi-value red">' + stats.pHoog + '%</div><div class="kpi-label">Hoog (' + stats.hoog + ')</div></div>');
      w.document.write('</div>');
      w.document.write('<div class="insight-box insight-red"><b>⚠️</b> ' + stats.hoog + ' personen (' + stats.pHoog + '%) hebben hoog valrisico.</div></div>');
      
      w.document.write('<div class="two-col"><div class="section"><div class="section-title">Top risicofactoren</div><table>');
      w.document.write('<tr><th>Factor</th><th>%</th></tr>');
      RISICOFACTOREN.slice(0, 5).forEach(f => {
        const badgeClass = f.perc >= 50 ? 'badge-red' : f.perc >= 35 ? 'badge-orange' : 'badge-green';
        w.document.write('<tr><td>' + f.label + '</td><td><span class="badge ' + badgeClass + '">' + f.perc + '%</span></td></tr>');
      });
      w.document.write('</table></div>');
      
      w.document.write('<div class="section"><div class="section-title">Laagste preventie</div><table>');
      w.document.write('<tr><th>Maatregel</th><th>Gap</th></tr>');
      laagstePreventie.forEach(p => {
        w.document.write('<tr><td>' + p.label + '</td><td><span class="badge badge-red">' + (100 - p.perc) + '%</span></td></tr>');
      });
      w.document.write('</table></div></div>');
      
      if (topKernen.length > 0) {
        w.document.write('<div class="section"><div class="section-title">Kernen hoogste risico</div><table>');
        w.document.write('<tr><th>Kern</th><th>Tests</th><th>Hoog</th></tr>');
        topKernen.forEach(k => {
          const perc = Math.round(k.hoog / k.tests * 100);
          w.document.write('<tr><td>' + k.naam + '</td><td>' + k.tests + '</td><td><span class="badge badge-red">' + perc + '%</span></td></tr>');
        });
        w.document.write('</table></div>');
      }
      
      w.document.write('<div class="footer">Zlimthuis • Valrisico Dashboard • Pagina 2 van 3</div></div>');
      
      // PAGINA 3
      w.document.write('<div class="page">');
      w.document.write('<div class="section"><div class="section-title">Aanbevelingen</div>');
      w.document.write('<div class="insight-box insight-red"><b>🎯 Prioriteit 1: Beweegprogramma\'s</b><br>Slechts ' + preventiePerc + '% doet evenwichtsoefeningen. Adviseer cursussen zoals "In Balans" of thuisoefenprogramma\'s.</div>');
      w.document.write('<div class="insight-box"><b>🏠 Prioriteit 2: Thuisscan aanvragen</b><br>' + woningPerc + '% heeft geen huisaanpassingen gedaan. Adviseer een gratis Zlimthuis Thuisscan voor persoonlijk advies.</div>');
      w.document.write('<div class="insight-box"><b>🏥 Prioriteit 3: Fysio-doorverwijzing</b><br>Verbeter doorverwijzing door huisarts naar fysiotherapeut voor valpreventietraining.</div></div>');
      
      w.document.write('<div class="section"><div class="section-title">Doelgroepen</div><table>');
      w.document.write('<tr><th>Doelgroep</th><th>Aanpak</th><th>Prio</th></tr>');
      w.document.write('<tr><td>85+ jarigen</td><td>Huisbezoeken, Thuisscan aan Huis</td><td><span class="badge badge-red">Hoog</span></td></tr>');
      w.document.write('<tr><td>Recidiverende vallers</td><td>Multidisciplinair valteam</td><td><span class="badge badge-red">Hoog</span></td></tr>');
      w.document.write('<tr><td>Matig risico</td><td>Groepscursussen, online Thuisscan</td><td><span class="badge badge-orange">Matig</span></td></tr>');
      w.document.write('<tr><td>Laag risico</td><td>Preventieve voorlichting</td><td><span class="badge badge-green">Laag</span></td></tr>');
      w.document.write('</table></div>');
      
      w.document.write('<div class="section"><div class="section-title">KPI\'s</div><ul>');
      w.document.write('<li>Percentage hoog risico: doel daling van ' + stats.pHoog + '% naar 25%</li>');
      w.document.write('<li>Bereik valrisicotest: doel stijging van ' + stats.bereik + '% naar 40%</li>');
      w.document.write('<li>Deelname beweegprogramma\'s: doel 50% van hoog-risico groep</li>');
      w.document.write('<li>Thuisscans uitgevoerd: doel 200 per jaar</li></ul></div>');
      
      w.document.write('<div class="section"><div class="section-title">Vervolgstappen</div><ol>');
      w.document.write('<li>Presenteer bevindingen aan stakeholders (welzijn, zorg, WMO)</li>');
      w.document.write('<li>Stel werkgroep valpreventie samen</li>');
      w.document.write('<li>Ontwikkel communicatiecampagne gericht op 65-plussers</li>');
      w.document.write('<li>Plan evaluatiemoment over 12 maanden</li></ol></div>');
      
      w.document.write('<div class="section" style="background:#E6F7F5;padding:15px;border-radius:8px;margin-top:20px">');
      w.document.write('<p style="margin:0;font-size:9pt"><b>Over Zlimthuis:</b> Zlimthuis helpt ouderen om veilig en zelfstandig thuis te blijven wonen. ');
      w.document.write('Met de Thuisscan krijgt u persoonlijk advies over woningaanpassingen en hulpmiddelen. ');
      w.document.write('Meer informatie: <b>zlimthuis.nl</b> | Tel: 088 - 17 17 370</p></div>');
      
      w.document.write('<div class="footer">Zlimthuis • Valrisico Dashboard • Pagina 3 van 3</div></div>');
      
      w.document.write('</body></html>');
      w.document.close();
      
    } catch (error) {
      console.error('PDF generatie fout:', error);
      alert('Er ging iets mis bij het genereren van het rapport. Probeer het opnieuw.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: KLEUREN.achtergrond, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: KLEUREN.tekst }}>
      
      {/* STICKY HEADER WRAPPER */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: KLEUREN.achtergrond }}>
        {/* HEADER */}
        <header style={{ backgroundColor: KLEUREN.wit, borderBottom: `1px solid ${KLEUREN.rand}`, padding: '10px 16px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={ZLIMTHUIS_LOGO} 
                alt="Zlimthuis" 
                style={{ height: '36px', width: 'auto' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div style={{ borderLeft: `1px solid ${KLEUREN.rand}`, paddingLeft: '12px' }}>
                <h1 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: KLEUREN.tekst }}>Valrisico Dashboard</h1>
                <p style={{ margin: 0, fontSize: '10px', color: KLEUREN.tekstSub }}>Gemeente Oude IJsselstreek</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <select value={wijk} onChange={(e) => { setWijk(e.target.value); setKern(null); }}
                style={{ padding: '6px 28px 6px 10px', borderRadius: '6px', border: `1px solid ${KLEUREN.rand}`, backgroundColor: KLEUREN.wit, fontSize: '12px', color: KLEUREN.tekst, cursor: 'pointer' }}>
                <option value="alle">Alle wijken</option>
                {WIJKEN.map(w => <option key={w.code} value={w.code}>{w.naam}</option>)}
              </select>
              
              <button 
                onClick={() => generatePDF()}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '7px 16px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  backgroundColor: KLEUREN.primair, 
                  color: KLEUREN.wit, 
                  fontSize: '12px', 
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                🖨️ PDF Rapport
              </button>
            </div>
          </div>
        </header>

        {/* ACTIEVE FILTERS BALK */}
        <div style={{ backgroundColor: KLEUREN.primairLicht, borderBottom: `1px solid ${KLEUREN.rand}`, padding: '8px 16px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: KLEUREN.primair }}>Filters:</span>
            
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Wijk */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: KLEUREN.wit, padding: '3px 8px', borderRadius: '5px', border: `1px solid ${KLEUREN.rand}` }}>
                <span style={{ fontSize: '9px', color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Wijk:</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: KLEUREN.tekst }}>
                  {wijk === 'alle' ? 'Alle' : WIJKEN.find(w => w.code === wijk)?.naam}
                </span>
              </div>
              
              {/* Jaren */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: KLEUREN.wit, padding: '3px 8px', borderRadius: '5px', border: `1px solid ${filters.jaren.length === JAREN.length ? KLEUREN.rand : KLEUREN.matig}` }}>
                <span style={{ fontSize: '9px', color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Jaar:</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: filters.jaren.length === JAREN.length ? KLEUREN.tekst : KLEUREN.matig }}>
                  {filters.jaren.length === JAREN.length ? 'Alle' : filters.jaren.length === 1 ? filters.jaren[0] : filters.jaren.sort().join(', ')}
                </span>
              </div>
              
              {/* Maanden */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: KLEUREN.wit, padding: '3px 8px', borderRadius: '5px', border: `1px solid ${filters.maanden.length === 12 ? KLEUREN.rand : KLEUREN.matig}` }}>
                <span style={{ fontSize: '9px', color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Mnd:</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: filters.maanden.length === 12 ? KLEUREN.tekst : KLEUREN.matig }}>
                  {filters.maanden.length === 12 ? 'Alle' : `${filters.maanden.length}/12`}
                </span>
              </div>
              
              {/* Leeftijd */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: KLEUREN.wit, padding: '3px 8px', borderRadius: '5px', border: `1px solid ${filters.leeftijden.length === 3 ? KLEUREN.rand : KLEUREN.matig}` }}>
                <span style={{ fontSize: '9px', color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Leeftijd:</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: filters.leeftijden.length === 3 ? KLEUREN.tekst : KLEUREN.matig }}>
                  {filters.leeftijden.length === 3 ? 'Alle' : filters.leeftijden.join(', ')}
                </span>
              </div>
              
              {/* Geslacht */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: KLEUREN.wit, padding: '3px 8px', borderRadius: '5px', border: `1px solid ${filters.geslachten.length === 2 ? KLEUREN.rand : KLEUREN.matig}` }}>
                <span style={{ fontSize: '9px', color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Geslacht:</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: filters.geslachten.length === 2 ? KLEUREN.tekst : KLEUREN.matig }}>
                  {filters.geslachten.length === 2 ? 'M+V' : filters.geslachten[0]}
                </span>
              </div>
            </div>
            
            {/* Resultaat teller */}
            <div style={{ marginLeft: 'auto', fontSize: '11px', color: KLEUREN.tekstSub }}>
              <strong style={{ color: KLEUREN.primair }}>{stats.tests.toLocaleString()}</strong> tests
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
      </div>

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
              Per vraag zie je: <strong>percentage</strong> (<span style={{ color: KLEUREN.hoog, fontWeight: 600 }}>aantal JA</span> | totaal ondervraagd).
            </InfoPanel>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <Card>
                <CardTitle sub="Percentage en aantallen per vraag">Prevalentie per risicofactor</CardTitle>
                {RISICOFACTOREN.map(f => {
                  // Bereken aantallen op basis van totaal tests en basisPerc
                  const totaalTests = stats.tests;
                  const ondervraagd = f.basisPerc ? Math.round(totaalTests * (f.basisPerc / 100)) : totaalTests;
                  const aantalJa = Math.round(ondervraagd * (f.perc / 100));
                  const kleur = f.perc > 50 ? KLEUREN.hoog : f.perc > 30 ? KLEUREN.matig : KLEUREN.primair;
                  
                  return (
                    <div key={f.id} style={{ marginBottom: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: KLEUREN.tekst, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '12px' }}>
                          {f.id}. {f.label}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexShrink: 0 }}>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: kleur }}>
                            {f.perc}%
                          </span>
                          <span style={{ fontSize: '11px', color: KLEUREN.tekstSub }}>
                            (<span style={{ fontWeight: 700, color: kleur }}>{aantalJa}</span> | {ondervraagd})
                          </span>
                        </div>
                      </div>
                      <div style={{ height: '8px', backgroundColor: KLEUREN.achtergrond, borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${Math.min((f.perc / 100) * 100, 100)}%`, 
                          height: '100%', 
                          backgroundColor: kleur, 
                          borderRadius: '4px', 
                          transition: 'width 0.3s ease' 
                        }} />
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: KLEUREN.tekstSub, lineHeight: 1.4 }}>{f.toelichting}</p>
                    </div>
                  );
                })}
              </Card>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Card>
                  <CardTitle sub="Vergelijking leeftijdsgroepen">Risicoprofiel per leeftijd</CardTitle>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: `2px solid ${KLEUREN.rand}`, fontWeight: 600, color: KLEUREN.tekstSub }}>Risicofactor</th>
                          <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: `2px solid ${KLEUREN.rand}`, fontWeight: 600, color: KLEUREN.laag, minWidth: '70px' }}>65-74</th>
                          <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: `2px solid ${KLEUREN.rand}`, fontWeight: 600, color: KLEUREN.matig, minWidth: '70px' }}>75-84</th>
                          <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: `2px solid ${KLEUREN.rand}`, fontWeight: 600, color: KLEUREN.hoog, minWidth: '70px' }}>85+</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RISICOFACTOREN.map((f, idx) => {
                          const getKleur = (waarde) => {
                            if (waarde >= 50) return { bg: KLEUREN.hoogLicht, tekst: KLEUREN.hoog };
                            if (waarde >= 35) return { bg: KLEUREN.matigLicht, tekst: KLEUREN.matig };
                            return { bg: KLEUREN.laagLicht, tekst: KLEUREN.laag };
                          };
                          const k65 = getKleur(f.l65);
                          const k75 = getKleur(f.l75);
                          const k85 = getKleur(f.l85);
                          
                          return (
                            <tr key={f.id} style={{ borderBottom: `1px solid ${KLEUREN.rand}` }}>
                              <td style={{ padding: '10px 12px', fontWeight: 500, color: KLEUREN.tekst }}>{f.label}</td>
                              <td style={{ padding: '8px', textAlign: 'center' }}>
                                <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', backgroundColor: k65.bg, color: k65.tekst, fontWeight: 700, minWidth: '45px' }}>
                                  {f.l65}%
                                </span>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center' }}>
                                <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', backgroundColor: k75.bg, color: k75.tekst, fontWeight: 700, minWidth: '45px' }}>
                                  {f.l75}%
                                </span>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center' }}>
                                <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', backgroundColor: k85.bg, color: k85.tekst, fontWeight: 700, minWidth: '45px' }}>
                                  {f.l85}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '12px', justifyContent: 'center', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: KLEUREN.laagLicht, border: `1px solid ${KLEUREN.laag}` }}></span>
                      <span style={{ color: KLEUREN.tekstSub }}>&lt; 35%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: KLEUREN.matigLicht, border: `1px solid ${KLEUREN.matig}` }}></span>
                      <span style={{ color: KLEUREN.tekstSub }}>35-49%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: KLEUREN.hoogLicht, border: `1px solid ${KLEUREN.hoog}` }}></span>
                      <span style={{ color: KLEUREN.tekstSub }}>≥ 50%</span>
                    </div>
                  </div>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <Card>
                <CardTitle sub="Percentage dat de maatregel toepast">Huidige stand</CardTitle>
                <div style={{ width: '100%', overflowX: 'auto' }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[...PREVENTIE].sort((a, b) => a.perc - b.perc)} layout="vertical" margin={{ left: 10, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={KLEUREN.rand} />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => `${v}%`} />
                      <Bar dataKey="perc" name="Doet dit" fill={KLEUREN.primair} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <CardTitle sub="Gerangschikt op impact">Prioritering</CardTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[...PREVENTIE].sort((a, b) => a.perc - b.perc).map((p, i) => (
                    <div key={p.id} style={{ padding: '12px', backgroundColor: i === 0 ? KLEUREN.hoogLicht : KLEUREN.achtergrond, borderRadius: '8px', borderLeft: `4px solid ${i === 0 ? KLEUREN.hoog : i < 3 ? KLEUREN.matig : KLEUREN.rand}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '12px', flex: 1, minWidth: '150px' }}>{p.label}</p>
                        {i === 0 && <Badge color={KLEUREN.hoog}>PRIORITEIT</Badge>}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '11px', flexWrap: 'wrap' }}>
                        <span><span style={{ color: KLEUREN.tekstSub }}>Gap:</span> <strong style={{ color: KLEUREN.hoog }}>{100 - p.perc}%</strong></span>
                        <span><span style={{ color: KLEUREN.tekstSub }}>Hoog-risico:</span> <strong>{p.hoogRisico}%</strong></span>
                      </div>
                      <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: KLEUREN.tekstSub }}>💡 {p.advies}</p>
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
                    {[...stats.perKern].sort((a, b) => {
                      // Sorteer op % hoog, maar alleen als er tests zijn
                      const aPerc = a.tests > 0 ? (a.hoog / a.tests) : -1;
                      const bPerc = b.tests > 0 ? (b.hoog / b.tests) : -1;
                      return bPerc - aPerc;
                    }).map(k => {
                      const kernInfo = KERNEN.find(x => x.id === k.kern);
                      const w = WIJKEN.find(x => x.code === kernInfo?.wijk);
                      const bereik = k.inw65plus > 0 ? Math.round((k.tests / k.inw65plus) * 100) : 0;
                      return (
                        <tr key={k.kern} style={{ borderBottom: `1px solid ${KLEUREN.rand}`, opacity: k.tests === 0 ? 0.5 : 1 }}>
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
      <footer style={{ backgroundColor: KLEUREN.wit, borderTop: `1px solid ${KLEUREN.rand}`, padding: '16px', marginTop: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: KLEUREN.tekstSub, flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={ZLIMTHUIS_LOGO} alt="Zlimthuis" style={{ height: '24px' }} onError={(e) => { e.target.style.display = 'none'; }} />
            <span>Valrisico Dashboard • Gemeente Oude IJsselstreek</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Gebaseerd op VeiligheidNL Valrisicotest</span>
            <span style={{ color: KLEUREN.rand }}>|</span>
            <a href="https://zlimthuis.nl" target="_blank" rel="noopener noreferrer" style={{ color: KLEUREN.primair, textDecoration: 'none' }}>zlimthuis.nl</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
