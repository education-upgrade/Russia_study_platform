'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AssignmentActivityProgressBridge from './AssignmentActivityProgressBridge';
import LessonContentActivity, { type LessonSection } from './LessonContentActivity';
import FlashcardActivity from './FlashcardActivity';
import QuizActivity from './QuizActivity';
import PeelResponseActivity from './PeelResponseActivity';
import ConfidenceExitTicketActivity from './ConfidenceExitTicketActivity';
import TimelineActivity from './TimelineActivity';
import CardSortActivity from './CardSortActivity';
import JudgementRankingActivity from './JudgementRankingActivity';
import AO3InterpretationActivity from './AO3InterpretationActivity';
import ComingSoonActivityRenderer from './ComingSoonActivityRenderer';
import {
  normaliseRendererContent,
  type AdaptiveRendererSupport,
  type AO3InterpretationContent,
  type CardSortContent,
  type ConfidenceExitTicketContent,
  type FlashcardContent,
  type JudgementRankingContent,
  type PeelResponseContent,
  type QuizContent,
  type TimelineContent,
} from '@/lib/activityRendererContracts';

type Props = {
  activityId: string;
  activityType: string;
  content: any;
  routeBase: string;
  pathwayTitle: string;
  nextHref?: string;
  fallbackContent?: Record<string, any>;
  adaptiveSupport?: AdaptiveRendererSupport;
};

function isLessonSection(value: unknown): value is LessonSection {
  if (!value || typeof value !== 'object') return false;
  const section = value as Record<string, unknown>;
  return typeof section.heading === 'string'
    && typeof section.body === 'string'
    && (section.question === undefined || typeof section.question === 'string')
    && (section.taskType === undefined || typeof section.taskType === 'string');
}

function getLessonSections(content: any, fallbackContent: Record<string, any>) {
  const primarySections = Array.isArray(content?.sections) ? content.sections.filter(isLessonSection) : [];
  if (primarySections.length > 0) return primarySections;
  return Array.isArray(fallbackContent?.sections)
    ? fallbackContent.sections.filter(isLessonSection)
    : [];
}

function withAssignment(href: string | undefined, assignmentId: string | null) {
  if (!href || !assignmentId) return href;
  const separator = href.includes('?') ? '&' : '?';
  return `${href}${separator}assignment=${encodeURIComponent(assignmentId)}`;
}

function ReturnToPathway({ routeBase }: { routeBase: string }) {
  return (
    <Link
      href={routeBase}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 42,
        marginBottom: 12,
        borderRadius: 999,
        padding: '8px 14px',
        border: '1px solid rgba(213, 226, 235, 0.95)',
        background: 'rgba(255, 255, 255, 0.78)',
        color: 'var(--navy)',
        fontWeight: 950,
        boxShadow: '0 10px 26px rgba(22, 33, 63, 0.06)',
      }}
    >
      ← Return to pathway
    </Link>
  );
}

function AdaptiveSupportNote({ adaptiveSupport }: { adaptiveSupport?: AdaptiveRendererSupport }) {
  if (!adaptiveSupport?.difficultyLevel && !adaptiveSupport?.supportStrategy && !adaptiveSupport?.successTarget) return null;

  return (
    <aside
      style={{
        border: '1px solid rgba(213, 226, 235, 0.95)',
        borderRadius: 22,
        background: 'rgba(255, 255, 255, 0.78)',
        padding: '12px 14px',
        marginBottom: 14,
        color: 'var(--navy)',
        boxShadow: '0 10px 26px rgba(22, 33, 63, 0.06)',
      }}
    >
      <strong style={{ display: 'block', marginBottom: 4 }}>Adaptive support</strong>
      {adaptiveSupport.difficultyLevel && <p style={{ margin: 0, fontWeight: 800 }}>Level: {adaptiveSupport.difficultyLevel}</p>}
      {adaptiveSupport.supportStrategy && <p style={{ margin: '4px 0 0' }}>{adaptiveSupport.supportStrategy}</p>}
      {adaptiveSupport.successTarget && <p style={{ margin: '4px 0 0', fontWeight: 800 }}>Target: {adaptiveSupport.successTarget}</p>}
    </aside>
  );
}

function ActivityShell({ routeBase, adaptiveSupport, children }: { routeBase: string; adaptiveSupport?: AdaptiveRendererSupport; children: React.ReactNode }) {
  return (
    <>
      <ReturnToPathway routeBase={routeBase} />
      <AdaptiveSupportNote adaptiveSupport={adaptiveSupport} />
      {children}
    </>
  );
}

