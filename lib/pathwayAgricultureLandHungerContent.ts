export const agricultureLandHungerPathwaySlug = 'agriculture-land-hunger';

export const agricultureLandHungerLessonSections = [
  { heading: 'The enquiry', body: 'Most Russians still lived from agriculture in 1894. Emancipation ended legal serfdom but did not solve land hunger, low productivity or rural poverty. The enquiry tests why the countryside remained a source of weakness.', question: 'Why could emancipation fail to produce prosperity?', taskType: 'judgement' },
  { heading: 'The emancipation settlement', body: 'Peasants gained personal freedom and access to land, but allotments were often smaller than before and redemption payments lasted for decades. Nobles frequently retained the best land, woods and pasture.', question: 'Which terms of emancipation created future tension?', taskType: 'explain' },
  { heading: 'Land hunger', body: 'Rapid population growth increased pressure on fixed village allotments. Repartition within the mir divided land into smaller strips, making it difficult for families to produce enough food or accumulate a surplus.', question: 'Why did population growth worsen rural poverty?', taskType: 'explain' },
  { heading: 'The mir', body: 'The commune allocated strips, collected taxes and restricted movement. It offered collective security and helped the state control peasants, but discouraged consolidation, investment and individual initiative.', question: 'Was the mir protective or restrictive?', taskType: 'comparison' },
  { heading: 'Low productivity', body: 'Strip farming, limited machinery, poor roads, variable soil and traditional methods kept yields low. Peasants often lacked capital to buy livestock, seed or equipment.', question: 'Why was agricultural change so difficult?', taskType: 'explain' },
  { heading: 'Taxation and grain exports', body: 'The state relied heavily on indirect taxes and encouraged grain exports to earn foreign currency. Peasant households could be forced to sell grain despite inadequate reserves, linking industrial finance to rural hardship.', question: 'How did economic policy transfer resources from countryside to state?', taskType: 'judgement' },
  { heading: 'The Peasant Land Bank', body: 'Founded in 1882, the bank helped peasants purchase land. Its impact was limited because prices were high, loans required repayment and the scale of need exceeded the land made available.', question: 'Why did the Land Bank not solve land hunger?', taskType: 'explain' },
  { heading: 'Famine, 1891–92', body: 'Crop failure, weak transport, disease and delayed official action produced severe famine. Zemstva and voluntary organisations provided relief, exposing both rural vulnerability and weaknesses in central administration.', question: 'What did the famine reveal about Tsarist government?', taskType: 'judgement' },
  { heading: 'Political consequences', body: 'Poverty did not automatically create organised revolution, but resentment over land, taxes and official incompetence weakened loyalty. The famine also drew educated society into public action and criticism.', question: 'How could an agricultural crisis become a political crisis?', taskType: 'explain' },
  { heading: 'Overall judgement', body: 'Rural weakness persisted because emancipation redistributed obligations more successfully than resources. Land hunger, communal restrictions, taxation and low productivity reinforced one another. By 1894 the countryside remained the empire’s greatest structural weakness.', question: 'Why did rural weakness remain a problem in Russia?', taskType: 'judgement' },
];

export const agricultureLandHungerTimeline = { events: [
  { id: '1861', date: '1861', title: 'Emancipation', detail: 'Peasants gained freedom but received an unequal and costly land settlement.' },
  { id: '1860s', date: '1860s–80s', title: 'Population pressure grows', detail: 'More people depended on village allotments that did not expand sufficiently.' },
  { id: '1881', date: '1881', title: 'Temporary obligation ends', detail: 'Measures accelerated the transition to redemption arrangements.' },
  { id: '1882', date: '1882', title: 'Peasant Land Bank', detail: 'Credit was offered for peasant land purchase.' },
  { id: '1886', date: '1886', title: 'Poll tax abolition completed', detail: 'Bunge removed an important direct burden, though indirect taxation remained.' },
  { id: '1889', date: '1889', title: 'Land Captains', detail: 'Noble officials gained extensive authority over peasant communities.' },
  { id: '1891', date: '1891', title: 'Harvest failure', detail: 'Food shortages developed across major regions.' },
  { id: '1892', date: '1892', title: 'Famine and disease', detail: 'Relief failures exposed administrative and rural weakness.' },
] };

export const agricultureLandHungerFlashcards = [
  { id: 'land-hunger', front: 'Land hunger', back: 'Insufficient land for a growing peasant population.' },
  { id: 'redemption', front: 'Redemption payments', back: 'Long-term payments made by peasants for emancipation allotments.' },
  { id: 'mir', front: 'Mir', back: 'Village commune that allocated land, collected taxes and controlled members.' },
  { id: 'strip', front: 'Strip farming', back: 'Household land divided into scattered strips, reducing efficiency.' },
  { id: 'repartition', front: 'Repartition', back: 'Periodic redistribution of communal strips according to household need.' },
  { id: 'subsistence', front: 'Subsistence farming', back: 'Production mainly for household survival rather than market sale.' },
  { id: 'land-bank', front: 'Peasant Land Bank', back: 'Institution founded in 1882 to help peasants buy land.' },
  { id: 'grain', front: 'Grain exports', back: 'Exports used to earn revenue and foreign currency despite domestic need.' },
  { id: 'indirect', front: 'Indirect taxation', back: 'Taxes on goods such as vodka that fell heavily on ordinary consumers.' },
  { id: 'famine', front: 'Famine of 1891–92', back: 'Major food crisis revealing low productivity and weak administration.' },
  { id: 'zemstva', front: 'Zemstva relief', back: 'Local government and voluntary action used to address famine suffering.' },
  { id: 'land-captains', front: 'Land Captains', back: 'Officials created in 1889 with strong powers over peasant communities.' },
];

