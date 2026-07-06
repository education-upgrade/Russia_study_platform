import {
  pathwayCrimeanWarLessonSections,
  pathwayCrimeanWarFlashcards,
  pathwayCrimeanWarQuizQuestions,
  pathwayCrimeanWarPeelContent,
  pathwayCrimeanWarConfidenceContent,
} from './pathwayCrimeanWarContent';

export const pathwayCrimeanWarTimeline = {
  events: [
    { id: '1853-war-begins', date: '1853', title: 'Crimean War begins', detail: 'Russia entered conflict against the Ottoman Empire. Britain and France later joined against Russia.' },
    { id: '1854-allies-enter', date: '1854', title: 'Britain and France join the war', detail: 'The conflict became a major European war, increasing pressure on Russia’s military and economy.' },
    { id: '1854-sevastopol', date: '1854', title: 'Siege of Sevastopol begins', detail: 'The long siege highlighted Russia’s supply, transport and command problems.' },
    { id: '1855-alexander-ii', date: '1855', title: 'Alexander II becomes Tsar', detail: 'Alexander II inherited the war and the wider problem of Russian backwardness.' },
    { id: '1855-sevastopol-falls', date: '1855', title: 'Sevastopol falls', detail: 'The loss became a symbol of Russia’s military and administrative weakness.' },
    { id: '1856-paris', date: '1856', title: 'Treaty of Paris', detail: 'Russia accepted defeat, damaging its great-power reputation and strengthening calls for reform.' },
    { id: '1861-emancipation', date: '1861', title: 'Emancipation of the serfs', detail: 'The Great Reform followed partly because defeat had exposed the need to modernise Russia.' }
  ]
};

export const pathwayCrimeanWarJudgementTask = {
  question: 'Rank the reasons why the Crimean War exposed weakness in Tsarist Russia. Which factor made reform most urgent?',
  factors: [
    { id: 'military', title: 'Military weakness', detail: 'Russia’s army was large but poorly supplied, badly organised and less modern than its rivals.' },
    { id: 'transport', title: 'Transport and communications', detail: 'Limited railways and poor communications made it difficult to move troops and supplies across the empire.' },
    { id: 'economy', title: 'Economic backwardness', detail: 'Weak industrial development made it harder for Russia to support a modern war effort.' },
    { id: 'administration', title: 'Administrative inefficiency', detail: 'Slow bureaucracy and poor organisation made wartime weaknesses more obvious.' },
    { id: 'prestige', title: 'Damaged great-power status', detail: 'Defeat undermined Russia’s reputation as a major European power.' },
    { id: 'serfdom', title: 'Serfdom and social backwardness', detail: 'The war highlighted the limits of a society still based on serf labour and traditional structures.' }
  ]
};

export const pathwayCrimeanWarFallbacks: Record<string, any> = {
  lesson_content: {
    sections: pathwayCrimeanWarLessonSections,
  },
  timeline: pathwayCrimeanWarTimeline,
  flashcards: {
    cards: pathwayCrimeanWarFlashcards,
  },
  quiz: {
    questions: pathwayCrimeanWarQuizQuestions,
  },
  judgement_ranking: pathwayCrimeanWarJudgementTask,
  peel_response: pathwayCrimeanWarPeelContent,
  confidence_exit_ticket: pathwayCrimeanWarConfidenceContent,
};
