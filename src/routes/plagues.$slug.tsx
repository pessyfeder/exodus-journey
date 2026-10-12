import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, BookOpen, Film, Waves } from 'lucide-react';
import { chapterSlug, plagueChapters } from '@/lib/exodus-chapters';

export const Route = createFileRoute('/plagues/$slug')({
  loader: ({ params }) => {
    const index = plagueChapters.findIndex(item => chapterSlug(item) === params.slug);
    const plague = plagueChapters[index];
    if (!plague) throw notFound();
    return { plague, number: index + 1, previous: plagueChapters[index - 1], next: plagueChapters[index + 1] };
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.plague.title ?? 'The plagues'} — EXODUS` },
    { name: 'description', content: loaderData?.plague.description ?? 'The plagues of Egypt.' },
  ] }),
  component: PlaguePage,
});

function PlaguePage() {
  const { plague, number, previous, next } = Route.useLoaderData();
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Exodus home"><Waves strokeWidth={1.5} /><div><div className="brand-name">EXODUS</div><div className="brand-sub">THE STORY OF DELIVERANCE</div></div></Link>
        <div className="header-note"><BookOpen size={13} /> {plague.reference.toUpperCase()}</div>
      </header>
      <main className="mx-auto max-w-[830px] px-5 py-10">
        <div className="reader" style={{ border: 0 }}>
          <div className="reader-cover"><img src={plague.image} alt={`${plague.title}: artistic interpretation`} width={1536} height={1024} /></div>
          <div className="reader-body">
            <div className="eyebrow">PLAGUE {number} OF {plagueChapters.length} · {plague.act}</div>
            <h1 className="text-[43px] leading-tight" style={{ fontFamily: 'var(--font-display)', margin: '14px 0' }}>{plague.title}</h1>
            <div className="reader-reference">{plague.reference}</div>
            <p className="reader-description">{plague.description}</p>
            <blockquote className="reader-quote">“{plague.verse}”</blockquote>
            {plague.video ? <video controls src={plague.video} className="w-full mt-6" /> : <div className="reader-status"><Film size={16} /><span>Video unavailable — generation is awaiting workspace credits.</span></div>}
            <div className="reader-pagination">
              {previous ? <Link to="/plagues/$slug" params={{ slug: chapterSlug(previous) }} className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft size={16} /> {previous.title}</Link> : <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft size={16} /> All chapters</Link>}
              {next ? <Link to="/plagues/$slug" params={{ slug: chapterSlug(next) }} className="inline-flex items-center gap-2 text-sm">{next.title} <ArrowRight size={16} /></Link> : <Link to="/" className="inline-flex items-center gap-2 text-sm">Back to the journey <ArrowRight size={16} /></Link>}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