export const agricultureLandHungerQuiz = [
  { id: 'q1', question: 'What did peasants receive in 1861?', options: ['Freedom and land allotments', 'Universal suffrage', 'Free machinery', 'No taxes'], correct: 'Freedom and land allotments' },
  { id: 'q2', question: 'What were redemption payments?', options: ['Payments for allotments', 'Army wages', 'Church donations', 'Factory fines'], correct: 'Payments for allotments' },
  { id: 'q3', question: 'What was the mir?', options: ['Village commune', 'Factory union', 'Government ministry', 'Railway company'], correct: 'Village commune' },
  { id: 'q4', question: 'What increased land hunger?', options: ['Population growth', 'Falling population', 'Universal mechanisation', 'End of taxation'], correct: 'Population growth' },
  { id: 'q5', question: 'Why was strip farming inefficient?', options: ['Land was scattered', 'It used too much machinery', 'It employed foreign capital', 'It ended grain growing'], correct: 'Land was scattered' },
  { id: 'q6', question: 'When was the Peasant Land Bank founded?', options: ['1882', '1861', '1879', '1894'], correct: '1882' },
  { id: 'q7', question: 'Why did the state encourage grain exports?', options: ['To earn revenue and foreign currency', 'To abolish railways', 'To end taxation', 'To weaken industry'], correct: 'To earn revenue and foreign currency' },
  { id: 'q8', question: 'When did the major famine occur?', options: ['1891–92', '1855–56', '1874–75', '1881–82'], correct: '1891–92' },
  { id: 'q9', question: 'Who helped organise famine relief?', options: ['Zemstva and volunteers', 'People’s Will only', 'Foreign armies', 'Land Captains alone'], correct: 'Zemstva and volunteers' },
  { id: 'q10', question: 'Which judgement is strongest?', options: ['Emancipation failed to solve interconnected land, productivity and tax problems', 'Emancipation ended rural poverty', 'The mir rapidly mechanised agriculture', 'Famine had no political impact'], correct: 'Emancipation failed to solve interconnected land, productivity and tax problems' },
];

export const agricultureLandHungerJudgement = { question: 'Rank the causes of continuing rural weakness by 1894.', factors: [
  { id: 'settlement', title: 'Emancipation settlement', detail: 'Small allotments, retained noble land and redemption burdens.' },
  { id: 'population', title: 'Population growth', detail: 'Increased pressure on limited land.' },
  { id: 'mir', title: 'The mir', detail: 'Restricted mobility and consolidated traditional farming.' },
  { id: 'productivity', title: 'Low productivity', detail: 'Poor methods and low investment limited output.' },
  { id: 'tax', title: 'Tax and export policy', detail: 'Removed resources from peasant households.' },
  { id: 'government', title: 'Government weakness', detail: 'Limited reform and inadequate famine response.' },
] };

export const agricultureLandHungerAO3 = { question: 'Which interpretation best explains rural weakness?', interpretations: [
  { historian: 'Interpretation A', argument: 'The emancipation settlement created the central problem by failing to provide sufficient viable land.' },
  { historian: 'Interpretation B', argument: 'Population growth and traditional communal agriculture mattered more than the original settlement.' },
  { historian: 'Interpretation C', argument: 'State taxation and export priorities converted poverty into crisis.' },
] };

export const agricultureLandHungerPeel = { question: 'Write a developed paragraph assessing the view that the mir was the main cause of rural weakness.', stretchQuestion: 'Plan a 25-mark answer: “The terms of emancipation were responsible for continuing peasant hardship by 1894.” Assess the validity of this view.', scaffold: ['Make a direct causal claim.', 'Use precise evidence.', 'Explain the mechanism linking factor to hardship.', 'Compare with another cause.', 'Weigh short- and long-term importance.', 'Reach an explicit judgement.'] };
export const agricultureLandHungerConfidence = { prompt: 'How confident are you explaining rural weakness before 1894?', leastSecureOptions: ['Emancipation terms','Land hunger','Mir','Productivity','Taxation','Grain exports','Peasant Land Bank','Land Captains','Famine','Political consequences'], scale: [1,2,3,4,5] };
export const agricultureLandHungerFallbacks: Record<string, any> = { lesson_content:{sections:agricultureLandHungerLessonSections}, timeline:agricultureLandHungerTimeline, flashcards:{cards:agricultureLandHungerFlashcards}, quiz:{questions:agricultureLandHungerQuiz}, judgement_ranking:agricultureLandHungerJudgement, ao3_interpretation:agricultureLandHungerAO3, peel_response:agricultureLandHungerPeel, confidence_exit_ticket:agricultureLandHungerConfidence };
