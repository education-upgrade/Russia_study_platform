import fs from 'node:fs';
const core=fs.readFileSync(new URL('../lib/recall/questions.ts',import.meta.url),'utf8');
const expanded=fs.readFileSync(new URL('../lib/recall/questions-expanded.ts',import.meta.url),'utf8');
const depth=fs.readFileSync(new URL('../lib/recall/questions-depth.ts',import.meta.url),'utf8');
const bank=fs.readFileSync(new URL('../lib/recall/bank.ts',import.meta.url),'utf8');
const topics=['alexander-ii','alexander-iii','nicholas-ii','lenin','stalin','khrushchev'];
const coreIds=[...core.matchAll(/id:\s*'([^']+)'/g)].map(m=>m[1]).filter(id=>!topics.includes(id));
const helperIds=(source)=>[...source.matchAll(/(?:sa|mcq)\('([^']+)'/g)].map(m=>m[1]);
const ids=[...coreIds,...helperIds(expanded),...helperIds(depth)];
const duplicateIds=ids.filter((id,index)=>ids.indexOf(id)!==index);if(duplicateIds.length){console.error(`Duplicate recall question IDs: ${[...new Set(duplicateIds)].join(', ')}`);process.exit(1);}
const counts=new Map();for(const match of core.matchAll(/id:\s*'[^']+'\s*,\s*topicId:\s*'([^']+)'\s*,\s*type:/g))counts.set(match[1],(counts.get(match[1])??0)+1);for(const source of [expanded,depth])for(const match of source.matchAll(/(?:sa|mcq)\('[^']+','([^']+)'/g))counts.set(match[1],(counts.get(match[1])??0)+1);
const targets={'alexander-ii':60,'alexander-iii':45,'nicholas-ii':90,'lenin':55,'stalin':90,'khrushchev':55};for(const topic of topics){if((counts.get(topic)??0)<targets[topic]){console.error(`Recall topic ${topic} has ${counts.get(topic)??0} questions; expected at least ${targets[topic]}.`);process.exit(1);}}
const overrideLines=bank.split('\n').filter(line=>line.includes("if (question.id ===")&&line.includes('options:'));
const overrideIds=new Set(overrideLines.map(line=>line.match(/question\.id === '([^']+)'/)?.[1]).filter(Boolean));
const mcqErrors=[];
const auditOptions=(id,options,correct)=>{if(options.length!==4){mcqErrors.push(`MCQ ${id} has ${options.length} options instead of 4.`);return;}const lengths=options.map(option=>option.length);const longest=Math.max(...lengths);const second=[...lengths].sort((a,b)=>b-a)[1];if(lengths[correct]===longest&&longest-second>=15)mcqErrors.push(`MCQ ${id} gives away the answer by length (${lengths[correct]} vs ${second}).`);};
for(const source of [expanded,depth])for(const line of source.split('\n').filter(line=>line.trim().startsWith('mcq('))){const id=line.match(/mcq\('([^']+)'/)?.[1];if(overrideIds.has(id))continue;const optionMatch=line.match(/\[(.*?)\],(\d),/);if(!optionMatch){mcqErrors.push(`Could not audit MCQ ${id??'unknown'}`);continue;}auditOptions(id,[...optionMatch[1].matchAll(/'([^']*)'/g)].map(m=>m[1]),Number(optionMatch[2]));}
for(const line of overrideLines){const id=line.match(/question\.id === '([^']+)'/)?.[1]??'unknown';const optionMatch=line.match(/options:\s*\[(.*?)\],\s*correctOption:\s*(\d)/);if(!optionMatch){mcqErrors.push(`Could not audit override MCQ ${id}`);continue;}auditOptions(id,[...optionMatch[1].matchAll(/'([^']*)'/g)].map(m=>m[1]),Number(optionMatch[2]));}
if(mcqErrors.length){console.error(`Recall MCQ quality audit found ${mcqErrors.length} issue(s):`);for(const error of mcqErrors)console.error(`- ${error}`);process.exit(1);}
console.log(`Recall bank check passed: ${ids.length} questions across ${counts.size} topics; strict 15-character MCQ length audit passed including ${overrideIds.size} final overrides.`);
