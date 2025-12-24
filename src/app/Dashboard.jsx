import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, LineChart, Line } from 'recharts';

// =============================================================================
// SUPABASE CONFIGURATIE
// =============================================================================
const SUPABASE_URL = 'https://bggavoacfhmxcbeiixjf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_nnGd9pTnIuI92K9K_zZt-w_1Qb0fug6';

// =============================================================================
// ZLIMTHUIS HUISSTIJL
// =============================================================================
const FontLoader = () => (
  <style>
    {`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');`}
  </style>
);

const ZLIMTHUIS_LOGO = 'https://www.zlimthuis.nl/media/n5cpu0o3/logo-zlimthuis-2021-nieuwe-pay-off-rgb.png';

const KLEUREN = {
  primair: '#0D6560',
  primairDonker: '#095450',
  primairLicht: '#E8E6D9',
  achtergrondAccent: '#F5F4EF',
  laag: '#15803D',
  laagLicht: '#DCFCE7',
  matig: '#D97706',
  matigLicht: '#FEF3C7',
  hoog: '#DC2626',
  hoogLicht: '#FEE2E2',
  achtergrond: '#F8FAFC',
  wit: '#FFFFFF',
  rand: '#E2E8F0',
  tekst: '#1E293B',
  tekstSub: '#475569',
  tekstLicht: '#64748B',
  wijk1: '#0D6560',
  wijk2: '#2563EB',
  wijk3: '#7C3AED',
  wijk4: '#059669',
  accent: '#0EA5E9',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const FONT_FAMILY = "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// =============================================================================
// VASTE REFERENTIE DATA (CBS/Gemeente gegevens - geen dummy data)
// =============================================================================
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

const JAREN = [2024, 2025];

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

const TOTAAL_65PLUS = KERNEN.reduce((sum, k) => sum + k.inw65plus, 0);

// Woonplaats naar kern mapping
const WOONPLAATS_KERN = {
  'Varsseveld': 'K01', 'Westendorp': 'K02', 'Sinderen': 'K03',
  'Terborg': 'K04', 'Silvolde': 'K05', 'Heelweg': 'K06',
  'Bontebrug': 'K07', 'Ulft': 'K08', 'Etten': 'K09',
  'Gendringen': 'K10', 'Netterden': 'K11', 'Megchelen': 'K12',
  'Breedenbroek': 'K13', 'Varsselder': 'K14', 'Voorst': 'K15',
  'Kilder': 'K10', 'IJzerlo': 'K10',
};

const GEMEENTE_PLAATSEN = Object.keys(WOONPLAATS_KERN);

// Labels voor database velden
const RISICO_VRAGEN = {
  v1_gevallen: { label: 'Gevallen afgelopen jaar', toelichting: 'Belangrijkste voorspeller voor toekomstig vallen' },
  v2_bang_vallen: { label: 'Bang om te vallen', toelichting: 'Valangst kan leiden tot vermijdingsgedrag' },
  v3_moeite_bewegen: { label: 'Moeite met bewegen', toelichting: 'Mobiliteitsproblemen verhogen valrisico' },
  v4_verwondingen: { label: 'Verwondingen bij val', toelichting: 'Ernst van eerdere vallen' },
  v5_vaker_gevallen: { label: 'Meerdere keren gevallen', toelichting: 'Herhaald vallen duidt op structureel risico' },
  v6_flauwgevallen: { label: 'Flauwgevallen bij val', toelichting: 'Kan wijzen op onderliggende aandoening' },
  v7_zelf_opstaan: { label: 'Kon niet zelf opstaan', toelichting: 'Indicator voor kwetsbaarheid' },
  v8_taken_zelf: { label: 'Moeite met dagelijkse taken', toelichting: 'Functionele beperkingen' },
};

const PREVENTIE_VRAGEN = {
  p1_ogen: { label: 'Jaarlijkse oogcontrole', advies: 'Laat jaarlijks ogen controleren bij opticien of oogarts' },
  p2_schoenen: { label: 'Stevige schoenen dragen', advies: 'Draag schoenen met goede pasvorm en antislipzool' },
  p3_beweging: { label: 'Regelmatig bewegen', advies: 'Minimaal 2x per week balans- en krachttraining' },
  p4_medicijnen: { label: 'Medicijnen gecontroleerd', advies: 'Laat bij 5+ medicijnen een medicatiereview doen' },
  p5_voeding: { label: 'Gezonde voeding', advies: 'Voldoende eiwitten en vitamine D' },
  p6_woonomgeving: { label: 'Veilige woonomgeving', advies: 'Verwijder losliggende kleden, verbeter verlichting' },
};

// Minimum tests voor privacy
const MIN_TESTS_VOOR_WEERGAVE = 5;

// =============================================================================
// HELPER FUNCTIES
// =============================================================================
const isInGemeente = (woonplaats) => {
  if (!woonplaats) return false;
  return GEMEENTE_PLAATSEN.some(p => p.toLowerCase() === woonplaats.toLowerCase());
};

const getKernId = (woonplaats) => {
  if (!woonplaats) return null;
  const key = GEMEENTE_PLAATSEN.find(p => p.toLowerCase() === woonplaats.toLowerCase());
  return key ? WOONPLAATS_KERN[key] : null;
};

const getWijkVoorKern = (kernId) => {
  const kern = KERNEN.find(k => k.id === kernId);
  return kern?.wijk || null;
};

const berekenPercentage = (deel, totaal) => {
  if (!totaal || totaal === 0) return 0;
  return Math.round((deel / totaal) * 100);
};

// =============================================================================
// UI COMPONENTEN
// =============================================================================
const Card = ({ children, padding = true, highlight = false }) => (
  <div style={{
    backgroundColor: KLEUREN.wit,
    borderRadius: '12px',
    border: highlight ? `2px solid ${KLEUREN.primair}` : `1px solid ${KLEUREN.rand}`,
    padding: padding ? '24px' : '0',
    height: '100%',
    boxSizing: 'border-box',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
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
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginTop: '6px' }}>
          <span style={{ fontSize: '26px', fontWeight: 700, color: color || KLEUREN.tekst }}>{value}</span>
          {unit && <span style={{ fontSize: '16px', fontWeight: 500, color: KLEUREN.tekstSub }}>{unit}</span>}
        </div>
        {sub && <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: KLEUREN.tekstSub }}>{sub}</p>}
      </div>
      {icon && (
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          backgroundColor: color ? `${color}15` : KLEUREN.primairLicht,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', flexShrink: 0, marginLeft: '8px',
        }}>{icon}</div>
      )}
    </div>
  </Card>
);

