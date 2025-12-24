import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// =============================================================================
// SUPABASE CONFIGURATIE
// =============================================================================
const SUPABASE_URL = 'https://bggavoacfhmxcbeiixjf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_nnGd9pTnIuI92K9K_zZt-w_1Qb0fug6';

// =============================================================================
// STYLING
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
};

const FONT_FAMILY = "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// =============================================================================
// REFERENTIE DATA (niet dummy - dit zijn vaste gemeente gegevens)
// =============================================================================
const KERNEN = [
  { id: 'K01', naam: 'Varsseveld', inw65plus: 1680 },
  { id: 'K02', naam: 'Westendorp', inw65plus: 395 },
  { id: 'K03', naam: 'Sinderen', inw65plus: 290 },
  { id: 'K04', naam: 'Terborg', inw65plus: 1125 },
  { id: 'K05', naam: 'Silvolde', inw65plus: 1310 },
  { id: 'K06', naam: 'Heelweg', inw65plus: 185 },
  { id: 'K07', naam: 'Bontebrug', inw65plus: 75 },
  { id: 'K08', naam: 'Ulft', inw65plus: 2480 },
  { id: 'K09', naam: 'Etten', inw65plus: 445 },
  { id: 'K10', naam: 'Gendringen', inw65plus: 1020 },
  { id: 'K11', naam: 'Netterden', inw65plus: 240 },
  { id: 'K12', naam: 'Megchelen', inw65plus: 205 },
  { id: 'K13', naam: 'Breedenbroek', inw65plus: 175 },
  { id: 'K14', naam: 'Varsselder', inw65plus: 155 },
  { id: 'K15', naam: 'Voorst', inw65plus: 115 },
];

const TOTAAL_65PLUS = KERNEN.reduce((sum, k) => sum + k.inw65plus, 0);

// Woonplaats naar kern mapping
const WOONPLAATS_NAAR_KERN = {
  'Varsseveld': 'Varsseveld', 'Westendorp': 'Westendorp', 'Sinderen': 'Sinderen',
  'Terborg': 'Terborg', 'Silvolde': 'Silvolde', 'Heelweg': 'Heelweg',
  'Bontebrug': 'Bontebrug', 'Ulft': 'Ulft', 'Etten': 'Etten',
  'Gendringen': 'Gendringen', 'Netterden': 'Netterden', 'Megchelen': 'Megchelen',
  'Breedenbroek': 'Breedenbroek', 'Varsselder': 'Varsselder', 'Voorst': 'Voorst',
  'Kilder': 'Gendringen', 'IJzerlo': 'Gendringen',
};

const GEMEENTE_PLAATSEN = Object.keys(WOONPLAATS_NAAR_KERN);

// =============================================================================
// HELPER FUNCTIES
// =============================================================================
const isInGemeente = (woonplaats) => {
  if (!woonplaats) return false;
  return GEMEENTE_PLAATSEN.some(p => p.toLowerCase() === woonplaats.toLowerCase());
};

const getKernNaam = (woonplaats) => {
  if (!woonplaats) return null;
  const key = GEMEENTE_PLAATSEN.find(p => p.toLowerCase() === woonplaats.toLowerCase());
  return key ? WOONPLAATS_NAAR_KERN[key] : null;
};

