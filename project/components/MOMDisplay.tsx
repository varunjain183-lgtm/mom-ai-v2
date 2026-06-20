'use client';

import { CheckCircle, AlertTriangle, ArrowRight, MessageSquare, Lightbulb, Target, Users } from 'lucide-react';

interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
}

interface MOMData {
  summary: string;
  discussionPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  risks: string[];
  nextSteps: string[];
}

interface MOMDisplayProps {
  mom: MOMData;
  generatedAt: string;
}

export default function MOMDisplay({ mom, generatedAt }: MOMDisplayProps) {
  return (
    <div id="mom-content" className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-blue-200 animate-pulse" />
          <span className="text-blue-100 text-xs font-medium uppercase tracking-widest">Minutes of Meeting</span>
        </div>
        <h2 className="text-2xl font-bold">Meeting Summary</h2>
        <p className="text-blue-100 text-sm mt-1">Generated on {generatedAt}</p>
      </div>

      {/* Summary */}
      <Section icon={<MessageSquare className="w-5 h-5 text-blue-600" />} title="Summary" color="blue">
        <p className="text-slate-700 leading-relaxed text-sm">{mom.summary}</p>
      </Section>

      {/* Discussion Points */}
      {mom.discussionPoints.length > 0 && (
        <Section icon={<Users className="w-5 h-5 text-slate-600" />} title="Discussion Points" color="slate">
          <ul className="space-y-2">
            {mom.discussionPoints.map((point, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center font-semibold mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Decisions */}
      {mom.decisions.length > 0 && (
        <Section icon={<CheckCircle className="w-5 h-5 text-emerald-600" />} title="Decisions Made" color="emerald">
          <ul className="space-y-2">
            {mom.decisions.map((decision, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700">
                <CheckCircle className="flex-shrink-0 w-4 h-4 text-emerald-500 mt-0.5" />
                <span className="leading-relaxed">{decision}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Action Items */}
      {mom.actionItems.length > 0 && (
        <Section icon={<Target className="w-5 h-5 text-blue-600" />} title="Action Items" color="blue">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 pr-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Task</th>
                  <th className="text-left py-2 pr-4 font-semibold text-slate-500 text-xs uppercase tracking-wide">Owner</th>
                  <th className="text-left py-2 font-semibold text-slate-500 text-xs uppercase tracking-wide">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mom.actionItems.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4 text-slate-700 leading-relaxed">{item.task}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {item.owner}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 text-xs font-medium">{item.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Risks */}
      {mom.risks.length > 0 && (
        <Section icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} title="Risks & Concerns" color="amber">
          <ul className="space-y-2">
            {mom.risks.map((risk, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700">
                <AlertTriangle className="flex-shrink-0 w-4 h-4 text-amber-500 mt-0.5" />
                <span className="leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Next Steps */}
      {mom.nextSteps.length > 0 && (
        <Section icon={<ArrowRight className="w-5 h-5 text-blue-600" />} title="Next Steps" color="blue">
          <ul className="space-y-2">
            {mom.nextSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-slate-400">
          Generated by <span className="font-semibold text-slate-500">ROCK — MOM AI</span> by Varun Jain
        </p>
      </div>
    </div>
  );
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    headerBg: 'bg-blue-50/50',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    headerBg: 'bg-emerald-50/50',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    headerBg: 'bg-amber-50/50',
  },
  slate: {
    bg: 'bg-slate-50',
    border: 'border-slate-100',
    headerBg: 'bg-slate-50/50',
  },
};

function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: 'blue' | 'emerald' | 'amber' | 'slate';
  children: React.ReactNode;
}) {
  const c = colorMap[color];
  return (
    <div className={`rounded-2xl border ${c.border} overflow-hidden`}>
      <div className={`flex items-center gap-2.5 px-5 py-3.5 ${c.headerBg} border-b ${c.border}`}>
        {icon}
        <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