export default function GenericActivityRenderer({
  activityId,
  activityType,
  content,
  routeBase,
  pathwayTitle,
  nextHref,
  fallbackContent = {},
  adaptiveSupport,
}: Props) {
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('assignment');
  const assignmentRouteBase = withAssignment(routeBase, assignmentId) ?? routeBase;
  const assignmentNextHref = withAssignment(nextHref, assignmentId);

  function renderActivity() {
    if (activityType === 'lesson_content') {
      const sections = getLessonSections(content, fallbackContent);
      return <ActivityShell routeBase={assignmentRouteBase} adaptiveSupport={adaptiveSupport}><LessonContentActivity sections={sections} nextHref={assignmentNextHref} /></ActivityShell>;
    }

    const normalisedContent = normaliseRendererContent(activityType, content, fallbackContent);

    if (activityType === 'flashcards') {
      const typedContent = normalisedContent as FlashcardContent;
      return <ActivityShell routeBase={assignmentRouteBase} adaptiveSupport={adaptiveSupport}><FlashcardActivity activityId={activityId} cards={typedContent.cards} nextHref={assignmentNextHref} /></ActivityShell>;
    }

    if (activityType === 'quiz') {
      const typedContent = normalisedContent as QuizContent;
      return <ActivityShell routeBase={assignmentRouteBase} adaptiveSupport={adaptiveSupport}><QuizActivity activityId={activityId} questions={typedContent.questions} nextHref={assignmentNextHref} /></ActivityShell>;
    }

    if (activityType === 'timeline') {
      const typedContent = normalisedContent as TimelineContent;
      return <ActivityShell routeBase={assignmentRouteBase} adaptiveSupport={adaptiveSupport}><TimelineActivity activityId={activityId} events={typedContent.events} nextHref={assignmentNextHref} /></ActivityShell>;
    }

    if (activityType === 'card_sort') {
      const typedContent = normalisedContent as CardSortContent;
      return <ActivityShell routeBase={assignmentRouteBase} adaptiveSupport={adaptiveSupport}><CardSortActivity activityId={activityId} cards={typedContent.cards} categories={typedContent.categories} nextHref={assignmentNextHref} /></ActivityShell>;
    }

    if (activityType === 'judgement_ranking') {
      const typedContent = normalisedContent as JudgementRankingContent;
      return <ActivityShell routeBase={assignmentRouteBase} adaptiveSupport={adaptiveSupport}><JudgementRankingActivity activityId={activityId} factors={typedContent.factors} question={typedContent.question} nextHref={assignmentNextHref} /></ActivityShell>;
    }

    if (activityType === 'ao3_interpretation') {
      const typedContent = normalisedContent as AO3InterpretationContent;
      return <ActivityShell routeBase={assignmentRouteBase} adaptiveSupport={adaptiveSupport}><AO3InterpretationActivity activityId={activityId} question={typedContent.question} interpretations={typedContent.interpretations} nextHref={assignmentNextHref} /></ActivityShell>;
    }

    if (activityType === 'peel_response') {
      const typedContent = normalisedContent as PeelResponseContent;
      return <ActivityShell routeBase={assignmentRouteBase} adaptiveSupport={adaptiveSupport}><PeelResponseActivity activityId={activityId} question={typedContent.question} stretchQuestion={typedContent.stretchQuestion} scaffold={typedContent.scaffold} nextHref={assignmentNextHref} /></ActivityShell>;
    }

    if (activityType === 'confidence_exit_ticket') {
      const typedContent = normalisedContent as ConfidenceExitTicketContent;
      return <ActivityShell routeBase={assignmentRouteBase} adaptiveSupport={adaptiveSupport}><ConfidenceExitTicketActivity activityId={activityId} prompt={typedContent.prompt} scale={typedContent.scale} leastSecureOptions={typedContent.leastSecureOptions} /></ActivityShell>;
    }

    return <ActivityShell routeBase={assignmentRouteBase} adaptiveSupport={adaptiveSupport}><ComingSoonActivityRenderer title={pathwayTitle} activityLabel={activityType} pathwayHref={assignmentRouteBase} nextHref={assignmentNextHref} /></ActivityShell>;
  }

  return (
    <AssignmentActivityProgressBridge activityType={activityType}>
      {renderActivity()}
    </AssignmentActivityProgressBridge>
  );
}