// =============================================================================
// COMPONENTEN
// =============================================================================
const Card = ({ children, title, subtitle }) => (
  <div style={{
    backgroundColor: KLEUREN.wit,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: `1px solid ${KLEUREN.rand}`,
    marginBottom: '16px'
  }}>
    {title && (
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: KLEUREN.tekst }}>{title}</h3>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: '13px', color: KLEUREN.tekstSub }}>{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

const StatCard = ({ label, value, sublabel, color = KLEUREN.primair }) => (
  <div style={{
    backgroundColor: KLEUREN.wit,
    borderRadius: '10px',
    padding: '16px',
    border: `1px solid ${KLEUREN.rand}`,
    borderLeft: `4px solid ${color}`,
  }}>
    <div style={{ fontSize: '12px', color: KLEUREN.tekstSub, marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '28px', fontWeight: 800, color }}>{value}</div>
    {sublabel && <div style={{ fontSize: '11px', color: KLEUREN.tekstLicht, marginTop: '4px' }}>{sublabel}</div>}
  </div>
);

const Badge = ({ children, color }) => (
  <span style={{
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: color === KLEUREN.laag ? KLEUREN.laagLicht : color === KLEUREN.matig ? KLEUREN.matigLicht : KLEUREN.hoogLicht,
    color: color,
  }}>
    {children}
  </span>
);

// =============================================================================
// HOOFDCOMPONENT
// =============================================================================
export default function ValrisicoDashboard() {
  const [supabaseData, setSupabaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Data ophalen
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
      setSupabaseData(data);
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

  // Berekende statistieken - 100% gebaseerd op Supabase data
  const stats = useMemo(() => {
    if (!supabaseData.length) return null;

    const totaal = supabaseData.length;
    const inGemeente = supabaseData.filter(t => isInGemeente(t.woonplaats));
    const buitenGemeente = supabaseData.filter(t => !isInGemeente(t.woonplaats));
    
    // Risico verdeling
    const laag = supabaseData.filter(t => t.risiconiveau === 'laag').length;
    const matig = supabaseData.filter(t => t.risiconiveau === 'matig').length;
    const hoog = supabaseData.filter(t => t.risiconiveau === 'hoog').length;
    
    // Geslacht
    const mannen = supabaseData.filter(t => t.geslacht === 'man').length;
    const vrouwen = supabaseData.filter(t => t.geslacht === 'vrouw').length;
    
    // Leeftijd
    const leeftijdGroepen = {};
    supabaseData.forEach(t => {
      const l = t.leeftijd || 'Onbekend';
      leeftijdGroepen[l] = (leeftijdGroepen[l] || 0) + 1;
    });
    
    // Per woonplaats
    const perWoonplaats = {};
    supabaseData.forEach(t => {
      const w = t.woonplaats || 'Onbekend';
      if (!perWoonplaats[w]) perWoonplaats[w] = { totaal: 0, laag: 0, matig: 0, hoog: 0 };
      perWoonplaats[w].totaal++;
      if (t.risiconiveau === 'laag') perWoonplaats[w].laag++;
      if (t.risiconiveau === 'matig') perWoonplaats[w].matig++;
      if (t.risiconiveau === 'hoog') perWoonplaats[w].hoog++;
    });
    
    // Per dag (voor trend)
    const perDag = {};
    supabaseData.forEach(t => {
      const dag = t.created_at ? t.created_at.split('T')[0] : null;
      if (dag) perDag[dag] = (perDag[dag] || 0) + 1;
    });
    
    // Fysio aanvragen - ECHT uit database
    const fysioAanvragen = supabaseData.filter(t => t.fysio_contact_aangevraagd === true).length;
    
    // Preventie antwoorden - ECHT berekend
    const preventieStats = {
      p1_ogen: { ja: 0, nee: 0 },
      p2_schoenen: { ja: 0, nee: 0 },
      p3_beweging: { ja: 0, nee: 0 },
      p4_medicijnen: { ja: 0, nee: 0 },
      p5_voeding: { ja: 0, nee: 0 },
      p6_woonomgeving: { ja: 0, nee: 0 },
    };
    
    supabaseData.forEach(t => {
      Object.keys(preventieStats).forEach(key => {
        if (t[key] === true) preventieStats[key].ja++;
        else if (t[key] === false) preventieStats[key].nee++;
      });
    });
    
    // Risico vragen antwoorden - ECHT berekend
    const risicoStats = {
      v1_gevallen: { ja: 0, nee: 0 },
      v2_bang_vallen: { ja: 0, nee: 0 },
      v3_moeite_bewegen: { ja: 0, nee: 0 },
      v4_verwondingen: { ja: 0, nee: 0 },
      v5_vaker_gevallen: { ja: 0, nee: 0 },
      v6_flauwgevallen: { ja: 0, nee: 0 },
      v7_zelf_opstaan: { ja: 0, nee: 0 },
      v8_taken_zelf: { ja: 0, nee: 0 },
    };
    
    supabaseData.forEach(t => {
      Object.keys(risicoStats).forEach(key => {
        if (t[key] === true) risicoStats[key].ja++;
        else if (t[key] === false) risicoStats[key].nee++;
      });
    });

    // Bereik berekenen (alleen gemeente tests / gemeente inwoners)
    const testsInGemeente = inGemeente.length;
    const bereikPercentage = TOTAAL_65PLUS > 0 ? ((testsInGemeente / TOTAAL_65PLUS) * 100).toFixed(2) : 0;

    return {
      totaal,
      testsInGemeente,
      testsBuitenGemeente: buitenGemeente.length,
      laag, matig, hoog,
      percLaag: totaal > 0 ? Math.round((laag / totaal) * 100) : 0,
      percMatig: totaal > 0 ? Math.round((matig / totaal) * 100) : 0,
      percHoog: totaal > 0 ? Math.round((hoog / totaal) * 100) : 0,
      mannen, vrouwen,
      percMannen: totaal > 0 ? Math.round((mannen / totaal) * 100) : 0,
      percVrouwen: totaal > 0 ? Math.round((vrouwen / totaal) * 100) : 0,
      leeftijdGroepen,
      perWoonplaats,
      perDag,
      fysioAanvragen,
      percFysioVanHoog: hoog > 0 ? Math.round((fysioAanvragen / hoog) * 100) : 0,
      preventieStats,
      risicoStats,
      bereikPercentage,
    };
  }, [supabaseData]);

  // Chart data
  const risicoChartData = stats ? [
    { name: 'Laag risico', value: stats.laag, color: KLEUREN.laag },
    { name: 'Matig risico', value: stats.matig, color: KLEUREN.matig },
    { name: 'Hoog risico', value: stats.hoog, color: KLEUREN.hoog },
  ] : [];

  const geslachtChartData = stats ? [
    { name: 'Man', value: stats.mannen, color: '#3B82F6' },
    { name: 'Vrouw', value: stats.vrouwen, color: '#EC4899' },
  ] : [];

  const leeftijdChartData = stats ? Object.entries(stats.leeftijdGroepen)
    .map(([leeftijd, aantal]) => ({ leeftijd, aantal }))
    .sort((a, b) => a.leeftijd.localeCompare(b.leeftijd)) : [];

  const woonplaatsChartData = stats ? Object.entries(stats.perWoonplaats)
    .map(([naam, data]) => ({ naam, ...data }))
    .sort((a, b) => b.totaal - a.totaal)
    .slice(0, 10) : [];

  const trendChartData = stats ? Object.entries(stats.perDag)
    .map(([dag, aantal]) => ({ dag: dag.slice(5), aantal }))
    .sort((a, b) => a.dag.localeCompare(b.dag))
    .slice(-14) : [];

  const preventieChartData = stats ? [
    { naam: 'Ogen gecontroleerd', ja: stats.preventieStats.p1_ogen.ja, nee: stats.preventieStats.p1_ogen.nee },
    { naam: 'Goede schoenen', ja: stats.preventieStats.p2_schoenen.ja, nee: stats.preventieStats.p2_schoenen.nee },
    { naam: 'Voldoende beweging', ja: stats.preventieStats.p3_beweging.ja, nee: stats.preventieStats.p3_beweging.nee },
    { naam: 'Medicijnen gecontroleerd', ja: stats.preventieStats.p4_medicijnen.ja, nee: stats.preventieStats.p4_medicijnen.nee },
    { naam: 'Gezonde voeding', ja: stats.preventieStats.p5_voeding.ja, nee: stats.preventieStats.p5_voeding.nee },
    { naam: 'Veilige woning', ja: stats.preventieStats.p6_woonomgeving.ja, nee: stats.preventieStats.p6_woonomgeving.nee },
  ].map(item => ({
    ...item,
    percJa: (item.ja + item.nee) > 0 ? Math.round((item.ja / (item.ja + item.nee)) * 100) : 0
  })) : [];

  const risicoVragenData = stats ? [
    { naam: 'Gevallen afgelopen jaar', ...stats.risicoStats.v1_gevallen },
    { naam: 'Bang om te vallen', ...stats.risicoStats.v2_bang_vallen },
    { naam: 'Moeite met bewegen', ...stats.risicoStats.v3_moeite_bewegen },
    { naam: 'Verwondingen bij val', ...stats.risicoStats.v4_verwondingen },
    { naam: 'Vaker gevallen', ...stats.risicoStats.v5_vaker_gevallen },
    { naam: 'Flauwgevallen', ...stats.risicoStats.v6_flauwgevallen },
    { naam: 'Kon niet zelf opstaan', ...stats.risicoStats.v7_zelf_opstaan },
    { naam: 'Moeite met taken', ...stats.risicoStats.v8_taken_zelf },
  ].map(item => ({
    ...item,
    percJa: (item.ja + item.nee) > 0 ? Math.round((item.ja / (item.ja + item.nee)) * 100) : 0
  })) : [];

  // Loading state
  if (loading && !supabaseData.length) {
    return (
      <div style={{ fontFamily: FONT_FAMILY, backgroundColor: KLEUREN.achtergrond, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h2 style={{ color: KLEUREN.primair }}>Data laden...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ fontFamily: FONT_FAMILY, backgroundColor: KLEUREN.achtergrond, minHeight: '100vh', padding: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ color: KLEUREN.hoog }}>Fout bij laden</h2>
            <p style={{ color: KLEUREN.tekstSub }}>{error}</p>
            <button onClick={fetchData} style={{ marginTop: '16px', padding: '12px 24px', backgroundColor: KLEUREN.primair, color: KLEUREN.wit, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
              Opnieuw proberen
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Main render
  return (
    <>
      <FontLoader />
      <div style={{ fontFamily: FONT_FAMILY, backgroundColor: KLEUREN.achtergrond, minHeight: '100vh' }}>
        
        {/* Header */}
        <header style={{ backgroundColor: KLEUREN.wit, borderBottom: `1px solid ${KLEUREN.rand}`, padding: '12px 20px', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={ZLIMTHUIS_LOGO} alt="Zlimthuis" style={{ height: '32px' }} onError={(e) => e.target.style.display = 'none'} />
              <div>
                <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: KLEUREN.tekst }}>Valrisico Dashboard</h1>
                <p style={{ margin: 0, fontSize: '11px', color: KLEUREN.tekstSub }}>
                  Live data • {supabaseData.length} tests
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {lastRefresh && (
                <span style={{ fontSize: '11px', color: KLEUREN.tekstLicht }}>
                  {lastRefresh.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <button onClick={fetchData} disabled={loading} style={{ padding: '6px 12px', backgroundColor: KLEUREN.primair, color: KLEUREN.wit, border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                🔄 Ververs
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          
          {/* Geen data */}
          {(!stats || stats.totaal === 0) && (
            <Card>
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
                <h2 style={{ color: KLEUREN.tekst, marginBottom: '8px' }}>Nog geen testresultaten</h2>
                <p style={{ color: KLEUREN.tekstSub }}>Zodra mensen de valrisicotest invullen, verschijnen de resultaten hier.</p>
              </div>
            </Card>
          )}

          {stats && stats.totaal > 0 && (
            <>
              {/* KPI's */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                <StatCard label="Totaal tests" value={stats.totaal} sublabel={`${stats.bereikPercentage}% bereik gemeente`} color={KLEUREN.primair} />
                <StatCard label="Laag risico" value={stats.laag} sublabel={`${stats.percLaag}%`} color={KLEUREN.laag} />
                <StatCard label="Matig risico" value={stats.matig} sublabel={`${stats.percMatig}%`} color={KLEUREN.matig} />
                <StatCard label="Hoog risico" value={stats.hoog} sublabel={`${stats.percHoog}%`} color={KLEUREN.hoog} />
                <StatCard label="Fysio aanvragen" value={stats.fysioAanvragen} sublabel={`${stats.percFysioVanHoog}% van hoog risico`} color={KLEUREN.primair} />
              </div>

              {/* Charts rij 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                
                {/* Risicoverdeling */}
                <Card title="Risicoverdeling" subtitle="Alle testresultaten">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={risicoChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                        {risicoChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                {/* Geslacht */}
                <Card title="Geslacht" subtitle="Verdeling man/vrouw">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={geslachtChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                        {geslachtChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Charts rij 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '20px' }}>
                
                {/* Leeftijd */}
                {leeftijdChartData.length > 0 && (
                  <Card title="Leeftijdsverdeling" subtitle="Aantal tests per leeftijdscategorie">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={leeftijdChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="leeftijd" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="aantal" fill={KLEUREN.primair} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                )}

                {/* Woonplaats */}
                {woonplaatsChartData.length > 0 && (
                  <Card title="Per woonplaats" subtitle="Top 10 woonplaatsen">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={woonplaatsChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="naam" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="laag" stackId="a" fill={KLEUREN.laag} name="Laag" />
                        <Bar dataKey="matig" stackId="a" fill={KLEUREN.matig} name="Matig" />
                        <Bar dataKey="hoog" stackId="a" fill={KLEUREN.hoog} name="Hoog" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                )}
              </div>

              {/* Trend */}
              {trendChartData.length > 1 && (
                <Card title="Trend" subtitle="Tests per dag (laatste 14 dagen)">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trendChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dag" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="aantal" stroke={KLEUREN.primair} strokeWidth={2} dot={{ fill: KLEUREN.primair }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Risicovragen */}
              <Card title="Risicovragen" subtitle="Percentage 'ja' antwoorden per vraag">
                <div style={{ display: 'grid', gap: '8px' }}>
                  {risicoVragenData.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '180px', fontSize: '13px', color: KLEUREN.tekst }}>{item.naam}</div>
                      <div style={{ flex: 1, height: '20px', backgroundColor: KLEUREN.rand, borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.percJa}%`, height: '100%', backgroundColor: KLEUREN.matig, transition: 'width 0.3s' }} />
                      </div>
                      <div style={{ width: '50px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: KLEUREN.tekst }}>{item.percJa}%</div>
                      <div style={{ width: '60px', fontSize: '11px', color: KLEUREN.tekstLicht }}>({item.ja + item.nee})</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Preventie */}
              <Card title="Preventie" subtitle="Percentage 'ja' antwoorden per preventievraag">
                <div style={{ display: 'grid', gap: '8px' }}>
                  {preventieChartData.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '180px', fontSize: '13px', color: KLEUREN.tekst }}>{item.naam}</div>
                      <div style={{ flex: 1, height: '20px', backgroundColor: KLEUREN.rand, borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.percJa}%`, height: '100%', backgroundColor: KLEUREN.laag, transition: 'width 0.3s' }} />
                      </div>
                      <div style={{ width: '50px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: KLEUREN.tekst }}>{item.percJa}%</div>
                      <div style={{ width: '60px', fontSize: '11px', color: KLEUREN.tekstLicht }}>({item.ja + item.nee})</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recente tests tabel */}
              <Card title="Recente tests" subtitle="Laatste 10 ingevulde tests">
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${KLEUREN.rand}` }}>
                        <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: KLEUREN.tekstSub }}>Datum</th>
                        <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: KLEUREN.tekstSub }}>Woonplaats</th>
                        <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: KLEUREN.tekstSub }}>Leeftijd</th>
                        <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: KLEUREN.tekstSub }}>Geslacht</th>
                        <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: KLEUREN.tekstSub }}>Risico</th>
                        <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: KLEUREN.tekstSub }}>Fysio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supabaseData.slice(0, 10).map((test, i) => (
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
                          <td style={{ padding: '10px 8px' }}>{test.fysio_contact_aangevraagd ? '✅' : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Info over buiten gemeente */}
              {stats.testsBuitenGemeente > 0 && (
                <Card>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', backgroundColor: KLEUREN.primairLicht, borderRadius: '8px' }}>
                    <span style={{ fontSize: '20px' }}>ℹ️</span>
                    <div>
                      <strong style={{ color: KLEUREN.primair }}>{stats.testsBuitenGemeente} tests van buiten gemeente</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: KLEUREN.tekstSub }}>
                        Deze tellen mee in de totalen maar niet in het bereikpercentage.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer style={{ backgroundColor: KLEUREN.wit, borderTop: `1px solid ${KLEUREN.rand}`, padding: '16px', textAlign: 'center', marginTop: '20px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: KLEUREN.tekstSub }}>
            Valrisico Dashboard • Gemeente Oude IJsselstreek • Gebaseerd op VeiligheidNL Valrisicotest
          </p>
        </footer>
      </div>
    </>
  );
}
