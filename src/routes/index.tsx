import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Film, Library, Search, Sparkles, Waves, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { acts, chapterSlug, chapters, type Chapter } from '@/lib/exodus-chapters';
import cover from '@/assets/exodus-cover.jpg';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'EXODUS — From bondage to freedom' },
    { name: 'description', content: 'Explore the story of Exodus: Hebrew slavery in Egypt, the ten plagues, Passover, and the journey through the sea. Twelve chapters grounded in the Old Testament.' },
    { property: 'og:title', content: 'EXODUS — From bondage to freedom' },
    { property: 'og:description', content: 'A cinematic journey through twelve chapters of the biblical Exodus.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  const [filter, setFilter] = useState<string>('All chapters');
  const [search, setSearch] = useState('');
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [about, setAbout] = useState(false);
  const [read, setRead] = useState<number[]>([]);
  const [expanded, setExpanded] = useState(false);
  const library = useRef<HTMLElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const modalOpen = chapter !== null || about;
  useEffect(() => {
    if (!modalOpen) return;
    lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButton.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setChapter(null); setAbout(false); }
      if (e.key === 'Tab') {
        const elements = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"] button:not([disabled]), [role="dialog"] a[href]'));
        const first = elements[0]; const last = elements.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handler);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handler); lastFocus.current?.focus(); };
  }, [modalOpen]);
  const openChapter = (item: Chapter | undefined) => { if (!item) return; setChapter(item); setRead(current => current.includes(item.id) ? current : [...current, item.id]); };
  const showLibrary = () => library.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  const filtered = chapters.filter(item => (filter === 'All chapters' || item.act === filter) && `${item.title} ${item.reference} ${item.description}`.toLowerCase().includes(search.toLowerCase()));
  const displayed = filter === 'All chapters' && !search && !expanded ? [chapters[0], chapters[1], chapters[11]].filter((item): item is Chapter => Boolean(item)) : filtered;
  return (
    <>
      <header className="site-header">
        <a href="/" className="brand" aria-label="Exodus home"><Waves strokeWidth={1.5} /><div><div className="brand-name">EXODUS</div><div className="brand-sub">THE STORY OF DELIVERANCE</div></div></a>
        <nav className="nav-links" aria-label="Main navigation"><a href="#chapters" className="active" onClick={e => { e.preventDefault(); showLibrary(); }}>The journey</a><a href="#scripture" onClick={e => { e.preventDefault(); openChapter(chapters[0]); }}>Scripture</a><a href="#about" onClick={e => { e.preventDefault(); setAbout(true); }}>About</a></nav>
        <div className="header-note"><BookOpen size={13} /> BASED ON THE BOOK OF EXODUS</div>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <img src={cover} width={1920} height={1088} alt="The Israelites walking between the parted waters of the sea" className="hero-image" fetchPriority="high" />
          <div className="hero-content">
            <div className="eyebrow"><span className="eyebrow-line" /> AN ANCIENT STORY. AN ENDURING HOPE.</div>
            <h1 id="hero-title">EXODUS<br /><em>From bondage<br />to freedom.</em></h1>
            <p className="hero-description">A people enslaved. Ten plagues. A sea divided.<br />Journey through the story of Israel’s deliverance.</p>
            <div className="hero-actions"><Button size="lg" onClick={() => openChapter(chapters[0])}><BookOpen /> Begin the journey</Button><Button variant="cinema" size="lg" onClick={showLibrary}><Library /> Explore chapters</Button></div>
            <div className="hero-meta"><span><Film /> 12 chapters</span><span>·</span><span><BookOpen /> Exodus 1–14</span><span>·</span><span>Scripture-inspired</span></div>
          </div>
          <div className="hero-verse"><p>“Let my people go.”</p><span>EXODUS 9:1</span></div>
        </section>
        <section id="chapters" className="library" ref={library}>
          <div className="section-title"><div><h2>The journey unfolds</h2><p>From the weight of slavery to the wonder of deliverance.</p></div><div className="chapter-count"><Film size={14} /> 3 acts <span>·</span> 12 chapters</div></div>
          <div className="filter-bar"><div className="filters" aria-label="Filter chapters">{acts.map(act => <Button key={act} size="sm" variant="ghost" className={filter === act ? 'filter-selected' : 'text-muted-foreground'} aria-pressed={filter === act} onClick={() => { setFilter(act); }}>{act}{act === 'The plagues' && <span className="text-muted-foreground text-[10px]">10</span>}</Button>)}</div><label className="library-search"><Search size={14} /><input aria-label="Search chapters" placeholder="Search chapters" value={search} onChange={e => setSearch(e.target.value)} /></label></div>
          <div className="chapter-grid">{displayed.map(item => <article className="chapter-card" key={item.id}>
            <div className="chapter-image-wrap"><img className="chapter-image" src={item.image} alt={item.act === 'Bondage' ? 'Hebrew workers hauling a heavy block of stone under an Egyptian overseer' : item.act === 'Deliverance' ? 'Israelites crossing the parted sea' : `${item.title}: artistic interpretation of the plagues of Egypt`} width={1536} height={1024} loading="lazy" /><span className="chapter-label">ACT {item.act === 'Bondage' ? 'I' : item.act === 'The plagues' ? 'II' : 'III'} · {item.act.toUpperCase()}</span><span className="chapter-image-title">{item.act === 'Bondage' ? 'The bondage' : item.act === 'The plagues' ? 'The ten plagues' : 'The exodus'}</span><Button size="icon" variant="cinema" className="chapter-open" aria-label={`Open ${item.title}`} onClick={() => openChapter(item)}><ArrowRight /></Button></div>
            <div className="chapter-details"><div className="chapter-topline"><h3>{String(item.id).padStart(2, '0')} · {item.title}</h3>{read.includes(item.id) ? <Check size={14} aria-label="Read" /> : <ChevronRight size={14} />}</div><p>{item.description.split('. ')[0]}.</p><div className="chapter-reference"><BookOpen size={12} />{item.reference}<span className="availability">Film unavailable</span></div></div>
          </article>)}</div>
          {displayed.length === 0 && <p className="py-10 text-center text-muted-foreground">No chapters found.</p>}
          {filter === 'All chapters' && !search && <div className="flex justify-center mt-8"><Button variant="ghost" className="text-muted-foreground" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show the three acts' : 'View all 12 chapters'}<ArrowDown className={expanded ? 'rotate-180' : ''} /></Button></div>}
        </section>
        <section id="scripture" className="scripture-band"><div><blockquote>“The LORD shall fight for you, and ye shall hold your peace.”</blockquote><span>EXODUS 14:14</span></div><Button variant="cinema" onClick={() => openChapter(chapters[11])}><BookOpen /> Read the scripture <ArrowRight /></Button></section>
      </main>
      <footer><span>EXODUS <span className="mx-3">/</span> An ancient story. An enduring hope.</span><span>Images: AI-generated artistic interpretations</span></footer>
      {modalOpen && <div className="reader-overlay" onClick={e => { if (e.target === e.currentTarget) { setChapter(null); setAbout(false); } }}><section className="reader" role="dialog" aria-modal="true" aria-labelledby="reader-title">
        {chapter ? <><div className="reader-cover"><img src={chapter.image} alt="Biblical artistic interpretation" width={1536} height={1024} /><Button ref={closeButton} className="reader-close" size="icon" variant="cinema" aria-label="Close chapter" onClick={() => setChapter(null)}><X /></Button></div><div className="reader-body"><div className="eyebrow">CHAPTER {String(chapter.id).padStart(2,'0')} · {chapter.act}</div><h2 id="reader-title">{chapter.title}</h2><div className="reader-reference">{chapter.reference}</div><p className="reader-description">{chapter.description}</p><blockquote className="reader-quote">“{chapter.verse}”</blockquote>{chapter.video ? <video controls src={chapter.video} className="w-full mt-6" /> : <div className="reader-status"><Film size={16} /><span>Video unavailable — generation is awaiting workspace credits.</span></div>}{chapter.act === 'The plagues' && <Link to="/plagues/$slug" params={{ slug: chapterSlug(chapter) }} className="inline-block mt-4 text-sm text-primary">Open this plague’s page <ArrowRight className="inline" size={14} /></Link>}<div className="reader-pagination"><Button variant="ghost" disabled={chapter.id === 1} onClick={() => { const previous = chapters[chapter.id - 2]; if (previous) openChapter(previous); }}><ArrowLeft /> {chapter.act === 'The plagues' && chapters[chapter.id - 2]?.act === 'The plagues' ? 'Previous plague' : 'Previous'}</Button><Button variant="outline" disabled={chapter.id === 12} onClick={() => { const next = chapters[chapter.id]; if (next) openChapter(next); }}>{chapter.act === 'The plagues' && chapters[chapter.id]?.act === 'The plagues' ? 'Next plague' : 'Next chapter'} <ArrowRight /></Button></div></div></> : <div className="about-body"><div className="flex justify-between"><div className="eyebrow"><Sparkles size={14} /> THE STORY OF DELIVERANCE</div><Button ref={closeButton} variant="ghost" size="icon" aria-label="Close about" onClick={() => setAbout(false)}><X /></Button></div><h2 id="reader-title">An ancient story.<br />An enduring hope.</h2><p>EXODUS follows the Old Testament account of Hebrew slavery in Egypt, the ten plagues, the first Passover, and Israel’s departure and crossing of the sea.</p><p>The twelve chapters follow Exodus 1–14. Chapter descriptions are summaries, not scripture quotations.</p><p>Images are AI-generated artistic interpretations, not historical footage. Generated videos are currently unavailable. Themes include enslavement, suffering, and death.</p><Button onClick={() => { setAbout(false); openChapter(chapters[0]); }}><BookOpen /> Begin the journey</Button></div>}
      </section></div>}
    </>
  );
}
