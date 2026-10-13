"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, BusFront, CalendarDays,
  CheckCircle2, ChevronDown, CircleHelp, Clock3, Gauge, GraduationCap,
  LayoutDashboard, MapPinned, Menu, MoreHorizontal, Navigation, Route,
  Search, Settings2, ShieldCheck, Users, Wifi, X
} from "lucide-react";

type Bus = {
  id: string; driver: string; route: string; status: "On route" | "At stop" | "Delayed";
  speed: number; updated: string; position: [number, number]; color: string;
};

const seedBuses: Bus[] = [
  { id: "BUS-014", driver: "Ravi Kumar", route: "Miyapur · Campus", status: "On route", speed: 34, updated: "Just now", position: [17.4933, 78.3915], color: "#3568e8" },
  { id: "BUS-022", driver: "Suresh Reddy", route: "Kukatpally · Campus", status: "On route", speed: 28, updated: "12 sec ago", position: [17.4849, 78.4071], color: "#16a37b" },
  { id: "BUS-008", driver: "Anil Sharma", route: "Hitech City · Campus", status: "At stop", speed: 0, updated: "18 sec ago", position: [17.4486, 78.3908], color: "#9a6bea" },
  { id: "BUS-031", driver: "Mohammed Imran", route: "Bachupally · Campus", status: "Delayed", speed: 16, updated: "34 sec ago", position: [17.5449, 78.3862], color: "#e59a31" },
  { id: "BUS-019", driver: "Priya Nair", route: "Gachibowli · Campus", status: "On route", speed: 31, updated: "7 sec ago", position: [17.4401, 78.3489], color: "#e56878" }
];

const LiveMap = dynamic(() => import("../components/live-map"), {
  ssr: false,
  loading: () => <div className="map-loading"><div className="loading-pulse" />Loading live map…</div>
});

const navGroups = [
  { label: "WORKSPACE", items: [{ label: "Overview", icon: LayoutDashboard }, { label: "Live tracking", icon: MapPinned }, { label: "Routes & stops", icon: Route }, { label: "Fleet", icon: BusFront }] },
  { label: "MANAGEMENT", items: [{ label: "Students", icon: GraduationCap }, { label: "Drivers", icon: Users }, { label: "Trip schedule", icon: CalendarDays }] }
];

