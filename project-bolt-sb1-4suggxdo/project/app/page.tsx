'use client';

import { useState } from 'react';
import { FileText, Sparkles, ChevronRight, Users, Calendar, ClipboardList, MessageSquare, CheckCircle2, Zap, Clock, AlertCircle, Loader2 } from 'lucide-react';

function TestApiButton() {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: 'test' }),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse('Error: ' + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {response && (
        <pre className="bg-slate-900 text-emerald-400 text-xs rounded-xl px-4 py-3 shadow-xl max-w-xs w-full overflow-auto">
          {response}
        </pre>
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg transition-all disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Test API
      </button>
    </div>
  );
}

interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
}

interface MOMOutput {
  title: string;
  date: string;
  attendees: string[];
  agenda: string[];
  discussion_points: string[];
  decisions: string[];
  action_items: ActionItem[];
  next_meeting: string;
}

const PLACEHOLDER = `Example:
Date: June 21, 2026
Attendees: Sarah Johnson, Mike Chen, Priya Patel, David Lee

Agenda:
- Q3 product roadmap review
- Budget approval for new tooling
- Team expansion discussion

Discussion:
Sarah mentioned the new feature rollout is delayed by two weeks due to API dependency issues.
Mike raised concerns about the current CI/CD pipeline performance.
Priya suggested adopting a new monitoring tool to improve visibility.
David noted that the hiring pipeline has 3 candidates in final rounds.

Decisions:
- Agreed to postpone feature launch to July 15
- Approved $8,000 budget for observability tooling
- Decided to open 2 more engineering positions

Action Items:
- Sarah will update the roadmap document by June 25
- Mike should evaluate and shortlist monitoring tools by next Friday
- David needs to finalize job descriptions by end of week

Next Meeting: July 2, 2026`;

export default function Home() {
  const [notes, setNotes] = useState('');
  const [mom, setMom] = useState<MOMOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!notes.trim()) {
      setError('Please enter your meeting notes before generating.');
      return;
    }
    setError('');
    setLoading(true);
    setMom(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setMom(data as MOMOutput);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 shadow-sm">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 leading-tight">MOM Generator</h1>
            <p className="text-xs text-slate-500 leading-tight">Minutes of Meeting</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            Instant structured minutes from raw notes
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Transform meeting notes into<br />
            <span className="text-blue-600">professional minutes</span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Paste your raw notes below and get a clean, structured Minutes of Meeting document — complete with attendees, decisions, and action items.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">Meeting Notes</span>
            </div>
            <span className="text-xs text-slate-400">{notes.length} characters</span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              if (error) setError('');
            }}
            placeholder={PLACEHOLDER}
            className="w-full px-6 py-5 text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none bg-transparent leading-relaxed"
            rows={16}
            spellCheck={false}
          />
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
            {error ? (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Include attendees, discussion points, decisions, and action items for the best results.</p>
            )}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-150 shadow-sm hover:shadow-md flex-shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate MOM
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        {mom && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* MOM Header Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-1">Minutes of Meeting</p>
                  <h3 className="text-xl font-bold leading-tight">{mom.title}</h3>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 text-sm flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                  <span>{mom.date}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Attendees */}
              <Section icon={<Users className="w-4 h-4 text-blue-600" />} title="Attendees" color="blue">
                {mom.attendees.map((a, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-1.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {a.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-slate-700">{a}</span>
                  </div>
                ))}
              </Section>

              {/* Agenda */}
              <Section icon={<ClipboardList className="w-4 h-4 text-emerald-600" />} title="Agenda" color="emerald">
                <BulletList items={mom.agenda} color="emerald" />
              </Section>
            </div>

            {/* Discussion Points */}
            <Section icon={<MessageSquare className="w-4 h-4 text-amber-600" />} title="Discussion Points" color="amber" fullWidth>
              <BulletList items={mom.discussion_points} color="amber" />
            </Section>

            {/* Decisions */}
            <Section icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />} title="Decisions Made" color="emerald" fullWidth>
              <BulletList items={mom.decisions} color="emerald" checked />
            </Section>

            {/* Action Items */}
            <Section icon={<Zap className="w-4 h-4 text-orange-600" />} title="Action Items" color="orange" fullWidth>
              <div className="space-y-2 mt-1">
                {mom.action_items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-orange-50/60 rounded-xl px-4 py-3 border border-orange-100">
                    <div className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 font-medium leading-snug">{item.task}</p>
                      <div className="flex flex-wrap gap-3 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Users className="w-3 h-3" />
                          {item.owner}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {item.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Next Meeting */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0">
                <Calendar className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Next Meeting</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{mom.next_meeting}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-xs text-slate-400">
        MOM Generator &mdash; Structured minutes from raw notes
      </footer>
    </div>
    <TestApiButton />
    </>
  );
}

function Section({
  icon,
  title,
  color,
  children,
  fullWidth,
}: {
  icon: React.ReactNode;
  title: string;
  color: 'blue' | 'emerald' | 'amber' | 'orange';
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  const borderColors = {
    blue: 'border-blue-100',
    emerald: 'border-emerald-100',
    amber: 'border-amber-100',
    orange: 'border-orange-100',
  };
  const headerBg = {
    blue: 'bg-blue-50/60',
    emerald: 'bg-emerald-50/60',
    amber: 'bg-amber-50/60',
    orange: 'bg-orange-50/60',
  };

  return (
    <div className={`bg-white rounded-2xl border ${borderColors[color]} shadow-sm overflow-hidden${fullWidth ? '' : ''}`}>
      <div className={`flex items-center gap-2 px-5 py-3.5 border-b ${borderColors[color]} ${headerBg[color]}`}>
        {icon}
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function BulletList({
  items,
  color,
  checked,
}: {
  items: string[];
  color: 'blue' | 'emerald' | 'amber' | 'orange';
  checked?: boolean;
}) {
  const dotColors = {
    blue: 'bg-blue-400',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-400',
    orange: 'bg-orange-400',
  };

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
          {checked ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          ) : (
            <span className={`w-1.5 h-1.5 rounded-full ${dotColors[color]} flex-shrink-0 mt-2`} />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
