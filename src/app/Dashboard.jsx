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
            
            // Risicoverdeling per leeftijdsgroep - risico loopt op met leeftijd
            const hoogKans = leeftijd === '85+' ? 0.52 : leeftijd === '75-84' ? 0.35 : 0.20;
            const matigKans = leeftijd === '85+' ? 0.32 : leeftijd === '75-84' ? 0.38 : 0.35;
            
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
        <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginTop: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '26px', fontWeight: 700, color: color || KLEUREN.tekst, lineHeight: 1 }}>{value}</span>
          {unit && <span style={{ fontSize: '16px', fontWeight: 500, color: KLEUREN.tekstSub }}>{unit}</span>}
        </div>
        {sub && <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: KLEUREN.tekstSub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</p>}
      </div>
      {icon && (
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          backgroundColor: color ? `${color}15` : KLEUREN.primairLicht,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', flexShrink: 0, marginLeft: '8px',
          color: color || KLEUREN.primair,
          fontWeight: 700,
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
    padding: '12px 20px', 
    border: 'none',
    borderBottom: active ? `3px solid ${KLEUREN.primair}` : '3px solid transparent',
    borderRadius: '0', 
    cursor: 'pointer',
    fontSize: '13px', 
    fontWeight: active ? 600 : 500, 
    fontFamily: 'inherit',
    backgroundColor: 'transparent',
    color: active ? KLEUREN.primair : KLEUREN.tekstSub,
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

  // PDF Rapport genereren - 5 pagina's in Zlimthuis huisstijl
  const generatePDF = () => {
    try {
      const currentDate = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
      const wijkNaam = wijk === 'alle' ? 'Alle wijken' : (WIJKEN.find(w => w.code === wijk)?.naam || wijk);
      const jarenTekst = filters.jaren.length === JAREN.length ? 'Alle jaren' : filters.jaren.join(', ');
      const leeftijdTekst = filters.leeftijden.length === 3 ? 'Alle leeftijden' : filters.leeftijden.join(', ');
      const geslachtTekst = filters.geslachten.length === 2 ? 'Man en vrouw' : filters.geslachten[0];
      
      const laagstePreventie = [...PREVENTIE].sort((a, b) => a.perc - b.perc);
      const topKernen = [...stats.perKern].filter(k => k.tests > 0).sort((a, b) => (b.hoog / b.tests) - (a.hoog / a.tests)).slice(0, 5);
      
      const preventiePerc = PREVENTIE.find(p => p.id === 1)?.perc || 32;
      const woningPerc = 100 - (PREVENTIE.find(p => p.id === 2)?.perc || 44);

      const w = window.open('', '_blank');
      if (!w) {
        alert('Pop-up geblokkeerd! Sta pop-ups toe voor deze site.');
        return;
      }
      
      // CSS in Zlimthuis huisstijl
      w.document.write('<html><head><meta charset="UTF-8"><title>Valrisico Rapport - Gemeente Oude IJsselstreek</title>');
      w.document.write('<style>');
      w.document.write('@page{size:A4;margin:0}');
      w.document.write('*{box-sizing:border-box;margin:0;padding:0}');
      w.document.write('body{font-family:"Segoe UI",Roboto,Arial,sans-serif;font-size:10pt;line-height:1.5;color:#1e293b;background:#f8fafc}');
      
      // Page layout
      w.document.write('.page{width:210mm;min-height:297mm;padding:20mm;background:white;margin:0 auto 20px auto;box-shadow:0 2px 10px rgba(0,0,0,0.1);position:relative;page-break-after:always}');
      w.document.write('.page:last-child{page-break-after:avoid}');
      
      // Header - Zlimthuis teal
      w.document.write('.page-header{background:linear-gradient(135deg,#0D6560 0%,#095450 100%);color:white;padding:25px 30px;margin:-20mm -20mm 25px -20mm;display:flex;justify-content:space-between;align-items:center}');
      w.document.write('.page-header-inner{background:#0D6560;margin:0;padding:20px 25px;border-radius:0 0 12px 12px}');
      w.document.write('.logo-area{display:flex;align-items:center;gap:20px}');
      w.document.write('.logo-area img{height:45px;background:white;padding:8px 12px;border-radius:8px}');
      w.document.write('.logo-text h1{font-size:22pt;font-weight:600;margin:0;letter-spacing:-0.5px}');
      w.document.write('.logo-text p{font-size:10pt;opacity:0.9;margin-top:3px}');
      w.document.write('.header-date{text-align:right;font-size:9pt;opacity:0.85}');
      
      // Cover page specific
      w.document.write('.cover-title{text-align:center;padding:60px 40px}');
      w.document.write('.cover-title h1{font-size:36pt;color:#0D6560;font-weight:700;margin-bottom:15px;letter-spacing:-1px}');
      w.document.write('.cover-title h2{font-size:18pt;color:#475569;font-weight:400;margin-bottom:40px}');
      w.document.write('.cover-subtitle{font-size:12pt;color:#64748b;margin-top:20px}');
      
      // Section styling
      w.document.write('.section{margin-bottom:25px}');
      w.document.write('.section-title{font-size:14pt;font-weight:600;color:#0D6560;padding-bottom:8px;margin-bottom:15px;border-bottom:3px solid #0D6560;display:flex;align-items:center;gap:10px}');
      w.document.write('.section-title span{font-size:18pt}');
      w.document.write('.section-subtitle{font-size:11pt;color:#475569;margin-bottom:12px}');
      
      // KPI boxes - Zlimthuis style
      w.document.write('.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-bottom:20px}');
      w.document.write('.kpi-box{background:linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%);border:1px solid #e2e8f0;border-radius:12px;padding:20px 15px;text-align:center;position:relative;overflow:hidden}');
      w.document.write('.kpi-box::before{content:"";position:absolute;top:0;left:0;right:0;height:4px}');
      w.document.write('.kpi-box.teal::before{background:#0D6560}.kpi-box.green::before{background:#15803D}.kpi-box.orange::before{background:#D97706}.kpi-box.red::before{background:#DC2626}');
      w.document.write('.kpi-value{font-size:28pt;font-weight:700;line-height:1}');
      w.document.write('.kpi-value.teal{color:#0D6560}.kpi-value.green{color:#15803D}.kpi-value.orange{color:#D97706}.kpi-value.red{color:#DC2626}');
      w.document.write('.kpi-label{font-size:9pt;color:#64748b;margin-top:8px;text-transform:uppercase;letter-spacing:0.5px}');
      
      // Cards - similar to dashboard
      w.document.write('.card{background:white;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:15px;box-shadow:0 1px 3px rgba(0,0,0,0.05)}');
      w.document.write('.card-highlight{border-left:4px solid #DC2626;background:#fef2f2}');
      w.document.write('.card-teal{border-left:4px solid #0D6560;background:#E6F7F5}');
      w.document.write('.card-orange{border-left:4px solid #D97706;background:#fffbeb}');
      w.document.write('.card h3{font-size:12pt;font-weight:600;color:#1e293b;margin-bottom:8px;display:flex;align-items:center;gap:8px}');
      w.document.write('.card p{font-size:10pt;color:#475569;line-height:1.6}');
      
      // Tables - clean style
      w.document.write('table{width:100%;border-collapse:collapse;font-size:9pt;margin-bottom:15px}');
      w.document.write('th{background:#0D6560;color:white;padding:12px 15px;text-align:left;font-weight:600;font-size:9pt}');
      w.document.write('th:first-child{border-radius:8px 0 0 0}th:last-child{border-radius:0 8px 0 0}');
      w.document.write('td{padding:10px 15px;border-bottom:1px solid #e2e8f0}');
      w.document.write('tr:nth-child(even){background:#f8fafc}');
      w.document.write('tr:last-child td:first-child{border-radius:0 0 0 8px}tr:last-child td:last-child{border-radius:0 0 8px 0}');
      
      // Badges
      w.document.write('.badge{display:inline-block;padding:4px 10px;border-radius:20px;font-size:8pt;font-weight:600;text-transform:uppercase;letter-spacing:0.3px}');
      w.document.write('.badge-red{background:#fee2e2;color:#991b1b}.badge-orange{background:#fef3c7;color:#92400e}.badge-green{background:#dcfce7;color:#166534}.badge-teal{background:#ccfbf1;color:#115e59}');
      
      // Priority boxes
      w.document.write('.priority-box{background:white;border-radius:12px;padding:20px;margin-bottom:15px;border:1px solid #e2e8f0;position:relative}');
      w.document.write('.priority-box.prio-1{border-left:5px solid #DC2626}.priority-box.prio-2{border-left:5px solid #D97706}.priority-box.prio-3{border-left:5px solid #0D6560}');
      w.document.write('.priority-number{position:absolute;top:15px;right:15px;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14pt;color:white}');
      w.document.write('.prio-1 .priority-number{background:#DC2626}.prio-2 .priority-number{background:#D97706}.prio-3 .priority-number{background:#0D6560}');
      w.document.write('.priority-box h3{font-size:13pt;font-weight:600;color:#1e293b;margin-bottom:10px;padding-right:40px}');
      w.document.write('.priority-box .problem{background:#fef2f2;border-radius:8px;padding:12px;margin-bottom:12px;font-size:10pt}');
      w.document.write('.priority-box .actions{font-size:9pt;color:#475569}');
      w.document.write('.priority-box .actions ul{margin-left:18px;margin-top:8px}');
      w.document.write('.priority-box .actions li{margin-bottom:4px}');
      
      // Two column layout
      w.document.write('.two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px}');
      w.document.write('.three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px}');
      
      // Leeswijzer
      w.document.write('.leeswijzer{background:linear-gradient(135deg,#E6F7F5 0%,#ccfbf1 100%);border:2px solid #0D6560;border-radius:12px;padding:25px;margin:30px 0}');
      w.document.write('.leeswijzer h3{color:#0D6560;font-size:14pt;margin-bottom:15px;display:flex;align-items:center;gap:10px}');
      w.document.write('.leeswijzer-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:15px}');
      w.document.write('.leeswijzer-item{background:white;padding:15px;border-radius:8px;display:flex;align-items:flex-start;gap:12px}');
      w.document.write('.leeswijzer-item .page-num{background:#0D6560;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11pt;flex-shrink:0}');
      w.document.write('.leeswijzer-item h4{font-size:10pt;font-weight:600;color:#1e293b;margin-bottom:3px}');
      w.document.write('.leeswijzer-item p{font-size:9pt;color:#64748b}');
      
      // Footer
      w.document.write('.page-footer{position:absolute;bottom:15mm;left:20mm;right:20mm;display:flex;justify-content:space-between;align-items:center;padding-top:15px;border-top:2px solid #e2e8f0;font-size:8pt;color:#94a3b8}');
      w.document.write('.page-footer img{height:20px;opacity:0.7}');
      
      // Info boxes
      w.document.write('.info-box{background:#f0f9ff;border:1px solid #0ea5e9;border-radius:8px;padding:15px;margin-bottom:15px;font-size:9pt}');
      w.document.write('.info-box.warning{background:#fffbeb;border-color:#f59e0b}');
      w.document.write('.info-box.danger{background:#fef2f2;border-color:#DC2626}');
      
      // Doelgroep cards
      w.document.write('.doelgroep-card{background:white;border-radius:10px;padding:15px;border:1px solid #e2e8f0}');
      w.document.write('.doelgroep-card h4{font-size:11pt;font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:8px}');
      w.document.write('.doelgroep-card ul{margin-left:16px;font-size:9pt;color:#475569}');
      w.document.write('.doelgroep-card li{margin-bottom:3px}');
      
      // Print styles
      w.document.write('.print-controls{text-align:center;padding:20px;background:#0D6560;margin-bottom:30px;border-radius:12px}');
      w.document.write('.print-btn{background:white;color:#0D6560;border:none;padding:15px 40px;font-size:14px;font-weight:600;border-radius:8px;cursor:pointer;margin:0 10px;transition:all 0.2s}');
      w.document.write('.print-btn:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.2)}');
      w.document.write('.print-btn.secondary{background:#064e4a;color:white}');
      w.document.write('@media print{.no-print{display:none !important}.page{margin:0;box-shadow:none;page-break-after:always}}');
      w.document.write('</style></head><body>');
      
      // Print controls
      w.document.write('<div class="no-print print-controls">');
      w.document.write('<button class="print-btn" onclick="window.print()">🖨️ Afdrukken / Opslaan als PDF</button>');
      w.document.write('<button class="print-btn secondary" onclick="window.close()">✕ Sluiten</button>');
      w.document.write('</div>');
      
      // ==================== PAGINA 1: VOORBLAD & LEESWIJZER ====================
      w.document.write('<div class="page">');
      w.document.write('<div class="page-header">');
      w.document.write('<div class="logo-area">');
      w.document.write('<img src="' + ZLIMTHUIS_LOGO + '" alt="Logo" onerror="this.style.display=\'none\'"/>');
      w.document.write('<div class="logo-text"><h1>Valrisico Rapport</h1><p>Analyse & Aanbevelingen</p></div>');
      w.document.write('</div>');
      w.document.write('<div class="header-date">Rapportdatum<br><strong>' + currentDate + '</strong></div>');
      w.document.write('</div>');
      
      w.document.write('<div class="cover-title">');
      w.document.write('<h1>Valpreventie</h1>');
      w.document.write('<h2>Gemeente Oude IJsselstreek</h2>');
      w.document.write('<p class="cover-subtitle">Gebaseerd op ' + stats.tests.toLocaleString() + ' valrisicotests onder 65-plussers</p>');
      w.document.write('</div>');
      
      w.document.write('<div class="leeswijzer">');
      w.document.write('<h3>📖 Leeswijzer</h3>');
      w.document.write('<div class="leeswijzer-grid">');
      w.document.write('<div class="leeswijzer-item"><div class="page-num">1</div><div><h4>Introductie</h4><p>Voorblad, leeswijzer en context</p></div></div>');
      w.document.write('<div class="leeswijzer-item"><div class="page-num">2</div><div><h4>Kerncijfers</h4><p>Risicoverdeling en belangrijkste statistieken</p></div></div>');
      w.document.write('<div class="leeswijzer-item"><div class="page-num">3</div><div><h4>Analyse</h4><p>Risicofactoren, preventie en geografische spreiding</p></div></div>');
      w.document.write('<div class="leeswijzer-item"><div class="page-num">4</div><div><h4>Doelgroepen</h4><p>Specifieke aanpak per leeftijd en risiconiveau</p></div></div>');
      w.document.write('<div class="leeswijzer-item"><div class="page-num">5</div><div><h4>Aanbevelingen</h4><p>Prioriteiten, KPI\'s en vervolgstappen</p></div></div>');
      w.document.write('</div></div>');
      
      w.document.write('<div class="card card-teal">');
      w.document.write('<h3>ℹ️ Over dit rapport</h3>');
      w.document.write('<p>Dit rapport is gebaseerd op de VeiligheidNL Valrisicotest, een wetenschappelijk onderbouwde screeningstool. ');
      w.document.write('De test bepaalt op basis van 8 vragen of iemand een laag, matig of hoog valrisico heeft. ');
      w.document.write('Daarnaast worden 6 preventieve gedragingen uitgevraagd.</p>');
      w.document.write('</div>');
      
      w.document.write('<div class="card">');
      w.document.write('<h3>🔍 Geselecteerde data</h3>');
      w.document.write('<p><strong>Wijk:</strong> ' + wijkNaam + ' &nbsp;|&nbsp; <strong>Jaren:</strong> ' + jarenTekst + ' &nbsp;|&nbsp; <strong>Leeftijd:</strong> ' + leeftijdTekst + ' &nbsp;|&nbsp; <strong>Geslacht:</strong> ' + geslachtTekst + '</p>');
      w.document.write('</div>');
      
      w.document.write('<div class="page-footer">');
      w.document.write('<span>Valrisico Dashboard • Gemeente Oude IJsselstreek</span>');
      w.document.write('<span>Pagina 1 van 5</span>');
      w.document.write('</div></div>');
      
      // ==================== PAGINA 2: KERNCIJFERS ====================
      w.document.write('<div class="page">');
      w.document.write('<div class="section"><div class="section-title"><span>📊</span> Kerncijfers</div>');
      w.document.write('<div class="kpi-grid">');
      w.document.write('<div class="kpi-box teal"><div class="kpi-value teal">' + stats.tests.toLocaleString() + '</div><div class="kpi-label">Totaal tests</div></div>');
      w.document.write('<div class="kpi-box teal"><div class="kpi-value teal">' + stats.inw65plus.toLocaleString() + '</div><div class="kpi-label">65+ inwoners</div></div>');
      w.document.write('<div class="kpi-box teal"><div class="kpi-value teal">' + stats.bereik + '%</div><div class="kpi-label">Bereik</div></div>');
      w.document.write('<div class="kpi-box red"><div class="kpi-value red">' + stats.pHoog + '%</div><div class="kpi-label">Hoog risico</div></div>');
      w.document.write('</div></div>');
      
      w.document.write('<div class="section"><div class="section-title"><span>🎯</span> Risicoverdeling</div>');
      w.document.write('<div class="three-col">');
      w.document.write('<div class="kpi-box green"><div class="kpi-value green">' + stats.pLaag + '%</div><div class="kpi-label">Laag risico<br>(' + stats.laag.toLocaleString() + ' personen)</div></div>');
      w.document.write('<div class="kpi-box orange"><div class="kpi-value orange">' + stats.pMatig + '%</div><div class="kpi-label">Matig risico<br>(' + stats.matig.toLocaleString() + ' personen)</div></div>');
      w.document.write('<div class="kpi-box red"><div class="kpi-value red">' + stats.pHoog + '%</div><div class="kpi-label">Hoog risico<br>(' + stats.hoog.toLocaleString() + ' personen)</div></div>');
      w.document.write('</div>');
      
      w.document.write('<div class="info-box danger" style="margin-top:20px">');
      w.document.write('<strong>⚠️ Belangrijke bevinding:</strong> ' + stats.hoog.toLocaleString() + ' personen (' + stats.pHoog + '%) hebben een hoog valrisico. ');
      w.document.write('Deze groep heeft baat bij intensieve begeleiding door een fysiotherapeut of multidisciplinair valteam.');
      w.document.write('</div></div>');
      
      w.document.write('<div class="section"><div class="section-title"><span>📋</span> Begrippen</div>');
      w.document.write('<table>');
      w.document.write('<tr><th style="width:25%">Risiconiveau</th><th>Betekenis</th><th style="width:20%">Advies</th></tr>');
      w.document.write('<tr><td><span class="badge badge-green">Laag risico</span></td><td>Geen recente val, geen valangst, geen mobiliteitsproblemen</td><td>Preventieve voorlichting</td></tr>');
      w.document.write('<tr><td><span class="badge badge-orange">Matig risico</span></td><td>Eén of meer risicofactoren aanwezig, maar geen ernstige val of complicaties</td><td>Groepscursus valpreventie</td></tr>');
      w.document.write('<tr><td><span class="badge badge-red">Hoog risico</span></td><td>Ernstige val met verwondingen, meerdere vallen, flauwgevallen, of kon niet zelf opstaan</td><td>Doorverwijzing fysiotherapeut</td></tr>');
      w.document.write('</table></div>');
      
      w.document.write('<div class="page-footer">');
      w.document.write('<span>Valrisico Dashboard • Gemeente Oude IJsselstreek</span>');
      w.document.write('<span>Pagina 2 van 5</span>');
      w.document.write('</div></div>');
      
      // ==================== PAGINA 3: ANALYSE ====================
      w.document.write('<div class="page">');
      w.document.write('<div class="section"><div class="section-title"><span>🔬</span> Risicofactoren</div>');
      w.document.write('<p class="section-subtitle">De valrisicotest meet 8 risicofactoren. Onderstaande tabel toont hoe vaak elke factor voorkomt.</p>');
      w.document.write('<table>');
      w.document.write('<tr><th>Risicofactor</th><th style="width:15%">Prevalentie</th><th>Toelichting</th></tr>');
      RISICOFACTOREN.forEach(f => {
        const badgeClass = f.perc >= 50 ? 'badge-red' : f.perc >= 35 ? 'badge-orange' : 'badge-green';
        w.document.write('<tr><td><strong>' + f.label + '</strong></td><td><span class="badge ' + badgeClass + '">' + f.perc + '%</span></td><td style="font-size:9pt;color:#64748b">' + f.toelichting + '</td></tr>');
      });
      w.document.write('</table></div>');
      
      w.document.write('<div class="two-col">');
      w.document.write('<div class="section"><div class="section-title"><span>🛡️</span> Preventief gedrag</div>');
      w.document.write('<p class="section-subtitle">Percentage dat preventieve maatregelen toepast. Gap = kans voor interventie.</p>');
      w.document.write('<table>');
      w.document.write('<tr><th>Maatregel</th><th>Doet dit</th><th>Gap</th></tr>');
      laagstePreventie.forEach(p => {
        const gap = 100 - p.perc;
        const badgeClass = p.perc < 40 ? 'badge-red' : p.perc < 60 ? 'badge-orange' : 'badge-green';
        w.document.write('<tr><td>' + p.label + '</td><td><span class="badge ' + badgeClass + '">' + p.perc + '%</span></td><td style="color:#DC2626;font-weight:600">' + gap + '%</td></tr>');
      });
      w.document.write('</table></div>');
      
      w.document.write('<div class="section"><div class="section-title"><span>📍</span> Kernen met hoogste risico</div>');
      w.document.write('<p class="section-subtitle">Top 5 kernen gesorteerd op percentage hoog risico.</p>');
      w.document.write('<table>');
      w.document.write('<tr><th>Kern</th><th>Tests</th><th>Hoog risico</th></tr>');
      topKernen.forEach(k => {
        const perc = Math.round(k.hoog / k.tests * 100);
        w.document.write('<tr><td><strong>' + k.naam + '</strong></td><td>' + k.tests + '</td><td><span class="badge badge-red">' + perc + '%</span></td></tr>');
      });
      w.document.write('</table></div>');
      w.document.write('</div>');
      
      w.document.write('<div class="page-footer">');
      w.document.write('<span>Valrisico Dashboard • Gemeente Oude IJsselstreek</span>');
      w.document.write('<span>Pagina 3 van 5</span>');
      w.document.write('</div></div>');
      
      // ==================== PAGINA 4: DOELGROEPEN ====================
      w.document.write('<div class="page">');
      w.document.write('<div class="section"><div class="section-title"><span>👥</span> Demografische verdeling</div>');
      w.document.write('<p class="section-subtitle">Risicoverdeling per leeftijdsgroep en geslacht met visuele indicatoren.</p>');
      
      // Progress bar styling toevoegen
      w.document.write('<style>.progress-bar{display:flex;height:10px;border-radius:5px;overflow:hidden;background:#e2e8f0;margin:8px 0}');
      w.document.write('.progress-green{background:#15803D}.progress-orange{background:#D97706}.progress-red{background:#DC2626}');
      w.document.write('.demo-card{background:white;border-radius:10px;padding:15px;border:1px solid #e2e8f0;text-align:center}');
      w.document.write('.demo-card h4{margin:0 0 5px 0;font-size:12pt}.demo-value{font-size:24pt;font-weight:700;margin:5px 0}');
      w.document.write('.demo-label{font-size:8pt;color:#64748b;text-transform:uppercase}</style>');
      
      // Demografische kaarten
      w.document.write('<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px">');
      
      // Leeftijdsgroepen
      demografieData.perLeeftijd.forEach((g) => {
        const pHoog = g.tests > 0 ? Math.round(g.hoog / g.tests * 100) : 0;
        const pMatig = g.tests > 0 ? Math.round(g.matig / g.tests * 100) : 0;
        const pLaag = g.tests > 0 ? Math.round(g.laag / g.tests * 100) : 0;
        const color = g.groep === '85+' ? '#DC2626' : g.groep === '75-84' ? '#D97706' : '#15803D';
        const badgeClass = g.groep === '85+' ? 'badge-red' : g.groep === '75-84' ? 'badge-orange' : 'badge-green';
        
        w.document.write('<div class="demo-card" style="border-top:4px solid ' + color + '">');
        w.document.write('<h4>' + g.groep + ' jaar</h4>');
        w.document.write('<div class="demo-value" style="color:' + color + '">' + pHoog + '%</div>');
        w.document.write('<div class="demo-label">hoog risico</div>');
        w.document.write('<div class="progress-bar">');
        w.document.write('<div class="progress-green" style="width:' + pLaag + '%"></div>');
        w.document.write('<div class="progress-orange" style="width:' + pMatig + '%"></div>');
        w.document.write('<div class="progress-red" style="width:' + pHoog + '%"></div>');
        w.document.write('</div>');
        w.document.write('<div style="font-size:7pt;color:#94a3b8">' + g.tests + ' tests</div>');
        w.document.write('</div>');
      });
      
      // Geslacht
      demografieData.perGeslacht.forEach((g) => {
        const pHoog = g.tests > 0 ? Math.round(g.hoog / g.tests * 100) : 0;
        const pMatig = g.tests > 0 ? Math.round(g.matig / g.tests * 100) : 0;
        const pLaag = g.tests > 0 ? Math.round(g.laag / g.tests * 100) : 0;
        const icon = g.groep === 'Man' ? '👨' : '👩';
        
        w.document.write('<div class="demo-card" style="border-top:4px solid #0D6560">');
        w.document.write('<h4>' + icon + ' ' + g.groep + '</h4>');
        w.document.write('<div class="demo-value" style="color:#DC2626">' + pHoog + '%</div>');
        w.document.write('<div class="demo-label">hoog risico</div>');
        w.document.write('<div class="progress-bar">');
        w.document.write('<div class="progress-green" style="width:' + pLaag + '%"></div>');
        w.document.write('<div class="progress-orange" style="width:' + pMatig + '%"></div>');
        w.document.write('<div class="progress-red" style="width:' + pHoog + '%"></div>');
        w.document.write('</div>');
        w.document.write('<div style="font-size:7pt;color:#94a3b8">' + g.tests + ' tests</div>');
        w.document.write('</div>');
      });
      
      w.document.write('</div>');
      
      // Legenda
      w.document.write('<div style="display:flex;gap:20px;justify-content:center;font-size:8pt;color:#64748b;margin-bottom:20px">');
      w.document.write('<span><span style="display:inline-block;width:12px;height:12px;background:#15803D;border-radius:3px;margin-right:5px"></span>Laag risico</span>');
      w.document.write('<span><span style="display:inline-block;width:12px;height:12px;background:#D97706;border-radius:3px;margin-right:5px"></span>Matig risico</span>');
      w.document.write('<span><span style="display:inline-block;width:12px;height:12px;background:#DC2626;border-radius:3px;margin-right:5px"></span>Hoog risico</span>');
      w.document.write('</div></div>');
      
      w.document.write('<div class="section"><div class="section-title"><span>🎯</span> Aanpak per leeftijdsgroep</div>');
      w.document.write('<div class="three-col">');
      
      // 65-74
      w.document.write('<div class="doelgroep-card" style="border-top:4px solid #15803D">');
      w.document.write('<h4><span class="badge badge-green">65-74 jaar</span> Preventief</h4>');
      w.document.write('<p style="font-size:9pt;color:#64748b;margin-bottom:10px">Relatief laag risico. Focus op preventie en bewustwording.</p>');
      w.document.write('<ul><li>Beweeggroepen bij sportverenigingen</li><li>Informatiebijeenkomsten</li><li>Jaarlijkse valrisicotest</li></ul>');
      w.document.write('</div>');
      
      // 75-84
      w.document.write('<div class="doelgroep-card" style="border-top:4px solid #D97706">');
      w.document.write('<h4><span class="badge badge-orange">75-84 jaar</span> Aandacht</h4>');
      w.document.write('<p style="font-size:9pt;color:#64748b;margin-bottom:10px">Transitiefase met toenemend risico. Gerichte interventies.</p>');
      w.document.write('<ul><li>Groepscursussen valpreventie</li><li>Medicatiereview huisarts</li><li>Woningscan aanbieden</li></ul>');
      w.document.write('</div>');
      
      // 85+
      w.document.write('<div class="doelgroep-card" style="border-top:4px solid #DC2626">');
      w.document.write('<h4><span class="badge badge-red">85+ jaar</span> Prioriteit</h4>');
      w.document.write('<p style="font-size:9pt;color:#64748b;margin-bottom:10px">Hoogste risico én ernstigste gevolgen. Intensieve begeleiding.</p>');
      w.document.write('<ul><li>Proactieve huisbezoeken</li><li>Persoonlijke valpreventiecoach</li><li>Samenwerking thuiszorg</li></ul>');
      w.document.write('</div>');
      w.document.write('</div></div>');
      
      w.document.write('<div class="section"><div class="section-title"><span>📊</span> Doelgroepen per risiconiveau</div>');
      w.document.write('<table>');
      w.document.write('<tr><th>Doelgroep</th><th>Omvang</th><th>Aanbevolen aanpak</th><th>Prioriteit</th></tr>');
      w.document.write('<tr><td><strong>Hoog risico</strong></td><td>' + stats.hoog + ' personen</td><td>Doorverwijzing fysiotherapeut, multidisciplinair valteam</td><td><span class="badge badge-red">Hoog</span></td></tr>');
      w.document.write('<tr><td><strong>Recidiverende vallers</strong></td><td>±' + Math.round(stats.hoog * 0.67) + ' personen</td><td>Uitgebreid valonderzoek, medicatiereview, intensief programma</td><td><span class="badge badge-red">Hoog</span></td></tr>');
      w.document.write('<tr><td><strong>Matig risico</strong></td><td>' + stats.matig + ' personen</td><td>Groepscursussen, voorlichting, online woningscan</td><td><span class="badge badge-orange">Matig</span></td></tr>');
      w.document.write('<tr><td><strong>Laag risico</strong></td><td>' + stats.laag + ' personen</td><td>Preventieve voorlichting, stimuleren actief blijven</td><td><span class="badge badge-green">Laag</span></td></tr>');
      w.document.write('</table></div>');
      
      w.document.write('<div class="page-footer">');
      w.document.write('<span>Valrisico Dashboard • Gemeente Oude IJsselstreek</span>');
      w.document.write('<span>Pagina 4 van 5</span>');
      w.document.write('</div></div>');
      
      // ==================== PAGINA 5: AANBEVELINGEN ====================
      w.document.write('<div class="page">');
      w.document.write('<div class="section"><div class="section-title"><span>🎯</span> Top 3 Prioriteiten</div>');
      
      w.document.write('<div class="priority-box prio-1">');
      w.document.write('<div class="priority-number">1</div>');
      w.document.write('<h3>🏃 Beweegprogramma\'s opschalen</h3>');
      w.document.write('<div class="problem"><strong>Probleem:</strong> Slechts ' + preventiePerc + '% doet minimaal 2x per week evenwichtsoefeningen.</div>');
      w.document.write('<div class="actions"><strong>Aanbevolen acties:</strong>');
      w.document.write('<ul><li>Uitbreiden cursusaanbod "In Balans" en "Vallen Verleden Tijd"</li>');
      w.document.write('<li>Thuisoefenprogramma met instructievideo\'s</li>');
      w.document.write('<li>Samenwerking met lokale sportverenigingen</li></ul></div>');
      w.document.write('</div>');
      
      w.document.write('<div class="priority-box prio-2">');
      w.document.write('<div class="priority-number">2</div>');
      w.document.write('<h3>🏠 Woningaanpassingen stimuleren</h3>');
      w.document.write('<div class="problem"><strong>Probleem:</strong> ' + woningPerc + '% heeft nog geen woningaanpassingen doorgevoerd.</div>');
      w.document.write('<div class="actions"><strong>Aanbevolen acties:</strong>');
      w.document.write('<ul><li>Gratis woningscans aanbieden aan hoog-risico groep</li>');
      w.document.write('<li>Huisbezoeken voor 85+ en minder mobielen</li>');
      w.document.write('<li>Subsidieregeling via WMO promoten</li></ul></div>');
      w.document.write('</div>');
      
      w.document.write('<div class="priority-box prio-3">');
      w.document.write('<div class="priority-number">3</div>');
      w.document.write('<h3>🏥 Doorverwijzing verbeteren</h3>');
      w.document.write('<div class="problem"><strong>Probleem:</strong> Onvoldoende doorverwijzing van hoog-risico naar fysiotherapeut.</div>');
      w.document.write('<div class="actions"><strong>Aanbevolen acties:</strong>');
      w.document.write('<ul><li>Directe koppeling testuitslag met huisarts</li>');
      w.document.write('<li>Afspraken met fysiotherapiepraktijken over capaciteit</li>');
      w.document.write('<li>Terugkoppeling bij niet-aanmelding na 4 weken</li></ul></div>');
      w.document.write('</div></div>');
      
      w.document.write('<div class="two-col">');
      w.document.write('<div class="section"><div class="section-title"><span>📈</span> KPI\'s</div>');
      w.document.write('<table>');
      w.document.write('<tr><th>Indicator</th><th>Huidig</th><th>Doel</th></tr>');
      w.document.write('<tr><td>Percentage hoog risico</td><td>' + stats.pHoog + '%</td><td style="color:#15803D;font-weight:600">25%</td></tr>');
      w.document.write('<tr><td>Bereik valrisicotest</td><td>' + stats.bereik + '%</td><td style="color:#15803D;font-weight:600">40%</td></tr>');
      w.document.write('<tr><td>Doorverwijzing fysio</td><td>~35%</td><td style="color:#15803D;font-weight:600">60%</td></tr>');
      w.document.write('<tr><td>Woningscans per jaar</td><td>~80</td><td style="color:#15803D;font-weight:600">200</td></tr>');
      w.document.write('</table></div>');
      
      w.document.write('<div class="section"><div class="section-title"><span>📝</span> Vervolgstappen</div>');
      w.document.write('<ol style="margin-left:18px;font-size:10pt">');
      w.document.write('<li style="margin-bottom:8px">Presenteer bevindingen aan stakeholders (welzijn, zorg, WMO)</li>');
      w.document.write('<li style="margin-bottom:8px">Stel werkgroep valpreventie samen</li>');
      w.document.write('<li style="margin-bottom:8px">Ontwikkel communicatiecampagne gericht op 65-plussers</li>');
      w.document.write('<li style="margin-bottom:8px">Start pilot in kernen met hoogste risico</li>');
      w.document.write('<li style="margin-bottom:8px">Plan evaluatiemoment over 12 maanden</li>');
      w.document.write('</ol></div>');
      w.document.write('</div>');
      
      w.document.write('<div class="card card-teal" style="margin-top:15px">');
      w.document.write('<h3>📞 Contact & meer informatie</h3>');
      w.document.write('<p>Dit rapport is gegenereerd met het Valrisico Dashboard. Voor vragen of meer informatie over valpreventie in uw gemeente, ');
      w.document.write('neem contact op met de afdeling WMO of bekijk de website van VeiligheidNL voor landelijke richtlijnen.</p>');
      w.document.write('</div>');
      
      w.document.write('<div class="page-footer">');
      w.document.write('<span>Valrisico Dashboard • Gemeente Oude IJsselstreek</span>');
      w.document.write('<span>Pagina 5 van 5</span>');
      w.document.write('</div></div>');
      
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
      <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: KLEUREN.wit, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {/* HEADER */}
        <header style={{ borderBottom: `1px solid ${KLEUREN.rand}`, padding: '10px 16px' }}>
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
                📄 PDF Rapport
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
              { id: 'overzicht', label: 'Overzicht', icon: '🏠' },
              { id: 'risico', label: 'Risicofactoren', icon: '📊' },
              { id: 'actie', label: 'Aanbevelingen', icon: '✅' },
              { id: 'preventie', label: 'Preventie', icon: '🛡️' },
              { id: 'demografie', label: 'Demografie', icon: '👤' },
              { id: 'kaart', label: 'Geografisch', icon: '📍' },
              { id: 'fysio', label: 'Doorverwijzingen', icon: '🏃' },
            ].map(t => (
              <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>{t.icon} {t.label}</TabButton>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <StatCard label="Inwoners 65+" value={stats.inw65plus.toLocaleString()} sub="In geselecteerde wijk(en)" icon="👤" />
              <StatCard label="Tests afgenomen" value={stats.tests.toLocaleString()} sub={`${stats.bereik}% bereik`} icon="📋" />
              <StatCard label="Laag risico" value={stats.pLaag} unit="%" sub={`${stats.laag} personen`} color={KLEUREN.laag} icon="✓" />
              <StatCard label="Matig risico" value={stats.pMatig} unit="%" sub={`${stats.matig} personen`} color={KLEUREN.matig} icon="●" />
              <StatCard label="Hoog risico" value={stats.pHoog} unit="%" sub={`${stats.hoog} personen`} color={KLEUREN.hoog} icon="!" />
              <StatCard label="Verhoogd risico" value={stats.matig + stats.hoog} sub="Matig + Hoog" color={KLEUREN.primair} icon="▲" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <Card>
                <CardTitle sub="Gefilterde selectie">Verdeling risiconiveau</CardTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart 
                    data={[
                      { niveau: 'Laag', aantal: stats.laag, percentage: stats.pLaag },
                      { niveau: 'Matig', aantal: stats.matig, percentage: stats.pMatig },
                      { niveau: 'Hoog', aantal: stats.hoog, percentage: stats.pHoog },
                    ]} 
                    layout="vertical" 
                    barCategoryGap="25%"
                    margin={{ top: 5, right: 60, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={KLEUREN.rand} horizontal={false} />
                    <XAxis type="number" domain={[0, 'auto']} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="niveau" width={45} tick={{ fontSize: 12, fontWeight: 500 }} />
                    <Tooltip 
                      formatter={(value, name, props) => [`${value} personen (${props.payload.percentage}%)`, 'Aantal']}
                    />
                    <Bar 
                      dataKey="aantal" 
                      radius={[0, 6, 6, 0]}
                      label={{ position: 'right', fontSize: 12, fontWeight: 600, fill: KLEUREN.tekst }}
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
              <strong>Preventief gedrag:</strong> De valrisicotest meet 6 vormen van preventief gedrag die bewezen effectief zijn om vallen te voorkomen. 
              Hoe hoger het percentage, hoe meer mensen deze maatregel al toepassen. De <strong style={{ color: KLEUREN.hoog }}>gap</strong> toont 
              hoeveel procent dit nog <em>niet</em> doet — daar ligt de kans voor interventie.
            </InfoPanel>

            {/* Grafiek - hoogste percentage bovenaan */}
            <Card>
              <CardTitle sub="Gesorteerd van hoog naar laag — onderaan liggen de grootste kansen">Huidige stand preventief gedrag</CardTitle>
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={[...PREVENTIE].sort((a, b) => b.perc - a.perc)} 
                    layout="vertical" 
                    margin={{ left: 10, right: 55, top: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={KLEUREN.rand} vertical={true} horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="label" width={170} tick={{ fontSize: 11 }} />
                    <Tooltip 
                      formatter={(v) => [`${v}% past dit toe`, 'Toepassing']}
                      labelFormatter={(label) => label}
                    />
                    <Bar 
                      dataKey="perc" 
                      name="Past dit toe" 
                      radius={[0, 4, 4, 0]}
                      label={{ position: 'right', fontSize: 11, fontWeight: 600, fill: KLEUREN.tekst, formatter: (v) => `${v}%` }}
                    >
                      {[...PREVENTIE].sort((a, b) => b.perc - a.perc).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.perc >= 60 ? KLEUREN.laag : entry.perc >= 40 ? KLEUREN.matig : KLEUREN.hoog} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: KLEUREN.laag }} />
                  <span style={{ color: KLEUREN.tekst }}>≥60% - Op schema</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: KLEUREN.matig }} />
                  <span style={{ color: KLEUREN.tekst }}>40-59% - Aandacht nodig</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: KLEUREN.hoog }} />
                  <span style={{ color: KLEUREN.tekst }}>&lt;40% - Prioriteit</span>
                </div>
              </div>
            </Card>

            {/* Gedetailleerde preventie-acties in stijl van aanbevelingen */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              {[...PREVENTIE].sort((a, b) => a.perc - b.perc).map((p, i) => {
                const gap = 100 - p.perc;
                const isKritiek = p.perc < 40;
                const isAandacht = p.perc >= 40 && p.perc < 60;
                const prioriteit = isKritiek ? 1 : isAandacht ? 2 : 3;
                
                // Uitgebreide info per maatregel
                const details = {
                  1: { // Evenwichtsoefeningen
                    icon: '🏃',
                    probleem: `Slechts ${p.perc}% van de geteste ouderen doet minimaal 2x per week evenwichtsoefeningen.`,
                    onderbouwing: 'Balans- en krachttraining vermindert het valrisico met 30-40%. Dit is de meest effectieve interventie volgens wetenschappelijk onderzoek.',
                    acties: ['Cursussen "In Balans" en "Vallen Verleden Tijd" promoten', 'Thuisoefenprogramma met instructievideo\'s', 'Beweeggroepen bij buurthuizen en sportverenigingen']
                  },
                  2: { // Huisaanpassingen
                    icon: '🏠',
                    probleem: `${gap}% heeft nog geen woningaanpassingen gedaan om valrisico te verminderen.`,
                    onderbouwing: 'Woningaanpassingen zoals antislipmatten, betere verlichting en handgrepen kunnen tot 20% van de thuisvallen voorkomen.',
                    acties: ['Woningscan door gecertificeerde aanbieder', 'Subsidieregeling kleine aanpassingen via WMO', 'Voorlichtingsbijeenkomsten per kern']
                  },
                  3: { // Medicijncontrole
                    icon: '💊',
                    probleem: `${gap}% laat medicijnen niet jaarlijks controleren op bijwerkingen die vallen kunnen veroorzaken.`,
                    onderbouwing: 'Bepaalde medicijnen (slaap-, kalmeringsmiddelen, bloeddrukverlagend) verhogen valrisico. Regelmatige review kan dit risico verlagen.',
                    acties: ['Huisartsen en apothekers actief betrekken', 'Medicatiereview bij polyfarmacie (5+ medicijnen)', 'Patiënten informeren over bijwerkingen']
                  },
                  4: { // Eiwitten
                    icon: '🥛',
                    probleem: `${gap}% eet niet dagelijks voldoende eiwitten voor behoud van spiermassa.`,
                    onderbouwing: 'Eiwitten zijn essentieel voor spierbehoud. Na 70 jaar is extra eiwit nodig om sarcopenie (spierafbraak) tegen te gaan.',
                    acties: ['Voedingsadvies via diëtist of POH', 'Informatiefolders over eiwitrijke voeding', 'Kookworkshops voor ouderen']
                  },
                  5: { // Oogcontrole
                    icon: '👁️',
                    probleem: `${gap}% laat de ogen niet jaarlijks controleren bij opticien of oogarts.`,
                    onderbouwing: 'Goed zicht helpt om obstakels en oneffenheden tijdig te zien. Veel ouderen hebben een niet-gecorrigeerde visusprobleem.',
                    acties: ['Samenwerking met lokale opticiens', 'Oogscreening bij gezondheidsmarkten', 'Herinneringsbrief voor jaarlijkse controle']
                  },
                  6: { // Schoenen
                    icon: '👟',
                    probleem: `${gap}% draagt geen stevige, goed passende schoenen.`,
                    onderbouwing: 'Goede schoenen geven stabiliteit en verminderen uitglijden. Sloffen en gladde zolen verhogen valrisico aanzienlijk.',
                    acties: ['Voorlichting over schoenenkeuze', 'Podotherapeut inschakelen bij voetproblemen', 'Advies over antislip-sloffen']
                  }
                }[p.id] || { icon: '📋', probleem: p.advies, onderbouwing: '', acties: [] };
                
                return (
                  <Card key={p.id} highlight={isKritiek}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                      <div style={{ 
                        width: '48px', height: '48px', borderRadius: '12px',
                        backgroundColor: isKritiek ? KLEUREN.hoogLicht : isAandacht ? KLEUREN.matigLicht : KLEUREN.laagLicht,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px', flexShrink: 0
                      }}>
                        {details.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ 
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '22px', height: '22px', borderRadius: '50%', 
                            backgroundColor: isKritiek ? KLEUREN.hoog : isAandacht ? KLEUREN.matig : KLEUREN.laag, 
                            color: KLEUREN.wit,
                            fontSize: '12px', fontWeight: 700
                          }}>{i + 1}</span>
                          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: KLEUREN.tekst }}>{p.label}</h3>
                        </div>
                        {isKritiek && <Badge color={KLEUREN.hoog}>PRIORITEIT</Badge>}
                        {isAandacht && <Badge color={KLEUREN.matig}>AANDACHT</Badge>}
                        {!isKritiek && !isAandacht && <Badge color={KLEUREN.laag}>OP SCHEMA</Badge>}
                      </div>
                    </div>
                    
                    {/* Statistieken */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                      <div style={{ padding: '12px', backgroundColor: KLEUREN.achtergrond, borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: isKritiek ? KLEUREN.hoog : isAandacht ? KLEUREN.matig : KLEUREN.laag }}>{p.perc}%</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: KLEUREN.tekstSub }}>past dit toe</p>
                      </div>
                      <div style={{ padding: '12px', backgroundColor: KLEUREN.achtergrond, borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: KLEUREN.hoog }}>{gap}%</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: KLEUREN.tekstSub }}>GAP (doet dit niet)</p>
                      </div>
                    </div>
                    
                    {/* Probleem */}
                    <div style={{ marginBottom: '14px', padding: '12px', backgroundColor: KLEUREN.hoogLicht, borderRadius: '8px', borderLeft: `3px solid ${KLEUREN.hoog}` }}>
                      <p style={{ margin: 0, fontSize: '13px', color: KLEUREN.tekst, lineHeight: 1.5 }}>
                        <strong>Situatie:</strong> {details.probleem}
                      </p>
                    </div>
                    
                    {/* Onderbouwing */}
                    <div style={{ marginBottom: '14px', padding: '12px', backgroundColor: KLEUREN.primairLicht, borderRadius: '8px', borderLeft: `3px solid ${KLEUREN.primair}` }}>
                      <p style={{ margin: 0, fontSize: '13px', color: KLEUREN.tekst, lineHeight: 1.5 }}>
                        <strong>Waarom belangrijk:</strong> {details.onderbouwing}
                      </p>
                    </div>
                    
                    {/* Acties */}
                    {details.acties.length > 0 && (
                      <div>
                        <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Mogelijke acties</p>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: KLEUREN.tekst, lineHeight: 1.7 }}>
                          {details.acties.map((a, j) => <li key={j}>{a}</li>)}
                        </ul>
                      </div>
                    )}
                    
                    {/* Hoog risico indicator */}
                    <div style={{ marginTop: '14px', padding: '10px 12px', backgroundColor: KLEUREN.achtergrond, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: KLEUREN.tekstSub }}>Bij hoog-risico groep:</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: KLEUREN.primair }}>{p.hoogRisico}% doet dit</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* === DEMOGRAFIE === */}
        {tab === 'demografie' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <InfoPanel type="info">
              <strong>Demografische analyse:</strong> Inzicht in valrisico per leeftijdsgroep en geslacht. 
              Per doelgroep worden specifieke aandachtsgebieden en aanbevelingen gegeven voor gerichte interventies.
            </InfoPanel>

            {/* Samenvatting KPI's */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {demografieData.perLeeftijd.map((g, i) => {
                const pHoog = g.tests > 0 ? Math.round(g.hoog / g.tests * 100) : 0;
                const color = g.groep === '85+' ? KLEUREN.hoog : g.groep === '75-84' ? KLEUREN.matig : KLEUREN.laag;
                const bgColor = g.groep === '85+' ? KLEUREN.hoogLicht : g.groep === '75-84' ? KLEUREN.matigLicht : KLEUREN.laagLicht;
                return (
                  <Card key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: KLEUREN.tekst }}>{g.groep} jaar</span>
                      <Badge color={color}>{g.tests} tests</Badge>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: color, marginBottom: '8px' }}>{pHoog}%</div>
                    <div style={{ fontSize: '12px', color: KLEUREN.tekstSub, marginBottom: '12px' }}>hoog risico</div>
                    {/* Progress bar */}
                    <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', backgroundColor: KLEUREN.rand }}>
                      <div style={{ width: `${g.tests > 0 ? Math.round(g.laag / g.tests * 100) : 0}%`, backgroundColor: KLEUREN.laag }} />
                      <div style={{ width: `${g.tests > 0 ? Math.round(g.matig / g.tests * 100) : 0}%`, backgroundColor: KLEUREN.matig }} />
                      <div style={{ width: `${g.tests > 0 ? Math.round(g.hoog / g.tests * 100) : 0}%`, backgroundColor: KLEUREN.hoog }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: KLEUREN.tekstSub }}>
                      <span>{g.tests > 0 ? Math.round(g.laag / g.tests * 100) : 0}% laag</span>
                      <span>{g.tests > 0 ? Math.round(g.matig / g.tests * 100) : 0}% matig</span>
                      <span>{pHoog}% hoog</span>
                    </div>
                  </Card>
                );
              })}
              {demografieData.perGeslacht.map((g, i) => {
                const pHoog = g.tests > 0 ? Math.round(g.hoog / g.tests * 100) : 0;
                const icon = g.groep === 'Man' ? '👨' : '👩';
                return (
                  <Card key={`g${i}`}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: KLEUREN.tekst }}>{icon} {g.groep}</span>
                      <Badge color={KLEUREN.primair}>{g.tests} tests</Badge>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: KLEUREN.hoog, marginBottom: '8px' }}>{pHoog}%</div>
                    <div style={{ fontSize: '12px', color: KLEUREN.tekstSub, marginBottom: '12px' }}>hoog risico</div>
                    {/* Progress bar */}
                    <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', backgroundColor: KLEUREN.rand }}>
                      <div style={{ width: `${g.tests > 0 ? Math.round(g.laag / g.tests * 100) : 0}%`, backgroundColor: KLEUREN.laag }} />
                      <div style={{ width: `${g.tests > 0 ? Math.round(g.matig / g.tests * 100) : 0}%`, backgroundColor: KLEUREN.matig }} />
                      <div style={{ width: `${g.tests > 0 ? Math.round(g.hoog / g.tests * 100) : 0}%`, backgroundColor: KLEUREN.hoog }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: KLEUREN.tekstSub }}>
                      <span>{g.tests > 0 ? Math.round(g.laag / g.tests * 100) : 0}% laag</span>
                      <span>{g.tests > 0 ? Math.round(g.matig / g.tests * 100) : 0}% matig</span>
                      <span>{pHoog}% hoog</span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Vergelijkingstabel */}
            <Card>
              <CardTitle sub="Risicoverdeling in percentages per groep">Overzicht alle groepen</CardTitle>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${KLEUREN.rand}` }}>
                      <th style={{ textAlign: 'left', padding: '12px', fontWeight: 600, color: KLEUREN.tekstSub }}>Groep</th>
                      <th style={{ textAlign: 'center', padding: '12px', fontWeight: 600, color: KLEUREN.tekstSub }}>Tests</th>
                      <th style={{ textAlign: 'center', padding: '12px', fontWeight: 600, color: KLEUREN.laag }}>Laag risico</th>
                      <th style={{ textAlign: 'center', padding: '12px', fontWeight: 600, color: KLEUREN.matig }}>Matig risico</th>
                      <th style={{ textAlign: 'center', padding: '12px', fontWeight: 600, color: KLEUREN.hoog }}>Hoog risico</th>
                      <th style={{ textAlign: 'left', padding: '12px', fontWeight: 600, color: KLEUREN.tekstSub, minWidth: '200px' }}>Verdeling</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...demografieData.perLeeftijd, ...demografieData.perGeslacht].map((g, i) => {
                      const pLaag = g.tests > 0 ? Math.round(g.laag / g.tests * 100) : 0;
                      const pMatig = g.tests > 0 ? Math.round(g.matig / g.tests * 100) : 0;
                      const pHoog = g.tests > 0 ? Math.round(g.hoog / g.tests * 100) : 0;
                      const icon = g.groep === 'Man' ? '👨 ' : g.groep === 'Vrouw' ? '👩 ' : '';
                      return (
                        <tr key={i} style={{ borderBottom: `1px solid ${KLEUREN.rand}` }}>
                          <td style={{ padding: '12px', fontWeight: 500 }}>{icon}{g.groep}{g.groep.includes('-') || g.groep.includes('+') ? ' jaar' : ''}</td>
                          <td style={{ textAlign: 'center', padding: '12px', color: KLEUREN.tekstSub }}>{g.tests.toLocaleString()}</td>
                          <td style={{ textAlign: 'center', padding: '12px' }}>
                            <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '6px', backgroundColor: KLEUREN.laagLicht, color: KLEUREN.laag, fontWeight: 600 }}>{pLaag}%</span>
                          </td>
                          <td style={{ textAlign: 'center', padding: '12px' }}>
                            <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '6px', backgroundColor: KLEUREN.matigLicht, color: KLEUREN.matig, fontWeight: 600 }}>{pMatig}%</span>
                          </td>
                          <td style={{ textAlign: 'center', padding: '12px' }}>
                            <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '6px', backgroundColor: KLEUREN.hoogLicht, color: KLEUREN.hoog, fontWeight: 600 }}>{pHoog}%</span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', backgroundColor: KLEUREN.rand }}>
                              <div style={{ width: `${pLaag}%`, backgroundColor: KLEUREN.laag }} />
                              <div style={{ width: `${pMatig}%`, backgroundColor: KLEUREN.matig }} />
                              <div style={{ width: `${pHoog}%`, backgroundColor: KLEUREN.hoog }} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', gap: '20px', marginTop: '16px', justifyContent: 'center', fontSize: '11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '4px', backgroundColor: KLEUREN.laag }}></span>
                  <span style={{ color: KLEUREN.tekstSub }}>Laag risico</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '4px', backgroundColor: KLEUREN.matig }}></span>
                  <span style={{ color: KLEUREN.tekstSub }}>Matig risico</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '4px', backgroundColor: KLEUREN.hoog }}></span>
                  <span style={{ color: KLEUREN.tekstSub }}>Hoog risico</span>
                </div>
              </div>
            </Card>

            {/* Analyse per leeftijdsgroep */}
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: KLEUREN.tekst, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>👥</span> Analyse per leeftijdsgroep
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                {demografieData.perLeeftijd.map((g, i) => {
                  const pHoog = g.tests > 0 ? Math.round(g.hoog / g.tests * 100) : 0;
                  const pMatig = g.tests > 0 ? Math.round(g.matig / g.tests * 100) : 0;
                  const pLaag = g.tests > 0 ? Math.round(g.laag / g.tests * 100) : 0;
                  const isHoogsteRisico = g.groep === '85+';
                  
                  // Specifieke aandachtsgebieden per leeftijdsgroep
                  const aandachtData = {
                    '65-74': {
                      icon: '🚶',
                      status: 'preventief',
                      color: KLEUREN.laag,
                      kernprobleem: 'Deze groep heeft relatief laag risico maar vormt de grootste groep. Preventie voorkomt doorgroei naar hoger risico.',
                      aandachtsgebieden: [
                        { titel: 'Actief blijven', beschrijving: 'Stimuleer deelname aan sport en beweegactiviteiten' },
                        { titel: 'Bewustwording', beschrijving: 'Voorlichting over valrisico en preventie' },
                        { titel: 'Vroege signalering', beschrijving: 'Jaarlijkse valrisicotest om veranderingen te monitoren' },
                      ],
                      acties: ['Beweeggroepen bij sportverenigingen', 'Informatiebijeenkomsten per kern', 'Online zelftest promoten']
                    },
                    '75-84': {
                      icon: '🧓',
                      status: 'aandacht',
                      color: KLEUREN.matig,
                      kernprobleem: 'Transitiefase met toenemend risico. Veel winst te behalen door gerichte interventies voordat risico verder stijgt.',
                      aandachtsgebieden: [
                        { titel: 'Medicatiereview', beschrijving: 'Polyfarmacie neemt toe, check op bijwerkingen' },
                        { titel: 'Woningaanpassingen', beschrijving: 'Proactief adviseren over aanpassingen' },
                        { titel: 'Balans en kracht', beschrijving: 'Gestructureerde oefenprogramma\'s aanbieden' },
                      ],
                      acties: ['Groepscursussen valpreventie', 'Samenwerking met huisartsen voor medicatiereview', 'Woningscan aanbieden']
                    },
                    '85+': {
                      icon: '👴',
                      status: 'prioriteit',
                      color: KLEUREN.hoog,
                      kernprobleem: 'Hoogste risico op vallen én ernstigste gevolgen. Vraagt om intensieve, persoonlijke begeleiding.',
                      aandachtsgebieden: [
                        { titel: 'Multidisciplinair', beschrijving: 'Samenwerking huisarts, fysio, wijkverpleging' },
                        { titel: 'Thuissituatie', beschrijving: 'Huisbezoek voor woningaanpassingen' },
                        { titel: 'Mantelzorg', beschrijving: 'Betrek en ondersteun mantelzorgers actief' },
                      ],
                      acties: ['Proactieve huisbezoeken', 'Persoonlijke valpreventiecoach', 'Nauwe samenwerking met thuiszorg']
                    }
                  };
                  
                  const aandacht = aandachtData[g.groep] || aandachtData['65-74'];
                  
                  return (
                    <Card key={i} highlight={isHoogsteRisico}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                        <div style={{ 
                          width: '48px', height: '48px', borderRadius: '12px',
                          backgroundColor: aandacht.status === 'prioriteit' ? KLEUREN.hoogLicht : aandacht.status === 'aandacht' ? KLEUREN.matigLicht : KLEUREN.laagLicht,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '24px', flexShrink: 0
                        }}>
                          {aandacht.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: KLEUREN.tekst }}>{g.groep} jaar</h3>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', color: KLEUREN.tekstSub }}>{g.tests} tests</span>
                            {aandacht.status === 'prioriteit' && <Badge color={KLEUREN.hoog}>PRIORITEIT</Badge>}
                            {aandacht.status === 'aandacht' && <Badge color={KLEUREN.matig}>AANDACHT</Badge>}
                            {aandacht.status === 'preventief' && <Badge color={KLEUREN.laag}>PREVENTIEF</Badge>}
                          </div>
                        </div>
                      </div>
                      
                      {/* Risicoverdeling */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', backgroundColor: KLEUREN.laagLicht, borderRadius: '8px', textAlign: 'center' }}>
                          <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: KLEUREN.laag }}>{pLaag}%</p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: KLEUREN.tekstSub }}>Laag risico</p>
                        </div>
                        <div style={{ padding: '10px', backgroundColor: KLEUREN.matigLicht, borderRadius: '8px', textAlign: 'center' }}>
                          <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: KLEUREN.matig }}>{pMatig}%</p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: KLEUREN.tekstSub }}>Matig risico</p>
                        </div>
                        <div style={{ padding: '10px', backgroundColor: KLEUREN.hoogLicht, borderRadius: '8px', textAlign: 'center' }}>
                          <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: KLEUREN.hoog }}>{pHoog}%</p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: KLEUREN.tekstSub }}>Hoog risico</p>
                        </div>
                      </div>
                      
                      {/* Kernprobleem */}
                      <div style={{ marginBottom: '14px', padding: '12px', backgroundColor: aandacht.color === KLEUREN.hoog ? KLEUREN.hoogLicht : aandacht.color === KLEUREN.matig ? KLEUREN.matigLicht : KLEUREN.laagLicht, borderRadius: '8px', borderLeft: `3px solid ${aandacht.color}` }}>
                        <p style={{ margin: 0, fontSize: '13px', color: KLEUREN.tekst, lineHeight: 1.5 }}>
                          <strong>Analyse:</strong> {aandacht.kernprobleem}
                        </p>
                      </div>
                      
                      {/* Aandachtsgebieden */}
                      <div style={{ marginBottom: '14px' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Aandachtsgebieden</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {aandacht.aandachtsgebieden.map((a, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px', backgroundColor: KLEUREN.achtergrond, borderRadius: '6px' }}>
                              <span style={{ 
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '20px', height: '20px', borderRadius: '50%', 
                                backgroundColor: KLEUREN.primair, color: KLEUREN.wit,
                                fontSize: '11px', fontWeight: 700, flexShrink: 0
                              }}>{j + 1}</span>
                              <div>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: KLEUREN.tekst }}>{a.titel}</p>
                                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: KLEUREN.tekstSub }}>{a.beschrijving}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Acties */}
                      <div>
                        <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Aanbevolen acties</p>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: KLEUREN.tekst, lineHeight: 1.7 }}>
                          {aandacht.acties.map((a, j) => <li key={j}>{a}</li>)}
                        </ul>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Analyse per geslacht */}
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: KLEUREN.tekst, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>⚧</span> Analyse per geslacht
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                {demografieData.perGeslacht.map((g, i) => {
                  const pHoog = g.tests > 0 ? Math.round(g.hoog / g.tests * 100) : 0;
                  const pMatig = g.tests > 0 ? Math.round(g.matig / g.tests * 100) : 0;
                  const pLaag = g.tests > 0 ? Math.round(g.laag / g.tests * 100) : 0;
                  const isMan = g.groep === 'Man';
                  
                  // Specifieke aandachtsgebieden per geslacht
                  const aandacht = isMan ? {
                    icon: '👨',
                    color: KLEUREN.wijk2,
                    kernprobleem: 'Mannen hebben vaak minder sociale contacten en zijn terughoudender in hulp vragen. Ze onderschatten hun valrisico vaker.',
                    aandachtsgebieden: [
                      { titel: 'Risicobesef', beschrijving: 'Mannen onderschatten risico\'s vaker - gerichte voorlichting nodig' },
                      { titel: 'Hulp accepteren', beschrijving: 'Drempel verlagen voor hulpmiddelen en aanpassingen' },
                      { titel: 'Sociale activering', beschrijving: 'Via sport en hobby\'s bereiken' },
                    ],
                    acties: ['Voorlichting via huisarts en sportverenigingen', 'Mannelijke ambassadeurs inzetten', 'Praktische insteek bij communicatie']
                  } : {
                    icon: '👩',
                    color: KLEUREN.wijk3,
                    kernprobleem: 'Vrouwen hebben vaker osteoporose en daardoor ernstiger gevolgen bij een val. Ze vormen ook de meerderheid van de 85+ groep.',
                    aandachtsgebieden: [
                      { titel: 'Botgezondheid', beschrijving: 'Extra aandacht voor osteoporose en calciumopname' },
                      { titel: 'Valangst', beschrijving: 'Vrouwen hebben vaker valangst - kan leiden tot vermijdingsgedrag' },
                      { titel: 'Mantelzorg', beschrijving: 'Vaak zelf mantelzorger - vergeet eigen gezondheid' },
                    ],
                    acties: ['Botdichtheidsscreening promoten', 'Cursussen gericht op valangst', 'Aandacht voor eigen gezondheid mantelzorgers']
                  };
                  
                  return (
                    <Card key={i}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                        <div style={{ 
                          width: '56px', height: '56px', borderRadius: '12px',
                          backgroundColor: `${aandacht.color}15`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '32px', flexShrink: 0
                        }}>
                          {aandacht.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: KLEUREN.tekst }}>{g.groep}</h3>
                          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: KLEUREN.tekstSub }}>{g.tests} tests ({g.tests > 0 ? Math.round(g.tests / stats.tests * 100) : 0}% van totaal)</p>
                        </div>
                      </div>
                      
                      {/* Risicoverdeling */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ padding: '12px', backgroundColor: KLEUREN.laagLicht, borderRadius: '8px', textAlign: 'center' }}>
                          <p style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: KLEUREN.laag }}>{pLaag}%</p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: KLEUREN.tekstSub }}>Laag risico</p>
                        </div>
                        <div style={{ padding: '12px', backgroundColor: KLEUREN.matigLicht, borderRadius: '8px', textAlign: 'center' }}>
                          <p style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: KLEUREN.matig }}>{pMatig}%</p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: KLEUREN.tekstSub }}>Matig risico</p>
                        </div>
                        <div style={{ padding: '12px', backgroundColor: KLEUREN.hoogLicht, borderRadius: '8px', textAlign: 'center' }}>
                          <p style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: KLEUREN.hoog }}>{pHoog}%</p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: KLEUREN.tekstSub }}>Hoog risico</p>
                        </div>
                      </div>
                      
                      {/* Kernprobleem */}
                      <div style={{ marginBottom: '14px', padding: '12px', backgroundColor: KLEUREN.primairLicht, borderRadius: '8px', borderLeft: `3px solid ${aandacht.color}` }}>
                        <p style={{ margin: 0, fontSize: '13px', color: KLEUREN.tekst, lineHeight: 1.5 }}>
                          <strong>Specifieke context:</strong> {aandacht.kernprobleem}
                        </p>
                      </div>
                      
                      {/* Aandachtsgebieden */}
                      <div style={{ marginBottom: '14px' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Aandachtsgebieden</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {aandacht.aandachtsgebieden.map((a, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px', backgroundColor: KLEUREN.achtergrond, borderRadius: '6px' }}>
                              <span style={{ 
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '20px', height: '20px', borderRadius: '50%', 
                                backgroundColor: aandacht.color, color: KLEUREN.wit,
                                fontSize: '11px', fontWeight: 700, flexShrink: 0
                              }}>{j + 1}</span>
                              <div>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: KLEUREN.tekst }}>{a.titel}</p>
                                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: KLEUREN.tekstSub }}>{a.beschrijving}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Acties */}
                      <div>
                        <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Aanbevolen acties</p>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: KLEUREN.tekst, lineHeight: 1.7 }}>
                          {aandacht.acties.map((a, j) => <li key={j}>{a}</li>)}
                        </ul>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
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
              <strong>Van data naar actie:</strong> Op basis van de valrisicotest-resultaten zijn onderstaande aanbevelingen opgesteld, 
              geprioriteerd op verwachte impact en haalbaarheid. De onderbouwing is gebaseerd op landelijke richtlijnen van VeiligheidNL 
              en de specifieke data uit Oude IJsselstreek.
            </InfoPanel>

            {/* Top 3 Prioriteiten */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              {[
                { 
                  titel: 'Beweegprogramma\'s opschalen', 
                  icon: '🏃', 
                  prio: 1,
                  probleem: `Slechts ${PREVENTIE.find(p => p.id === 1)?.perc || 32}% van de 65-plussers doet minimaal 2x per week evenwichtsoefeningen.`,
                  onderbouwing: 'Onderzoek toont aan dat gerichte balans- en krachttraining het valrisico met 30-40% kan verlagen. Dit is de meest effectieve interventie.',
                  acties: [
                    'Uitbreiden cursusaanbod "In Balans" en "Vallen Verleden Tijd"',
                    'Thuisoefenprogramma met instructievideo\'s voor minder mobielen',
                    'Beweegtuinen in kernen met hoog risico',
                    'Samenwerking met lokale sportverenigingen'
                  ],
                  kpi: 'Doel: 50% van hoog-risico groep neemt deel aan beweegprogramma',
                  verantwoordelijk: 'GGD / Welzijnsorganisatie / Fysiotherapeuten'
                },
                { 
                  titel: 'Woningaanpassingen stimuleren', 
                  icon: '🏠', 
                  prio: 2,
                  probleem: `${100 - (PREVENTIE.find(p => p.id === 2)?.perc || 44)}% heeft nog geen woningaanpassingen doorgevoerd om valrisico te verminderen.`,
                  onderbouwing: 'Woningaanpassingen zoals antislipmatten, betere verlichting en handgrepen kunnen tot 20% van de thuisvallen voorkomen.',
                  acties: [
                    'Gratis woningscans aanbieden aan hoog-risico groep',
                    'Huisbezoeken voor 85+ en minder mobielen',
                    'Informatiebijeenkomsten over woningaanpassingen per kern',
                    'Subsidieregeling voor kleine aanpassingen via WMO'
                  ],
                  kpi: 'Doel: 200 woningscans per jaar, 80% voert minimaal 1 aanpassing door',
                  verantwoordelijk: 'Gemeente WMO / Woningcorporaties / Thuiszorg'
                },
                { 
                  titel: 'Doorverwijzing naar fysiotherapie', 
                  icon: '🩺', 
                  prio: 3,
                  probleem: `Van de ${stats.hoog} personen met hoog valrisico is het aanmeldingspercentage bij fysiotherapie nog onvoldoende.`,
                  onderbouwing: 'Professionele valpreventietraining onder begeleiding van een fysiotherapeut is effectiever dan zelfstandig oefenen, vooral bij hoog risico.',
                  acties: [
                    'Directe koppeling testuitslag met huisarts voor doorverwijzing',
                    'Afspraken met fysiotherapiepraktijken over capaciteit valpreventie',
                    'Informatiebrief naar hoog-risico met concrete vervolgstappen',
                    'Terugkoppeling naar huisarts bij niet-aanmelding na 4 weken'
                  ],
                  kpi: 'Doel: 60% van hoog-risico groep meldt zich aan bij fysiotherapeut',
                  verantwoordelijk: 'Huisartsen / Fysiotherapeuten / POH'
                },
              ].map((item, i) => (
                <Card key={i} highlight={i === 0}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                    <div style={{ 
                      width: '48px', height: '48px', borderRadius: '12px',
                      backgroundColor: i === 0 ? KLEUREN.hoogLicht : i === 1 ? KLEUREN.matigLicht : KLEUREN.primairLicht,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px', flexShrink: 0
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: '22px', height: '22px', borderRadius: '50%', 
                          backgroundColor: KLEUREN.primair, color: KLEUREN.wit,
                          fontSize: '12px', fontWeight: 700
                        }}>{item.prio}</span>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: KLEUREN.tekst }}>{item.titel}</h3>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: KLEUREN.tekstSub }}>
                        {item.verantwoordelijk}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: KLEUREN.hoogLicht, borderRadius: '8px', borderLeft: `3px solid ${KLEUREN.hoog}` }}>
                    <p style={{ margin: 0, fontSize: '13px', color: KLEUREN.tekst }}>
                      <strong>Probleem:</strong> {item.probleem}
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: KLEUREN.primairLicht, borderRadius: '8px', borderLeft: `3px solid ${KLEUREN.primair}` }}>
                    <p style={{ margin: 0, fontSize: '13px', color: KLEUREN.tekst }}>
                      <strong>Onderbouwing:</strong> {item.onderbouwing}
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Concrete acties</p>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: KLEUREN.tekst, lineHeight: 1.7 }}>
                      {item.acties.map((a, j) => <li key={j}>{a}</li>)}
                    </ul>
                  </div>
                  
                  <div style={{ padding: '10px 12px', backgroundColor: KLEUREN.laagLicht, borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>🎯</span>
                    <p style={{ margin: 0, fontSize: '12px', color: KLEUREN.laag, fontWeight: 500 }}>{item.kpi}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Doelgroepgerichte aanpak */}
            <Card>
              <CardTitle sub="Gedifferentieerde interventies per risicogroep">Doelgroepgerichte aanpak</CardTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {[
                  { 
                    groep: '85-plussers', 
                    aantal: demografieData.perLeeftijd.find(l => l.groep === '85+')?.tests || 0,
                    prio: 'hoog',
                    color: KLEUREN.hoog,
                    icon: '👴',
                    risico: 'Hoogste valrisico door combinatie van factoren',
                    aanpak: [
                      'Proactieve huisbezoeken door wijkverpleging',
                      'Woningscan aan huis met directe begeleiding',
                      'Persoonlijke coach voor gedragsverandering',
                      'Nauwe samenwerking met mantelzorgers'
                    ]
                  },
                  { 
                    groep: 'Recidiverende vallers', 
                    aantal: Math.round(stats.hoog * 0.67),
                    prio: 'hoog',
                    color: KLEUREN.hoog,
                    icon: '🔄',
                    risico: '67% van vallers is meerdere keren gevallen',
                    aanpak: [
                      'Multidisciplinair valteam (huisarts, fysio, ergo)',
                      'Uitgebreid valonderzoek naar oorzaken',
                      'Medicatiereview bij polyfarmacie',
                      'Intensief beweegprogramma onder begeleiding'
                    ]
                  },
                  { 
                    groep: 'Matig risico groep', 
                    aantal: stats.matig,
                    prio: 'matig',
                    color: KLEUREN.matig,
                    icon: '⚡',
                    risico: 'Risico op doorgroei naar hoog risico',
                    aanpak: [
                      'Groepscursussen valpreventie',
                      'Online woningscan met adviesrapport',
                      'Voorlichtingsbijeenkomsten per kern',
                      'Beweegactiviteiten bij buurthuizen'
                    ]
                  },
                  { 
                    groep: 'Mensen met valangst', 
                    aantal: Math.round((stats.tests - stats.laag) * 0.38),
                    prio: 'matig',
                    color: KLEUREN.matig,
                    icon: '😰',
                    risico: '38% heeft valangst, leidt tot vermijdingsgedrag',
                    aanpak: [
                      'Cognitieve gedragstherapie elementen',
                      'Geleidelijke opbouw van activiteiten',
                      'Buddy-systeem met lotgenoten',
                      'Succesverhalen delen ter motivatie'
                    ]
                  },
                ].map((item, i) => (
                  <div key={i} style={{ 
                    padding: '20px', 
                    backgroundColor: KLEUREN.achtergrond, 
                    borderRadius: '12px',
                    borderTop: `4px solid ${item.color}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>{item.icon}</span>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: KLEUREN.tekst }}>{item.groep}</h4>
                          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: KLEUREN.tekstSub }}>±{item.aantal} personen</p>
                        </div>
                      </div>
                      <Badge color={item.color}>{item.prio}</Badge>
                    </div>
                    <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: KLEUREN.tekstSub, fontStyle: 'italic' }}>
                      {item.risico}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: KLEUREN.tekst, lineHeight: 1.7 }}>
                      {item.aanpak.map((a, j) => <li key={j}>{a}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>

            {/* KPI's */}
            <Card>
              <CardTitle sub="Meetbare doelstellingen">KPI's voor monitoring</CardTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {[
                  { label: 'Percentage hoog risico', huidig: `${stats.pHoog}%`, doel: '25%', icon: '📉' },
                  { label: 'Bereik valrisicotest', huidig: `${stats.bereik}%`, doel: '40%', icon: '📈' },
                  { label: 'Doorverwijzing naar fysio', huidig: '~35%', doel: '60%', icon: '🏥' },
                  { label: 'Woningscans uitgevoerd', huidig: '~80/jaar', doel: '200/jaar', icon: '🏠' },
                  { label: 'Deelname beweegprogramma', huidig: '~25%', doel: '50%', icon: '🏃' },
                ].map((kpi, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', backgroundColor: KLEUREN.achtergrond, borderRadius: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{kpi.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '12px', fontWeight: 500, color: KLEUREN.tekst }}>{kpi.label}</p>
                      <div style={{ marginTop: '4px' }}>
                        <span style={{ fontSize: '13px', color: KLEUREN.tekstSub }}>{kpi.huidig}</span>
                        <span style={{ fontSize: '13px', color: KLEUREN.tekstSub }}> → </span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: KLEUREN.laag }}>{kpi.doel}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
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
