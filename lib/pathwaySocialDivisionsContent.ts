export const socialDivisionsPathwaySlug = 'social-divisions';

export const socialDivisionsLessonSections = [
  { heading:'The enquiry', body:'Russian society in 1894 remained deeply hierarchical. Nobles retained influence, peasants formed the overwhelming majority, and workers, professionals and the intelligentsia were growing. The enquiry tests how far society had changed since 1855.', question:'What makes a society divided?', taskType:'judgement' },
  { heading:'The nobility', body:'The nobility retained land, status and privileged access to senior office. Some modernised estates or entered professions, but many faced debt, falling income and dependence on state service.', question:'How secure was noble dominance?', taskType:'judgement' },
  { heading:'The peasantry', body:'Peasants remained the largest social group. Emancipation ended legal serfdom but land hunger, redemption payments, communal control and poverty limited freedom in practice.', question:'How far did emancipation alter peasant status?', taskType:'comparison' },
  { heading:'Urban workers', body:'Industrial growth created a larger urban workforce concentrated in major cities and industrial regions. Workers faced long hours, low wages, dangerous conditions and crowded housing, while retaining links to villages.', question:'Why were workers a potentially unstable group?', taskType:'explain' },
  { heading:'The middle classes', body:'Business owners, managers, lawyers, doctors and other professionals expanded slowly. Their small size reflected limited urbanisation and weak consumer markets, but they helped widen demands for competent and lawful government.', question:'Why was the middle class politically significant despite its size?', taskType:'explain' },
  { heading:'The intelligentsia', body:'Educated critics debated liberalism, populism and Marxism. Their ideas challenged autocratic assumptions, although they were socially isolated from much of the peasantry and lacked mass organisation.', question:'Why could intellectual influence exceed numerical strength?', taskType:'judgement' },
  { heading:'Women and family hierarchy', body:'Women’s opportunities varied sharply by class. Elite women gained some educational and professional openings, while peasant and working-class women combined paid labour with domestic responsibilities. Legal and social authority remained strongly patriarchal.', question:'How did class shape women’s experiences?', taskType:'comparison' },
  { heading:'Town and countryside', body:'Urban centres experienced faster change than villages. Literacy, wage labour and political discussion expanded in towns, while rural Russia remained dominated by agriculture, communal structures and local tradition.', question:'Was Russia becoming two different societies?', taskType:'judgement' },
  { heading:'Mobility and tension', body:'Reform and economic change created limited movement between groups, but status, wealth, education and geography continued to divide society. New groups did not replace the old order; they added new tensions to it.', question:'Did modernisation reduce or multiply social divisions?', taskType:'judgement' },
  { heading:'Overall judgement', body:'By 1894 Russia had changed unevenly. The legal order of serfdom had ended and new urban groups had emerged, but peasants remained poor and nobles retained influence. Continuity outweighed transformation nationally, while change was concentrated in towns and educated society.', question:'How divided was Russian society by 1894?', taskType:'judgement' },
];

export const socialDivisionsTimeline={events:[
  {id:'1855',date:'1855',title:'Estate society',detail:'Legal status and privilege sharply divided nobles, townspeople and serfs.'},
  {id:'1861',date:'1861',title:'Emancipation',detail:'Serfdom ended, changing legal status without eliminating rural inequality.'},
  {id:'1864',date:'1864',title:'Zemstva',detail:'Local government widened participation for sections of educated society.'},
  {id:'1870s',date:'1870s',title:'Urban growth',detail:'Industrial centres attracted increasing numbers of wage workers.'},
  {id:'1874',date:'1874',title:'Populists go to the people',detail:'The gulf between educated radicals and peasants became clear.'},
  {id:'1882',date:'1882',title:'Factory legislation',detail:'The state acknowledged emerging industrial social problems.'},
  {id:'1889',date:'1889',title:'Land Captains',detail:'Noble authority over peasants was reinforced.'},
  {id:'1891',date:'1891–92',title:'Famine',detail:'Rural suffering highlighted inequality and administrative weakness.'},
]};

export const socialDivisionsFlashcards=[
  {id:'nobility',front:'Nobility',back:'Privileged landowning estate with strong influence in government and local society.'},
  {id:'peasantry',front:'Peasantry',back:'The overwhelming majority of the population, mainly dependent on agriculture.'},
  {id:'workers',front:'Industrial workers',back:'Growing urban wage-earning group concentrated in factories and mines.'},
  {id:'middle',front:'Middle class',back:'Small but growing group of businesspeople, managers and professionals.'},
  {id:'intelligentsia',front:'Intelligentsia',back:'Educated people who debated and criticised Russia’s social and political order.'},
  {id:'estate',front:'Estate society',back:'A hierarchy based on legally defined social categories and privileges.'},
  {id:'patriarchy',front:'Patriarchy',back:'A system in which men held dominant legal, economic and family authority.'},
  {id:'urbanisation',front:'Urbanisation',back:'Growth in the proportion and size of the urban population.'},
  {id:'mobility',front:'Social mobility',back:'Movement between social positions or groups.'},
  {id:'literacy',front:'Literacy',back:'Ability to read and write, expanding unevenly through education and urbanisation.'},
  {id:'dual',front:'Dual society',back:'A society combining modern urban sectors with traditional rural structures.'},
  {id:'continuity',front:'Continuity',back:'Features that remain substantially unchanged over time.'},
];