export default function DashboardPage() {
  const [buses, setBuses] = useState(seedBuses);
  const [activeNav, setActiveNav] = useState("Overview");
  const [query, setQuery] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState("");
  const [lastUpdated, setLastUpdated] = useState("just now");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBuses(current => current.map(bus => ({
        ...bus,
        position: [bus.position[0] + (Math.random() - 0.5) * 0.0012, bus.position[1] + (Math.random() - 0.5) * 0.0012] as [number, number],
        speed: bus.status === "At stop" ? 0 : Math.max(12, Math.min(48, bus.speed + Math.round((Math.random() - 0.5) * 6))),
        updated: "Just now"
      })));
      setLastUpdated("just now");
    }, 8000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredBuses = useMemo(() => buses.filter(bus =>
    [bus.id, bus.driver, bus.route, bus.status].join(" ").toLowerCase().includes(query.toLowerCase())
  ), [buses, query]);

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  return (
    <main className="app-shell">
      {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark"><Navigation size={21} strokeWidth={2.6} /></div>
          <div className="brand-name">ROUTE<span>-IQ</span><small>TRANSPORT INTELLIGENCE</small></div>
          <button className="icon-button mobile-close" aria-label="Close menu" onClick={() => setMobileNav(false)}><X size={18} /></button>
        </div>
        <button className="org-switcher" onClick={() => notify("Organization switching will be available after authentication is integrated.")}>
          <div className="org-avatar">A</div><div className="org-copy"><strong>Atlas Academy</strong><span>School transport</span></div><ChevronDown size={15} />
        </button>
        <div className="nav-scroll">
          {navGroups.map(group => <div className="nav-group" key={group.label}>
            <p className="nav-caption">{group.label}</p>
            {group.items.map(item => {
              const Icon = item.icon;
              return <button key={item.label} className={`nav-item ${activeNav === item.label ? "nav-item-active" : ""}`} onClick={() => { setActiveNav(item.label); setMobileNav(false); if (item.label !== "Overview" && item.label !== "Live tracking") notify(`${item.label} workspace is part of the next build stage.`); }}>
                <Icon size={18} strokeWidth={1.8} /><span>{item.label}</span>{item.label === "Live tracking" && <span className="nav-live-dot" />}
              </button>;
            })}
          </div>)}
        </div>
        <div className="sidebar-bottom">
          <div className="support-card"><div className="support-icon"><CircleHelp size={17} /></div><div><strong>Need a hand?</strong><span>Visit the help centre</span></div><ArrowUpRight size={15} /></div>
          <button className="profile-row" onClick={() => notify("Account and role-based access will be enabled with Supabase Auth.")}>
            <div className="profile-avatar">AD</div><div className="profile-copy"><strong>Academy Admin</strong><span>Administrator · Demo</span></div><MoreHorizontal size={18} />
          </button>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="icon-button menu-toggle" aria-label="Open menu" onClick={() => setMobileNav(true)}><Menu size={20} /></button><div className="breadcrumb">Workspace <span>/</span> <strong>{activeNav}</strong></div></div>
          <div className="topbar-right"><div className="system-status"><span /> All systems operational</div><button className="icon-button top-icon" aria-label="Search" onClick={() => document.getElementById("bus-search")?.focus()}><Search size={18} /></button><button className="icon-button top-icon notification-button" aria-label="Notifications" onClick={() => notify("You're all caught up — no new alerts.")}><Bell size={18} /><i /></button><div className="top-divider" /><div className="date-chip"><CalendarDays size={15} /> Tue, 14 Oct</div></div>
        </header>

        <div className="page-content">
          <div className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-dot" /> TUESDAY OPERATIONS</div><h1>Good afternoon, Admin <span>✦</span></h1><p>Here&apos;s what&apos;s happening across your transport network today.</p></div><button className="date-range" onClick={() => notify("Date filters will be added with trip history.")}><CalendarDays size={16} /> Today <ChevronDown size={14} /></button></div>

          <div className="demo-banner"><div className="demo-banner-icon"><Activity size={17} /></div><div><strong>Demo environment</strong><span>Bus positions are simulated for preview. Live GPS and secure accounts are not connected yet.</span></div><span className="demo-pill">SIMULATED DATA</span></div>

          <section className="stats-grid" aria-label="Fleet summary">
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Total fleet</span><span className="stat-icon blue"><BusFront size={18} /></span></div><div className="stat-value">24 <span className="stat-unit">buses</span></div><div className="stat-foot"><span className="trend positive"><ArrowUpRight size={13} /> 2 added</span><span>from last term</span></div><div className="stat-bar"><i style={{width:"78%", background:"#4778ef"}} /></div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Currently active</span><span className="stat-icon green"><Navigation size={18} /></span></div><div className="stat-value">18 <span className="stat-unit">buses</span></div><div className="stat-foot"><span className="trend positive"><span className="mini-dot green-dot" /> 75% of fleet</span><span>on the road</span></div><div className="stat-bar"><i style={{width:"75%", background:"#18a77b"}} /></div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Students onboard</span><span className="stat-icon violet"><GraduationCap size={18} /></span></div><div className="stat-value">486 <span className="stat-unit">students</span></div><div className="stat-foot"><span className="trend neutral"><Users size={13} /> 21 routes</span><span>scheduled today</span></div><div className="stat-bar"><i style={{width:"66%", background:"#9670eb"}} /></div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Needs attention</span><span className="stat-icon amber"><Clock3 size={18} /></span></div><div className="stat-value">03 <span className="stat-unit">alerts</span></div><div className="stat-foot"><span className="trend warning"><span className="mini-dot amber-dot" /> 1 delayed</span><span>2 pending checks</span></div><div className="stat-bar"><i style={{width:"24%", background:"#e8a23d"}} /></div></article>
          </section>

          <section className="tracking-layout">
            <div className="panel map-panel">
              <div className="panel-heading"><div><div className="heading-title"><h2>Live fleet map</h2><span className="live-tag"><i /> LIVE DEMO</span></div><p>Monitor vehicle positions across your service area</p></div><button className="panel-action" onClick={() => notify("Map view is showing all demo vehicles.")}> <MapPinned size={15} /> Full map <ArrowUpRight size={14} /></button></div>
              <div className="map-wrap"><LiveMap buses={buses} /></div>
              <div className="map-footer"><div className="map-legend"><span><i className="legend-dot moving" /> Moving</span><span><i className="legend-dot stopped" /> At stop</span><span><i className="legend-dot delayed" /> Delayed</span></div><span className="map-updated"><Wifi size={13} /> Updated {lastUpdated}</span></div>
            </div>

            <div className="panel fleet-panel">
              <div className="panel-heading fleet-heading"><div><div className="heading-title"><h2>Active vehicles</h2><span className="count-badge">{filteredBuses.length}</span></div><p>Live status and driver details</p></div><button className="more-button" aria-label="More vehicle options" onClick={() => notify("Vehicle management will be available in the admin module.")}><MoreHorizontal size={19} /></button></div>
              <div className="fleet-search"><Search size={16} /><input id="bus-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search bus, driver or route…" /><kbd>⌘ K</kbd></div>
              <div className="fleet-list">{filteredBuses.map(bus => <button key={bus.id} className="vehicle-row" onClick={() => notify(`${bus.id} · ${bus.route} · ${bus.speed} km/h (simulated)`)}>
                <div className="vehicle-icon" style={{"--vehicle-color":bus.color} as React.CSSProperties}><BusFront size={18} /></div>
                <div className="vehicle-main"><div className="vehicle-title"><strong>{bus.id}</strong><span className={`status-label ${bus.status.toLowerCase().replace(" ","-")}`}><i />{bus.status}</span></div><span className="vehicle-route">{bus.route}</span><span className="vehicle-driver">{bus.driver} <span>·</span> {bus.updated}</span></div>
                <div className="vehicle-speed"><strong>{bus.speed}</strong><span>km/h</span></div>
              </button>)}
              {filteredBuses.length === 0 && <div className="empty-state">No vehicles match “{query}”.</div>}</div>
              <button className="view-fleet-button" onClick={() => { setActiveNav("Fleet"); notify("Full fleet management is coming in the next build stage."); }}>View all vehicles <ArrowUpRight size={15} /></button>
            </div>
          </section>

          <section className="bottom-grid">
            <div className="panel route-panel"><div className="panel-heading"><div><div className="heading-title"><h2>Route performance</h2></div><p>Today&apos;s service overview</p></div><button className="text-action" onClick={() => notify("Route analytics will be added after the database stage.")}>View report <ArrowUpRight size={14} /></button></div>
              <div className="route-metrics"><div><span className="metric-label">On-time arrivals</span><strong>94.2<span>%</span></strong><div className="metric-track"><i style={{width:"94.2%"}} /></div><small><CheckCircle2 size={12} /> Above 90% target</small></div><div><span className="metric-label">Avg. trip duration</span><strong>32 <span>min</span></strong><div className="metric-track"><i className="purple-track" style={{width:"68%"}} /></div><small><Clock3 size={12} /> Across 21 routes</small></div></div>
            </div>
            <div className="panel activity-panel"><div className="panel-heading"><div><div className="heading-title"><h2>Recent activity</h2></div><p>Latest transport events</p></div><button className="more-button" aria-label="More activity options" onClick={() => notify("Activity history will be connected to Supabase later.")}><MoreHorizontal size={19} /></button></div>
              <div className="activity-list"><div className="activity-item"><span className="activity-symbol green"><CheckCircle2 size={15} /></span><div><strong>Trip started</strong><p>BUS-014 · Miyapur route</p></div><time>2m ago</time></div><div className="activity-item"><span className="activity-symbol amber"><Clock3 size={15} /></span><div><strong>Delay detected</strong><p>BUS-031 · 8 min behind schedule</p></div><time>6m ago</time></div><div className="activity-item"><span className="activity-symbol blue"><ShieldCheck size={15} /></span><div><strong>Vehicle check complete</strong><p>BUS-008 · Safety checklist</p></div><time>14m ago</time></div></div>
            </div>
          </section>
          <footer className="page-footer"><span>© 2026 ROUTE-IQ Transport Intelligence</span><span><span className="footer-status" /> Demo mode <span className="footer-separator">·</span> Built for safer journeys</span></footer>
        </div>
      </section>
      {notice && <div className="toast"><CheckCircle2 size={17} />{notice}</div>}
    </main>
  );
}