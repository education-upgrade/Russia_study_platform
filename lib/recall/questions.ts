export type RecallQuestionType = 'mcq' | 'short_answer';

export type RecallTopic = {
  id: string;
  title: string;
  period: string;
};

export type RecallQuestion = {
  id: string;
  topicId: string;
  type: RecallQuestionType;
  prompt: string;
  options?: string[];
  correctOption?: number;
  acceptedAnswers?: string[];
  answerLabel: string;
  feedback: string;
};

export const recallTopics: RecallTopic[] = [
  { id: 'alexander-ii', title: 'Alexander II: reform and reaction', period: '1855–1881' },
  { id: 'alexander-iii', title: 'Alexander III: autocracy and change', period: '1881–1894' },
  { id: 'nicholas-ii', title: 'Nicholas II and the collapse of autocracy', period: '1894–1917' },
  { id: 'lenin', title: 'Lenin and the establishment of Communist rule', period: '1917–1924' },
  { id: 'stalin', title: 'Stalinist dictatorship', period: '1924–1953' },
  { id: 'khrushchev', title: 'Khrushchev and reaction to Stalinism', period: '1953–1964' },
];

export const recallQuestions: RecallQuestion[] = [
  {
    id: 'a2-01', topicId: 'alexander-ii', type: 'short_answer',
    prompt: 'In which year were the Russian serfs emancipated?',
    acceptedAnswers: ['1861'], answerLabel: '1861',
    feedback: 'Alexander II issued the Emancipation Edict in 1861. It ended legal serfdom but left major problems over land and redemption payments.',
  },
  {
    id: 'a2-02', topicId: 'alexander-ii', type: 'mcq',
    prompt: 'Which elected local government bodies were created by Alexander II’s reforms from 1864?',
    options: ['Soviets', 'Zemstva', 'Dumas', 'Mir committees'], correctOption: 1,
    answerLabel: 'Zemstva', feedback: 'Zemstva were elected local government bodies introduced from 1864, dealing with areas such as roads, education and public health.',
  },
  {
    id: 'a2-03', topicId: 'alexander-ii', type: 'mcq',
    prompt: 'Which event most clearly exposed Russia’s military and administrative weaknesses at the start of Alexander II’s reign?',
    options: ['The Russo-Japanese War', 'The Crimean War', 'The Polish Revolt of 1863', 'The Russo-Turkish War'], correctOption: 1,
    answerLabel: 'The Crimean War', feedback: 'Defeat in the Crimean War highlighted military, transport and administrative weaknesses and strengthened pressure for reform.',
  },
  {
    id: 'a2-04', topicId: 'alexander-ii', type: 'mcq',
    prompt: 'What happened to military service under the 1874 military reforms?',
    options: ['It was abolished for peasants', 'It was restricted to nobles', 'Universal conscription was introduced', 'Service became voluntary'], correctOption: 2,
    answerLabel: 'Universal conscription was introduced', feedback: 'The 1874 reforms introduced universal military conscription and reduced the length of active service.',
  },
  {
    id: 'a2-05', topicId: 'alexander-ii', type: 'short_answer',
    prompt: 'Which revolutionary organisation assassinated Alexander II in 1881?',
    acceptedAnswers: ['people’s will', 'peoples will', 'the people’s will', 'the peoples will', 'narodnaya volya'], answerLabel: 'People’s Will (Narodnaya Volya)',
    feedback: 'People’s Will, a revolutionary populist organisation, assassinated Alexander II in March 1881.',
  },

  {
    id: 'a3-01', topicId: 'alexander-iii', type: 'short_answer',
    prompt: 'Who was Alexander III’s influential conservative tutor and adviser?',
    acceptedAnswers: ['pobedonostsev', 'konstantin pobedonostsev', 'constantine pobedonostsev'], answerLabel: 'Konstantin Pobedonostsev',
    feedback: 'Pobedonostsev strongly defended autocracy, Orthodoxy and central control and opposed representative government.',
  },
  {
    id: 'a3-02', topicId: 'alexander-iii', type: 'mcq',
    prompt: 'What was the main purpose of Alexander III’s policy of Russification?',
    options: ['To expand local autonomy', 'To strengthen Russian language and culture across the empire', 'To grant minorities political independence', 'To abolish the Orthodox Church'], correctOption: 1,
    answerLabel: 'To strengthen Russian language and culture across the empire', feedback: 'Russification sought greater cultural and administrative uniformity by promoting Russian language, Orthodoxy and central authority.',
  },
  {
    id: 'a3-03', topicId: 'alexander-iii', type: 'mcq',
    prompt: 'Which measure of 1889 increased central government influence over the peasantry?',
    options: ['The October Manifesto', 'The Fundamental Laws', 'The Land Captains Act', 'The Emancipation Edict'], correctOption: 2,
    answerLabel: 'The Land Captains Act', feedback: 'Land Captains, usually drawn from the nobility, gained extensive powers over peasant communities from 1889.',
  },
  {
    id: 'a3-04', topicId: 'alexander-iii', type: 'mcq',
    prompt: 'Which institution was created in 1882 to help peasants purchase land?',
    options: ['Peasants’ Land Bank', 'State Duma', 'Workers’ Soviet', 'Nobles’ Congress'], correctOption: 0,
    answerLabel: 'Peasants’ Land Bank', feedback: 'The Peasants’ Land Bank was created in 1882 to provide loans enabling peasants to buy land.',
  },
  {
    id: 'a3-05', topicId: 'alexander-iii', type: 'short_answer',
    prompt: 'Which finance minister, appointed in 1892, became closely associated with rapid industrialisation and railway expansion?',
    acceptedAnswers: ['sergei witte', 'sergei yulyevich witte', 'witte'], answerLabel: 'Sergei Witte',
    feedback: 'Witte became Finance Minister in 1892 and promoted state-led industrial growth, foreign investment and railway expansion.',
  },

  {
    id: 'n2-01', topicId: 'nicholas-ii', type: 'short_answer',
    prompt: 'In which year did Bloody Sunday take place?',
    acceptedAnswers: ['1905'], answerLabel: '1905', feedback: 'Bloody Sunday took place in January 1905 and helped trigger the wider 1905 Revolution.',
  },
  {
    id: 'n2-02', topicId: 'nicholas-ii', type: 'mcq',
    prompt: 'Which document promised civil liberties and an elected legislature during the 1905 Revolution?',
    options: ['April Theses', 'October Manifesto', 'Fundamental Laws', 'Decree on Peace'], correctOption: 1,
    answerLabel: 'October Manifesto', feedback: 'The October Manifesto promised civil liberties and an elected Duma, helping to divide opposition to the regime.',
  },
  {
    id: 'n2-03', topicId: 'nicholas-ii', type: 'mcq',
    prompt: 'What was the effect of the Fundamental Laws of 1906 on Nicholas II’s authority?',
    options: ['They abolished the monarchy', 'They made the Duma fully sovereign', 'They reaffirmed substantial powers of the Tsar', 'They transferred power to the soviets'], correctOption: 2,
    answerLabel: 'They reaffirmed substantial powers of the Tsar', feedback: 'The Fundamental Laws reaffirmed Nicholas II’s authority, including control over ministers, foreign policy and the power to dissolve the Duma.',
  },
  {
    id: 'n2-04', topicId: 'nicholas-ii', type: 'short_answer',
    prompt: 'Which prime minister introduced major agricultural reforms after 1906?',
    acceptedAnswers: ['stolypin', 'pyotr stolypin', 'peter stolypin'], answerLabel: 'Pyotr Stolypin', feedback: 'Stolypin sought to create a more prosperous and conservative peasantry through land reform while also using repression against opposition.',
  },
  {
    id: 'n2-05', topicId: 'nicholas-ii', type: 'mcq',
    prompt: 'What did Nicholas II do in 1915 that tied him more directly to Russia’s military failures?',
    options: ['He dissolved the army', 'He took personal command of the armed forces', 'He withdrew Russia from the war', 'He transferred command to the Duma'], correctOption: 1,
    answerLabel: 'He took personal command of the armed forces', feedback: 'Nicholas became Commander-in-Chief in 1915, making him more directly associated with military setbacks while leaving government in Petrograd increasingly unstable.',
  },

  {
    id: 'l-01', topicId: 'lenin', type: 'mcq',
    prompt: 'Which early Bolshevik decree transferred landed estates to peasant control in 1917?',
    options: ['Decree on Land', 'Decree on Workers’ Control', 'Treaty of Brest-Litovsk', 'New Economic Policy'], correctOption: 0,
    answerLabel: 'Decree on Land', feedback: 'The Decree on Land of November 1917 legitimised the seizure of landed estates and transferred land to local peasant control.',
  },
  {
    id: 'l-02', topicId: 'lenin', type: 'short_answer',
    prompt: 'What was the name of the economic policy introduced by Lenin in 1921 to replace War Communism?',
    acceptedAnswers: ['nep', 'new economic policy', 'the new economic policy'], answerLabel: 'New Economic Policy (NEP)', feedback: 'The NEP was introduced in 1921 and restored a limited role for private trade and small-scale private enterprise.',
  },
  {
    id: 'l-03', topicId: 'lenin', type: 'mcq',
    prompt: 'What happened to the Constituent Assembly in January 1918?',
    options: ['It elected Lenin as Tsar', 'It was dissolved by the Bolsheviks', 'It defeated the Red Army', 'It introduced the NEP'], correctOption: 1,
    answerLabel: 'It was dissolved by the Bolsheviks', feedback: 'The Bolsheviks dissolved the Constituent Assembly after it met for only one day, removing a major potential source of representative opposition.',
  },
  {
    id: 'l-04', topicId: 'lenin', type: 'mcq',
    prompt: 'Which policy was associated with grain requisitioning and extensive state control during the Civil War?',
    options: ['Collectivisation', 'War Communism', 'The Virgin Lands scheme', 'The First Five-Year Plan'], correctOption: 1,
    answerLabel: 'War Communism', feedback: 'War Communism involved grain requisitioning, nationalisation and tight state control of production during the Civil War.',
  },
  {
    id: 'l-05', topicId: 'lenin', type: 'short_answer',
    prompt: 'Which treaty took Russia out of the First World War in March 1918?',
    acceptedAnswers: ['treaty of brest-litovsk', 'brest-litovsk', 'brest litovsk', 'treaty of brest litovsk'], answerLabel: 'Treaty of Brest-Litovsk', feedback: 'The Treaty of Brest-Litovsk ended Russia’s participation in the First World War but imposed major territorial losses.',
  },

  {
    id: 's-01', topicId: 'stalin', type: 'mcq',
    prompt: 'In which year did the First Five-Year Plan begin?',
    options: ['1921', '1924', '1928', '1936'], correctOption: 2,
    answerLabel: '1928', feedback: 'The First Five-Year Plan began in 1928 and prioritised rapid growth in heavy industry under central planning.',
  },
  {
    id: 's-02', topicId: 'stalin', type: 'short_answer',
    prompt: 'What was the name of Stalin’s policy of merging individual peasant farms into larger collective farms?',
    acceptedAnswers: ['collectivisation', 'collectivization'], answerLabel: 'Collectivisation', feedback: 'Collectivisation was imposed rapidly from the end of the 1920s to bring agriculture under greater state control and increase grain procurement.',
  },
  {
    id: 's-03', topicId: 'stalin', type: 'mcq',
    prompt: 'Which period is most closely associated with the Great Purges and mass political repression under Stalin?',
    options: ['1914–17', '1921–24', '1936–38', '1946–48'], correctOption: 2,
    answerLabel: '1936–38', feedback: 'The Great Purges peaked in 1936–38, involving show trials, arrests, executions and mass imprisonment.',
  },
  {
    id: 's-04', topicId: 'stalin', type: 'mcq',
    prompt: 'What was Operation Barbarossa?',
    options: ['The Soviet invasion of Finland', 'The German invasion of the Soviet Union', 'The Soviet atomic programme', 'The post-war purge of Leningrad'], correctOption: 1,
    answerLabel: 'The German invasion of the Soviet Union', feedback: 'Operation Barbarossa was Nazi Germany’s invasion of the Soviet Union, launched in June 1941.',
  },
  {
    id: 's-05', topicId: 'stalin', type: 'short_answer',
    prompt: 'In which year did Stalin die?',
    acceptedAnswers: ['1953'], answerLabel: '1953', feedback: 'Stalin died in March 1953, creating a power struggle among leading figures in the Communist Party.',
  },

  {
    id: 'k-01', topicId: 'khrushchev', type: 'short_answer',
    prompt: 'In which year did Khrushchev deliver his Secret Speech denouncing aspects of Stalin’s rule?',
    acceptedAnswers: ['1956'], answerLabel: '1956', feedback: 'Khrushchev delivered the Secret Speech to the Twentieth Party Congress in February 1956, attacking Stalin’s cult and abuses of power.',
  },
  {
    id: 'k-02', topicId: 'khrushchev', type: 'mcq',
    prompt: 'What was the main aim of the Virgin Lands scheme launched under Khrushchev?',
    options: ['To expand grain production by cultivating new land', 'To restore private farming', 'To reduce industrial output', 'To abolish collective farms immediately'], correctOption: 0,
    answerLabel: 'To expand grain production by cultivating new land', feedback: 'The Virgin Lands campaign sought to raise grain output by cultivating large areas, especially in Kazakhstan and Siberia.',
  },
  {
    id: 'k-03', topicId: 'khrushchev', type: 'mcq',
    prompt: 'Which group tried unsuccessfully to remove Khrushchev from power in 1957?',
    options: ['The Provisional Government', 'The Anti-Party Group', 'The Decembrists', 'The Left Opposition'], correctOption: 1,
    answerLabel: 'The Anti-Party Group', feedback: 'The Anti-Party Group attempted to remove Khrushchev in 1957, but he survived with support from the wider Central Committee and allies including Zhukov.',
  },
  {
    id: 'k-04', topicId: 'khrushchev', type: 'mcq',
    prompt: 'What happened at Novocherkassk in 1962?',
    options: ['A workers’ protest was violently suppressed', 'A new constitution abolished the Party', 'Stalin returned to office', 'The Virgin Lands scheme was launched'], correctOption: 0,
    answerLabel: 'A workers’ protest was violently suppressed', feedback: 'At Novocherkassk in 1962, protests over food prices and working conditions were suppressed by force, exposing limits to Khrushchev’s liberalisation.',
  },
  {
    id: 'k-05', topicId: 'khrushchev', type: 'short_answer',
    prompt: 'In which year was Khrushchev removed from power?',
    acceptedAnswers: ['1964'], answerLabel: '1964', feedback: 'Khrushchev was removed from office by Party colleagues in October 1964.',
  },
];

export const recallQuestionById = new Map(recallQuestions.map((question) => [question.id, question]));
export const recallTopicById = new Map(recallTopics.map((topic) => [topic.id, topic]));