export const socialDivisionsQuiz=[
  {id:'q1',question:'Which group remained the majority?',options:['Peasants','Workers','Professionals','Nobles'],correct:'Peasants'},
  {id:'q2',question:'What ended in 1861?',options:['Legal serfdom','Autocracy','The mir','Noble landownership'],correct:'Legal serfdom'},
  {id:'q3',question:'Which group grew with industrialisation?',options:['Urban workers','Serfs','Land Captains','Clergy only'],correct:'Urban workers'},
  {id:'q4',question:'Why was the middle class small?',options:['Limited urbanisation and markets','Universal landownership','No education','No towns'],correct:'Limited urbanisation and markets'},
  {id:'q5',question:'Who formed the intelligentsia?',options:['Educated critics and thinkers','Army conscripts only','Village elders only','Foreign diplomats'],correct:'Educated critics and thinkers'},
  {id:'q6',question:'What divided women’s experiences most clearly?',options:['Class','Railway gauge','Military rank only','Nationality alone'],correct:'Class'},
  {id:'q7',question:'Where was change fastest?',options:['Towns and industrial regions','Every village equally','Remote estates only','The Church alone'],correct:'Towns and industrial regions'},
  {id:'q8',question:'What did Land Captains reinforce?',options:['Noble authority over peasants','Worker control of factories','Female suffrage','Middle-class elections'],correct:'Noble authority over peasants'},
  {id:'q9',question:'Why were workers potentially unstable?',options:['Poor conditions and concentration','They owned most land','They controlled government','They paid no taxes'],correct:'Poor conditions and concentration'},
  {id:'q10',question:'Which judgement is strongest?',options:['Change was real but concentrated, while hierarchy and rural poverty persisted','Russia became socially equal','No new groups emerged','Nobles lost all influence'],correct:'Change was real but concentrated, while hierarchy and rural poverty persisted'},
];

export const socialDivisionsJudgement={question:'Rank the most important divisions in Russian society by 1894.',factors:[
  {id:'class',title:'Wealth and class',detail:'Land, income and property separated elites from the majority.'},
  {id:'legal',title:'Status and privilege',detail:'Noble influence and estate traditions survived emancipation.'},
  {id:'urban-rural',title:'Town and countryside',detail:'Economic and cultural change was concentrated geographically.'},
  {id:'education',title:'Education and literacy',detail:'Access to knowledge widened the gulf between educated society and many peasants.'},
  {id:'gender',title:'Gender',detail:'Patriarchal authority limited women across classes.'},
  {id:'ideology',title:'Political outlook',detail:'Liberals, radicals and conservatives offered conflicting visions of Russia.'},
]};
export const socialDivisionsAO3={question:'Which interpretation best explains Russian society by 1894?',interpretations:[
  {historian:'Interpretation A',argument:'Emancipation marked a decisive social transformation because legal serfdom disappeared.'},
  {historian:'Interpretation B',argument:'Continuity was stronger because peasants remained poor and nobles retained influence.'},
  {historian:'Interpretation C',argument:'The key development was an increasingly divided dual society of modern towns and traditional villages.'},
]};
export const socialDivisionsPeel={question:'Write a developed paragraph assessing the view that Russian society changed little between 1855 and 1894.',stretchQuestion:'Plan a 25-mark answer: “By 1894 economic change had transformed Russian society.” Assess the validity of this view.',scaffold:['Define the type of change being assessed.','Use evidence from at least two social groups.','Explain scale and geographical reach.','Identify important continuity.','Compare legal change with lived experience.','Reach a qualified overall judgement.']};
export const socialDivisionsConfidence={prompt:'How confident are you comparing Russian social groups by 1894?',leastSecureOptions:['Nobility','Peasantry','Workers','Middle class','Intelligentsia','Women','Urban-rural divide','Mobility','Change','Continuity'],scale:[1,2,3,4,5]};
export const socialDivisionsFallbacks:Record<string,any>={lesson_content:{sections:socialDivisionsLessonSections},timeline:socialDivisionsTimeline,flashcards:{cards:socialDivisionsFlashcards},quiz:{questions:socialDivisionsQuiz},judgement_ranking:socialDivisionsJudgement,ao3_interpretation:socialDivisionsAO3,peel_response:socialDivisionsPeel,confidence_exit_ticket:socialDivisionsConfidence};