const ProgressBar = ({ label, value, max = 100, color, showValue = true, count }) => (
  <div style={{ marginBottom: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
      <span style={{ fontSize: '13px', fontWeight: 500, color: KLEUREN.tekst }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: 700, color: color || KLEUREN.primair }}>
        {showValue ? `${value}%` : ''} {count !== undefined && <span style={{ fontWeight: 400, color: KLEUREN.tekstSub }}>({count})</span>}
      </span>
    </div>
    <div style={{ height: '8px', backgroundColor: KLEUREN.achtergrond, borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: '100%', backgroundColor: color || KLEUREN.primair, borderRadius: '4px' }} />
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
    cursor: 'pointer',
    fontSize: '13px', 
    fontWeight: active ? 600 : 500, 
    fontFamily: 'inherit',
    backgroundColor: 'transparent',
    color: active ? KLEUREN.primair : KLEUREN.tekstSub,
    whiteSpace: 'nowrap',
  }}>
    {children}
  </button>
);

const FilterChip = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: '6px 14px', borderRadius: '16px', cursor: 'pointer',
    fontSize: '12px', fontWeight: 500, fontFamily: 'inherit',
    border: `1px solid ${active ? KLEUREN.primair : KLEUREN.rand}`,
    backgroundColor: active ? KLEUREN.primairLicht : KLEUREN.wit,
    color: active ? KLEUREN.primair : KLEUREN.tekstSub,
  }}>
    {children}
  </button>
);

// =============================================================================
// FILTER COMPONENT
// =============================================================================
const FilterPanel = ({ filters, setFilters }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleJaar = (jaar) => {
    const nieuweJaren = filters.jaren.includes(jaar)
      ? filters.jaren.filter(j => j !== jaar)
      : [...filters.jaren, jaar];
    setFilters({ ...filters, jaren: nieuweJaren.length > 0 ? nieuweJaren : [jaar] });
  };
  
  const toggleMaand = (maandId) => {
    const nieuweMaanden = filters.maanden.includes(maandId)
      ? filters.maanden.filter(m => m !== maandId)
      : [...filters.maanden, maandId];
    setFilters({ ...filters, maanden: nieuweMaanden });
  };
  
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
      jaren: JAREN,
      maanden: MAANDEN.map(m => m.id),
      leeftijden: ['65-74', '75-84', '85+'],
      geslachten: ['man', 'vrouw'],
    });
  };
  
  const actieveFilters = filters.jaren.length !== JAREN.length || filters.maanden.length < 12 || filters.leeftijden.length < 3 || filters.geslachten.length < 2;

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: expanded ? '16px' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Filters</h3>
          {actieveFilters && <Badge color={KLEUREN.primair}>Actief</Badge>}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {actieveFilters && (
            <button onClick={resetFilters} style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', backgroundColor: KLEUREN.achtergrond, color: KLEUREN.tekstSub, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>Reset</button>
          )}
          <button onClick={() => setExpanded(!expanded)} style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', backgroundColor: KLEUREN.achtergrond, color: KLEUREN.tekstSub, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {expanded ? 'Inklappen' : 'Uitklappen'}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '24px' }}>
            <div>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Jaar</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {JAREN.map(jaar => (
                  <FilterChip key={jaar} active={filters.jaren.includes(jaar)} onClick={() => toggleJaar(jaar)}>{jaar}</FilterChip>
                ))}
              </div>
            </div>
            <div>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Maanden</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {MAANDEN.map(m => (
                  <FilterChip key={m.id} active={filters.maanden.includes(m.id)} onClick={() => toggleMaand(m.id)}>{m.kort}</FilterChip>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Leeftijd</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['65-74', '75-84', '85+'].map(l => (
                  <FilterChip key={l} active={filters.leeftijden.includes(l)} onClick={() => toggleLeeftijd(l)}>{l}</FilterChip>
                ))}
              </div>
            </div>
            <div>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 600, color: KLEUREN.tekstSub, textTransform: 'uppercase' }}>Geslacht</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['man', 'vrouw'].map(g => (
                  <FilterChip key={g} active={filters.geslachten.includes(g)} onClick={() => toggleGeslacht(g)}>{g === 'man' ? 'Man' : 'Vrouw'}</FilterChip>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

// =============================================================================
// HOOFDCOMPONENT
// =============================================================================
export default function ValrisicoDashboard() {
  const [tab, setTab] = useState('overzicht');
  const [wijk, setWijk] = useState('alle');
  const [filters, setFilters] = useState({
    jaren: JAREN,
    maanden: MAANDEN.map(m => m.id),
    leeftijden: ['65-74', '75-84', '85+'],
    geslachten: ['man', 'vrouw'],
  });
  
  // Supabase state
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Fetch data van Supabase
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/testresultaten?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setRawData(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // =============================================================================
  // GEFILTERDE DATA - Alle berekeningen op basis van Supabase data
  // =============================================================================
  const gefilterdData = useMemo(() => {
    return rawData.filter(record => {
      // Jaar filter
      const datum = new Date(record.created_at);
      const jaar = datum.getFullYear();
      if (!filters.jaren.includes(jaar)) return false;
      
      // Maand filter
      const maand = datum.getMonth() + 1;
      if (!filters.maanden.includes(maand)) return false;
      
      // Leeftijd filter
      if (record.leeftijd && !filters.leeftijden.includes(record.leeftijd)) return false;
      
      // Geslacht filter
      if (record.geslacht && !filters.geslachten.includes(record.geslacht)) return false;
      
      // Wijk filter
      if (wijk !== 'alle') {
        const kernId = getKernId(record.woonplaats);
        const recordWijk = getWijkVoorKern(kernId);
        if (recordWijk !== wijk) return false;
      }
      
      return true;
    });
  }, [rawData, filters, wijk]);

  // =============================================================================
  // STATISTIEKEN - 100% BEREKEND uit Supabase data
  // =============================================================================
  const stats = useMemo(() => {
    const totaal = gefilterdData.length;
    
    // Risicoverdeling - BEREKEND
    const laag = gefilterdData.filter(r => r.risiconiveau === 'laag').length;
    const matig = gefilterdData.filter(r => r.risiconiveau === 'matig').length;
    const hoog = gefilterdData.filter(r => r.risiconiveau === 'hoog').length;
    
    // Gemeente check
    const inGemeente = gefilterdData.filter(r => isInGemeente(r.woonplaats)).length;
    const buitenGemeente = totaal - inGemeente;
    
    // Bereik berekenen
    const inwoners = wijk === 'alle' 
      ? TOTAAL_65PLUS 
      : KERNEN.filter(k => k.wijk === wijk).reduce((sum, k) => sum + k.inw65plus, 0);
    
    return {
      totaal,
      laag,
      matig,
      hoog,
      percLaag: berekenPercentage(laag, totaal),
      percMatig: berekenPercentage(matig, totaal),
      percHoog: berekenPercentage(hoog, totaal),
      inGemeente,
      buitenGemeente,
      inwoners65plus: inwoners,
      bereik: berekenPercentage(inGemeente, inwoners),
    };
  }, [gefilterdData, wijk]);

  // Geslacht statistieken - BEREKEND
  const geslachtStats = useMemo(() => {
    const mannen = gefilterdData.filter(r => r.geslacht === 'man');
    const vrouwen = gefilterdData.filter(r => r.geslacht === 'vrouw');
    
    return {
      mannen: {
        totaal: mannen.length,
        laag: mannen.filter(r => r.risiconiveau === 'laag').length,
        matig: mannen.filter(r => r.risiconiveau === 'matig').length,
        hoog: mannen.filter(r => r.risiconiveau === 'hoog').length,
      },
      vrouwen: {
        totaal: vrouwen.length,
        laag: vrouwen.filter(r => r.risiconiveau === 'laag').length,
        matig: vrouwen.filter(r => r.risiconiveau === 'matig').length,
        hoog: vrouwen.filter(r => r.risiconiveau === 'hoog').length,
      },
    };
  }, [gefilterdData]);

  // Leeftijd statistieken - BEREKEND
  const leeftijdStats = useMemo(() => {
    return ['65-74', '75-84', '85+'].map(leeftijd => {
      const groep = gefilterdData.filter(r => r.leeftijd === leeftijd);
      return {
        leeftijd,
        totaal: groep.length,
        laag: groep.filter(r => r.risiconiveau === 'laag').length,
        matig: groep.filter(r => r.risiconiveau === 'matig').length,
        hoog: groep.filter(r => r.risiconiveau === 'hoog').length,
        percHoog: berekenPercentage(groep.filter(r => r.risiconiveau === 'hoog').length, groep.length),
      };
    });
  }, [gefilterdData]);

  // Per kern statistieken - BEREKEND
  const kernStats = useMemo(() => {
    return KERNEN.map(kern => {
      const kernData = gefilterdData.filter(r => getKernId(r.woonplaats) === kern.id);
      return {
        ...kern,
        tests: kernData.length,
        laag: kernData.filter(r => r.risiconiveau === 'laag').length,
        matig: kernData.filter(r => r.risiconiveau === 'matig').length,
        hoog: kernData.filter(r => r.risiconiveau === 'hoog').length,
        bereik: berekenPercentage(kernData.length, kern.inw65plus),
        percHoog: berekenPercentage(kernData.filter(r => r.risiconiveau === 'hoog').length, kernData.length),
      };
    }).filter(k => wijk === 'alle' || k.wijk === wijk);
  }, [gefilterdData, wijk]);

  // Per wijk statistieken - BEREKEND
  const wijkStats = useMemo(() => {
    return WIJKEN.map(w => {
      const wijkKernen = KERNEN.filter(k => k.wijk === w.code);
      const wijkData = gefilterdData.filter(r => {
        const kernId = getKernId(r.woonplaats);
        return wijkKernen.some(k => k.id === kernId);
      });
      const inwoners = wijkKernen.reduce((sum, k) => sum + k.inw65plus, 0);
      
      return {
        ...w,
        tests: wijkData.length,
        laag: wijkData.filter(r => r.risiconiveau === 'laag').length,
        matig: wijkData.filter(r => r.risiconiveau === 'matig').length,
        hoog: wijkData.filter(r => r.risiconiveau === 'hoog').length,
        inwoners,
        bereik: berekenPercentage(wijkData.length, inwoners),
        percHoog: berekenPercentage(wijkData.filter(r => r.risiconiveau === 'hoog').length, wijkData.length),
      };
    });
  }, [gefilterdData]);

  // Risicovragen statistieken - BEREKEND uit database velden
  const risicoVragenStats = useMemo(() => {
    return Object.entries(RISICO_VRAGEN).map(([key, info]) => {
      const ja = gefilterdData.filter(r => r[key] === true).length;
      const nee = gefilterdData.filter(r => r[key] === false).length;
      const beantwoord = ja + nee;
      
      return {
        key,
        ...info,
        ja,
        nee,
        beantwoord,
        percentage: berekenPercentage(ja, beantwoord),
      };
    });
  }, [gefilterdData]);

  // Preventievragen statistieken - BEREKEND uit database velden
  const preventieVragenStats = useMemo(() => {
    return Object.entries(PREVENTIE_VRAGEN).map(([key, info]) => {
      const ja = gefilterdData.filter(r => r[key] === true).length;
      const nee = gefilterdData.filter(r => r[key] === false).length;
      const beantwoord = ja + nee;
      
      return {
        key,
        ...info,
        ja,
        nee,
        beantwoord,
        percentage: berekenPercentage(ja, beantwoord),
      };
    });
  }, [gefilterdData]);

  // Fysio doorverwijzingen - BEREKEND
  const fysioStats = useMemo(() => {
    const fysioAanvragen = gefilterdData.filter(r => r.fysio_contact_aangevraagd === true).length;
    const hoogRisicoMetFysio = gefilterdData.filter(r => r.risiconiveau === 'hoog' && r.fysio_contact_aangevraagd === true).length;
    
    return {
      totaalAanvragen: fysioAanvragen,
      hoogRisicoMetFysio,
      conversieHoogRisico: berekenPercentage(hoogRisicoMetFysio, stats.hoog),
      conversieTotaal: berekenPercentage(fysioAanvragen, stats.totaal),
    };
  }, [gefilterdData, stats.hoog, stats.totaal]);

  // Trend data per maand - BEREKEND
  const trendData = useMemo(() => {
    return MAANDEN.map(m => {
      const maandData = gefilterdData.filter(r => {
        const datum = new Date(r.created_at);
        return datum.getMonth() + 1 === m.id;
      });
      
      return {
        maand: m.kort,
        tests: maandData.length,
        laag: maandData.filter(r => r.risiconiveau === 'laag').length,
        matig: maandData.filter(r => r.risiconiveau === 'matig').length,
        hoog: maandData.filter(r => r.risiconiveau === 'hoog').length,
      };
    });
  }, [gefilterdData]);

  // Chart data
  const pieData = [
    { name: 'Laag risico', value: stats.laag, color: KLEUREN.laag },
    { name: 'Matig risico', value: stats.matig, color: KLEUREN.matig },
    { name: 'Hoog risico', value: stats.hoog, color: KLEUREN.hoog },
  ];

  // =============================================================================
  // RENDER
  // =============================================================================
  
  if (loading && rawData.length === 0) {
    return (
      <div style={{ fontFamily: FONT_FAMILY, backgroundColor: KLEUREN.achtergrond, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>Laden...</div>
          <p style={{ color: KLEUREN.tekstSub }}>Data wordt opgehaald</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontFamily: FONT_FAMILY, backgroundColor: KLEUREN.achtergrond, minHeight: '100vh', padding: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ color: KLEUREN.hoog }}>Fout bij laden: {error}</h2>
            <button onClick={fetchData} style={{ marginTop: '16px', padding: '12px 24px', backgroundColor: KLEUREN.primair, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Opnieuw proberen
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <FontLoader />
      <div style={{ fontFamily: FONT_FAMILY, backgroundColor: KLEUREN.achtergrond, minHeight: '100vh' }}>
        
        {/* HEADER */}
        <header style={{ backgroundColor: KLEUREN.wit, borderBottom: `1px solid ${KLEUREN.rand}`, padding: '12px 20px', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={ZLIMTHUIS_LOGO} alt="Zlimthuis" style={{ height: '36px' }} onError={(e) => e.target.style.display = 'none'} />
              <div style={{ borderLeft: `1px solid ${KLEUREN.rand}`, paddingLeft: '12px' }}>
                <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: KLEUREN.tekst }}>Valrisico Dashboard</h1>
                <p style={{ margin: 0, fontSize: '11px', color: KLEUREN.tekstSub }}>
                  Gemeente Oude IJsselstreek - Live data ({rawData.length} tests)
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {lastRefresh && (
                <span style={{ fontSize: '11px', color: KLEUREN.tekstLicht }}>
                  Bijgewerkt: {lastRefresh.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              
              <select value={wijk} onChange={(e) => setWijk(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: `1px solid ${KLEUREN.rand}`, fontSize: '13px' }}>
                <option value="alle">Alle wijken</option>
                {WIJKEN.map(w => <option key={w.code} value={w.code}>{w.naam}</option>)}
              </select>
              
              <button onClick={fetchData} disabled={loading}
                style={{ padding: '8px 16px', backgroundColor: KLEUREN.primair, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                {loading ? 'Laden...' : 'Ververs'}
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
          
          {/* Filter panel */}
          <div style={{ marginBottom: '20px' }}>
            <FilterPanel filters={filters} setFilters={setFilters} />
          </div>

          {/* Tabs */}
          <div style={{ backgroundColor: KLEUREN.wit, borderRadius: '12px 12px 0 0', borderBottom: `1px solid ${KLEUREN.rand}`, marginBottom: '0', display: 'flex', overflowX: 'auto' }}>
            {[
              { id: 'overzicht', label: 'Overzicht' },
              { id: 'risico', label: 'Risicofactoren' },
              { id: 'preventie', label: 'Preventie' },
              { id: 'demografie', label: 'Demografie' },
              { id: 'fysio', label: 'Doorverwijzingen' },
              { id: 'geografisch', label: 'Geografisch' },
            ].map(t => (
              <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</TabButton>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ backgroundColor: KLEUREN.wit, borderRadius: '0 0 12px 12px', padding: '24px', marginBottom: '20px' }}>
            
            {/* OVERZICHT TAB */}
            {tab === 'overzicht' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Geen data melding */}
                {stats.totaal === 0 && (
                  <InfoPanel type="info">
                    <strong>Nog geen testresultaten</strong>
                    <p style={{ margin: '8px 0 0' }}>Zodra mensen de valrisicotest invullen, verschijnen de resultaten hier.</p>
                  </InfoPanel>
                )}

                {stats.totaal > 0 && (
                  <>
                    {/* KPI Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <StatCard label="Totaal tests" value={stats.totaal} sub={`${stats.bereik}% bereik van ${stats.inwoners65plus.toLocaleString()} inwoners 65+`} color={KLEUREN.primair} icon="T" />
                      <StatCard label="Laag risico" value={stats.laag} sub={`${stats.percLaag}% van totaal`} color={KLEUREN.laag} icon="L" />
                      <StatCard label="Matig risico" value={stats.matig} sub={`${stats.percMatig}% van totaal`} color={KLEUREN.matig} icon="M" />
                      <StatCard label="Hoog risico" value={stats.hoog} sub={`${stats.percHoog}% van totaal`} color={KLEUREN.hoog} icon="H" />
                    </div>

                    {/* Charts */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                      
                      {/* Pie chart */}
                      <Card>
                        <CardTitle>Risicoverdeling</CardTitle>
                        {stats.totaal > 0 ? (
                          <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value"
                                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                              </Pie>
                              <Tooltip formatter={(value) => [value, 'Aantal']} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <p style={{ color: KLEUREN.tekstSub, textAlign: 'center', padding: '40px' }}>Geen data beschikbaar</p>
                        )}
                      </Card>

                      {/* Trend */}
                      <Card>
                        <CardTitle>Trend per maand</CardTitle>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="maand" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="laag" stackId="a" fill={KLEUREN.laag} name="Laag" />
                            <Bar dataKey="matig" stackId="a" fill={KLEUREN.matig} name="Matig" />
                            <Bar dataKey="hoog" stackId="a" fill={KLEUREN.hoog} name="Hoog" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Card>
                    </div>

                    {/* Buiten gemeente info */}
                    {stats.buitenGemeente > 0 && (
                      <InfoPanel type="info">
                        <strong>{stats.buitenGemeente} tests van buiten gemeente</strong> - Deze zijn meegeteld in de totalen maar niet in het bereikpercentage.
                      </InfoPanel>
                    )}
                  </>
                )}
              </div>
            )}

            {/* RISICOFACTOREN TAB */}
            {tab === 'risico' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <CardTitle sub="Percentage 'ja' antwoorden per risicovraag - berekend uit testresultaten">Risicofactoren analyse</CardTitle>
                
                {stats.totaal === 0 ? (
                  <InfoPanel type="info">Nog geen data beschikbaar</InfoPanel>
                ) : (
                  <>
                    <InfoPanel type="info">
                      Alle percentages worden <strong>berekend uit de {stats.totaal} testresultaten</strong> in de huidige selectie.
                    </InfoPanel>
                    
                    {risicoVragenStats.map((vraag, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <ProgressBar 
                          label={vraag.label}
                          value={vraag.percentage}
                          count={vraag.ja}
                          color={vraag.percentage > 50 ? KLEUREN.hoog : vraag.percentage > 30 ? KLEUREN.matig : KLEUREN.laag}
                        />
                        <p style={{ fontSize: '12px', color: KLEUREN.tekstSub, marginTop: '-8px', marginBottom: '16px' }}>
                          {vraag.toelichting} ({vraag.beantwoord} beantwoord)
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* PREVENTIE TAB */}
            {tab === 'preventie' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <CardTitle sub="Percentage dat preventieve maatregelen al neemt - berekend uit testresultaten">Preventieve maatregelen</CardTitle>
                
                {stats.totaal === 0 ? (
                  <InfoPanel type="info">Nog geen data beschikbaar</InfoPanel>
                ) : (
                  <>
                    <InfoPanel type="success">
                      Hogere percentages = meer mensen nemen deze maatregel al. Focus op vragen met <strong>lage percentages</strong> voor preventie-interventies.
                    </InfoPanel>
                    
                    {preventieVragenStats.map((vraag, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <ProgressBar 
                          label={vraag.label}
                          value={vraag.percentage}
                          count={vraag.ja}
                          color={vraag.percentage >= 60 ? KLEUREN.laag : vraag.percentage >= 40 ? KLEUREN.matig : KLEUREN.hoog}
                        />
                        <p style={{ fontSize: '12px', color: KLEUREN.tekstSub, marginTop: '-8px', marginBottom: '16px' }}>
                          Advies: {vraag.advies} ({vraag.beantwoord} beantwoord)
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* DEMOGRAFIE TAB */}
            {tab === 'demografie' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <CardTitle sub="Verdeling per leeftijd en geslacht - berekend uit testresultaten">Demografische analyse</CardTitle>
                
                {stats.totaal === 0 ? (
                  <InfoPanel type="info">Nog geen data beschikbaar</InfoPanel>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    
                    {/* Leeftijd */}
                    <Card>
                      <CardTitle>Per leeftijdsgroep</CardTitle>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={leeftijdStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="leeftijd" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="laag" stackId="a" fill={KLEUREN.laag} name="Laag" />
                          <Bar dataKey="matig" stackId="a" fill={KLEUREN.matig} name="Matig" />
                          <Bar dataKey="hoog" stackId="a" fill={KLEUREN.hoog} name="Hoog" />
                        </BarChart>
                      </ResponsiveContainer>
                      <div style={{ marginTop: '16px' }}>
                        {leeftijdStats.map((l, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${KLEUREN.rand}` }}>
                            <span>{l.leeftijd}</span>
                            <span><strong>{l.totaal}</strong> tests, <span style={{ color: KLEUREN.hoog }}>{l.percHoog}% hoog risico</span></span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Geslacht */}
                    <Card>
                      <CardTitle>Per geslacht</CardTitle>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ padding: '16px', backgroundColor: '#EFF6FF', borderRadius: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '32px', fontWeight: 800, color: '#3B82F6' }}>{geslachtStats.mannen.totaal}</div>
                          <div style={{ fontSize: '13px', color: KLEUREN.tekstSub }}>Mannen</div>
                          <div style={{ fontSize: '12px', marginTop: '8px' }}>
                            <span style={{ color: KLEUREN.hoog }}>{berekenPercentage(geslachtStats.mannen.hoog, geslachtStats.mannen.totaal)}% hoog</span>
                          </div>
                        </div>
                        <div style={{ padding: '16px', backgroundColor: '#FDF2F8', borderRadius: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '32px', fontWeight: 800, color: '#EC4899' }}>{geslachtStats.vrouwen.totaal}</div>
                          <div style={{ fontSize: '13px', color: KLEUREN.tekstSub }}>Vrouwen</div>
                          <div style={{ fontSize: '12px', marginTop: '8px' }}>
                            <span style={{ color: KLEUREN.hoog }}>{berekenPercentage(geslachtStats.vrouwen.hoog, geslachtStats.vrouwen.totaal)}% hoog</span>
                          </div>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={[
                          { groep: 'Man', ...geslachtStats.mannen },
                          { groep: 'Vrouw', ...geslachtStats.vrouwen },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="groep" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="laag" stackId="a" fill={KLEUREN.laag} name="Laag" />
                          <Bar dataKey="matig" stackId="a" fill={KLEUREN.matig} name="Matig" />
                          <Bar dataKey="hoog" stackId="a" fill={KLEUREN.hoog} name="Hoog" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* FYSIO/DOORVERWIJZINGEN TAB */}
            {tab === 'fysio' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <CardTitle sub="Fysio contactaanvragen uit de valrisicotest - berekend uit testresultaten">Doorverwijzingen analyse</CardTitle>
                
                {stats.totaal === 0 ? (
                  <InfoPanel type="info">Nog geen data beschikbaar</InfoPanel>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <StatCard 
                        label="Hoog risico" 
                        value={stats.hoog} 
                        sub="Potentiele doelgroep voor fysio" 
                        color={KLEUREN.hoog} 
                      />
                      <StatCard 
                        label="Fysio aanvragen" 
                        value={fysioStats.totaalAanvragen} 
                        sub={`${fysioStats.conversieTotaal}% van alle tests`}
                        color={KLEUREN.primair} 
                      />
                      <StatCard 
                        label="Hoog risico met fysio" 
                        value={fysioStats.hoogRisicoMetFysio} 
                        sub={`${fysioStats.conversieHoogRisico}% conversie van hoog risico`}
                        color={KLEUREN.success} 
                      />
                    </div>

                    <Card>
                      <CardTitle>Conversie analyse</CardTitle>
                      <ProgressBar 
                        label={`Conversie hoog risico naar fysio aanvraag`}
                        value={fysioStats.conversieHoogRisico}
                        color={fysioStats.conversieHoogRisico >= 40 ? KLEUREN.laag : fysioStats.conversieHoogRisico >= 20 ? KLEUREN.matig : KLEUREN.hoog}
                        count={fysioStats.hoogRisicoMetFysio}
                      />
                      <p style={{ fontSize: '13px', color: KLEUREN.tekstSub, marginTop: '8px' }}>
                        Van de {stats.hoog} mensen met hoog risico hebben {fysioStats.hoogRisicoMetFysio} een fysio contactaanvraag gedaan.
                        {fysioStats.conversieHoogRisico < 40 && (
                          <span style={{ color: KLEUREN.matig }}> Er is ruimte voor verbetering - doel is 40% conversie.</span>
                        )}
                      </p>
                    </Card>

                    <InfoPanel type="info">
                      <strong>Let op:</strong> Dit zijn contactaanvragen via de test. Niet alle aanvragen leiden tot daadwerkelijke behandeling.
                      Voor volledige doorverwijzingsdata is koppeling met fysiotherapiepraktijken nodig.
                    </InfoPanel>
                  </>
                )}
              </div>
            )}

            {/* GEOGRAFISCH TAB */}
            {tab === 'geografisch' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <CardTitle sub="Verdeling per wijk en kern - berekend uit testresultaten">Geografische analyse</CardTitle>
                
                {stats.totaal === 0 ? (
                  <InfoPanel type="info">Nog geen data beschikbaar</InfoPanel>
                ) : (
                  <>
                    {/* Per wijk */}
                    <Card>
                      <CardTitle>Per wijk</CardTitle>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={wijkStats} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="naam" width={120} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="laag" stackId="a" fill={KLEUREN.laag} name="Laag" />
                          <Bar dataKey="matig" stackId="a" fill={KLEUREN.matig} name="Matig" />
                          <Bar dataKey="hoog" stackId="a" fill={KLEUREN.hoog} name="Hoog" />
                        </BarChart>
                      </ResponsiveContainer>
                      
                      <div style={{ marginTop: '16px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: `2px solid ${KLEUREN.rand}` }}>
                              <th style={{ padding: '10px 8px', textAlign: 'left' }}>Wijk</th>
                              <th style={{ padding: '10px 8px', textAlign: 'right' }}>Tests</th>
                              <th style={{ padding: '10px 8px', textAlign: 'right' }}>Inwoners 65+</th>
                              <th style={{ padding: '10px 8px', textAlign: 'right' }}>Bereik</th>
                              <th style={{ padding: '10px 8px', textAlign: 'right' }}>% Hoog risico</th>
                            </tr>
                          </thead>
                          <tbody>
                            {wijkStats.map((w, i) => (
                              <tr key={i} style={{ borderBottom: `1px solid ${KLEUREN.rand}` }}>
                                <td style={{ padding: '10px 8px' }}>{w.naam}</td>
                                <td style={{ padding: '10px 8px', textAlign: 'right' }}>{w.tests}</td>
                                <td style={{ padding: '10px 8px', textAlign: 'right' }}>{w.inwoners.toLocaleString()}</td>
                                <td style={{ padding: '10px 8px', textAlign: 'right' }}>{w.bereik}%</td>
                                <td style={{ padding: '10px 8px', textAlign: 'right', color: w.percHoog > 30 ? KLEUREN.hoog : KLEUREN.tekst }}>{w.percHoog}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>

                    {/* Per kern */}
                    <Card>
                      <CardTitle>Per kern</CardTitle>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: `2px solid ${KLEUREN.rand}` }}>
                              <th style={{ padding: '10px 8px', textAlign: 'left' }}>Kern</th>
                              <th style={{ padding: '10px 8px', textAlign: 'right' }}>Tests</th>
                              <th style={{ padding: '10px 8px', textAlign: 'right' }}>Laag</th>
                              <th style={{ padding: '10px 8px', textAlign: 'right' }}>Matig</th>
                              <th style={{ padding: '10px 8px', textAlign: 'right' }}>Hoog</th>
                              <th style={{ padding: '10px 8px', textAlign: 'right' }}>Bereik</th>
                            </tr>
                          </thead>
                          <tbody>
                            {kernStats.filter(k => k.tests > 0).sort((a, b) => b.tests - a.tests).map((k, i) => (
                              <tr key={i} style={{ borderBottom: `1px solid ${KLEUREN.rand}` }}>
                                <td style={{ padding: '10px 8px' }}>{k.naam}</td>
                                <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 600 }}>{k.tests}</td>
                                <td style={{ padding: '10px 8px', textAlign: 'right', color: KLEUREN.laag }}>{k.laag}</td>
                                <td style={{ padding: '10px 8px', textAlign: 'right', color: KLEUREN.matig }}>{k.matig}</td>
                                <td style={{ padding: '10px 8px', textAlign: 'right', color: KLEUREN.hoog }}>{k.hoog}</td>
                                <td style={{ padding: '10px 8px', textAlign: 'right' }}>{k.bereik}%</td>
                              </tr>
                            ))}
                            {kernStats.filter(k => k.tests === 0).length > 0 && (
                              <tr>
                                <td colSpan={6} style={{ padding: '10px 8px', color: KLEUREN.tekstLicht, fontStyle: 'italic' }}>
                                  + {kernStats.filter(k => k.tests === 0).length} kernen zonder tests in deze selectie
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </>
                )}
              </div>
            )}

          </div>

          {/* Recente tests tabel */}
          <Card>
            <CardTitle sub={`Laatste ${Math.min(10, rawData.length)} ingevulde tests`}>Recente tests</CardTitle>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${KLEUREN.rand}` }}>
                    <th style={{ padding: '10px 8px', textAlign: 'left' }}>Datum</th>
                    <th style={{ padding: '10px 8px', textAlign: 'left' }}>Woonplaats</th>
                    <th style={{ padding: '10px 8px', textAlign: 'left' }}>Leeftijd</th>
                    <th style={{ padding: '10px 8px', textAlign: 'left' }}>Geslacht</th>
                    <th style={{ padding: '10px 8px', textAlign: 'left' }}>Risico</th>
                    <th style={{ padding: '10px 8px', textAlign: 'left' }}>Fysio</th>
                  </tr>
                </thead>
                <tbody>
                  {rawData.slice(0, 10).map((test, i) => (
                    <tr key={test.id || i} style={{ borderBottom: `1px solid ${KLEUREN.rand}` }}>
                      <td style={{ padding: '10px 8px' }}>{test.created_at ? new Date(test.created_at).toLocaleDateString('nl-NL') : '-'}</td>
                      <td style={{ padding: '10px 8px' }}>{test.woonplaats || '-'}</td>
                      <td style={{ padding: '10px 8px' }}>{test.leeftijd || '-'}</td>
                      <td style={{ padding: '10px 8px' }}>{test.geslacht || '-'}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <Badge color={test.risiconiveau === 'laag' ? KLEUREN.laag : test.risiconiveau === 'matig' ? KLEUREN.matig : KLEUREN.hoog}>
                          {test.risiconiveau || '-'}
                        </Badge>
                      </td>
                      <td style={{ padding: '10px 8px' }}>{test.fysio_contact_aangevraagd ? 'Ja' : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </main>

        {/* Footer */}
        <footer style={{ backgroundColor: KLEUREN.wit, borderTop: `1px solid ${KLEUREN.rand}`, padding: '16px', textAlign: 'center', marginTop: '20px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: KLEUREN.tekstSub }}>
            Valrisico Dashboard - Gemeente Oude IJsselstreek - Alle data uit Supabase (geen dummy data)
          </p>
        </footer>
      </div>
    </>
  );
}
