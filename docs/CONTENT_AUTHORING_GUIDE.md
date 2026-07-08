# Content Authoring Guide

This guide sets the content standard for Russia Study Platform pathways. It should be used alongside `docs/QUIZ_AUTHORING_STANDARD.md`.

## Core rule

Every pathway should feel like part of the same product. Activities can vary by topic, but structure, tone and academic expectations should be consistent.

## Standard pathway activity set

A complete pathway should normally include:

1. `lesson_content`
2. `timeline`
3. `flashcards`
4. `quiz`
5. `judgement_ranking`
6. `ao3_interpretation`
7. `peel_response`
8. `confidence_exit_ticket`

A shorter recap pathway can use fewer activities, but the full guided-study route should aim for the full set.

## Lesson content standard

Lesson content should:

- Start with a clear enquiry question.
- Explain historical context in student-friendly A-Level language.
- Use precise AQA vocabulary.
- Make links to change, continuity, causation, significance or judgement.
- End with a short judgement or exam connection.

Recommended structure:

```ts
{
  heading: 'The enquiry',
  body: 'Clear explanatory paragraph.',
  question: 'Check or application question.',
  taskType: 'recall' | 'explain' | 'judgement'
}
```

## Timeline standard

Timeline tasks should:

- Include 5–8 events.
- Use dates or date ranges clearly.
- Avoid isolated facts with no explanation.
- Include at least one event that links the topic forward or backward.
- Support turning-point or sequence thinking.

Recommended structure:

```ts
{
  events: [
    {
      id: 'short-stable-id',
      date: '1856',
      title: 'Treaty of Paris',
      detail: 'Why this event mattered.'
    }
  ]
}
```

## Flashcard standard

Flashcards should:

- Use short, precise fronts.
- Use clear explanatory backs.
- Include dates, people, concepts and judgement phrases.
- Avoid overloading one card with too much information.

A strong set usually includes:

- 2–3 key events/dates
- 2–3 key concepts
- 2–3 causal or judgement cards
- 1–2 exam-link cards

## Quiz standard

Use `docs/QUIZ_AUTHORING_STANDARD.md`.

Key reminders:

- Four options.
- Similar option length.
- Plausible distractors.
- Balanced correct answer positions.
- Increasing cognitive demand.

## Judgement-ranking standard

Judgement-ranking tasks should:

- Ask students to rank causes, consequences, reforms, groups or factors.
- Include 4–6 factors.
- Make each factor plausible.
- Encourage students to justify relative importance.

Recommended structure:

```ts
{
  question: 'Rank the factors. Which mattered most?',
  factors: [
    {
      id: 'factor-id',
      title: 'Factor title',
      detail: 'Why this factor mattered.'
    }
  ]
}
```

## AO3 interpretation standard

AO3 activities should:

- Include a clear evaluation question.
- Use 2–3 short interpretations.
- Make each interpretation genuinely plausible.
- Encourage students to support and challenge using contextual knowledge.
- Avoid making one interpretation obviously correct.

Recommended structure:

```ts
{
  question: 'Which view is most convincing?',
  interpretations: [
    {
      historian: 'View A',
      argument: 'A concise, plausible interpretation.'
    }
  ]
}
```

## PEEL response standard

PEEL tasks should:

- Ask a focused explain or assess question.
- Use wording close to AQA essay language.
- Include a stretch version where useful.
- Provide scaffold steps, not a full answer.

Recommended scaffold:

1. Point
2. Evidence
3. Explain
4. Link to question
5. Mini-judgement

## Confidence exit ticket standard

Confidence checks should:

- Ask about the specific pathway skill/content.
- Use a 1–5 confidence scale.
- Offer topic-specific least-secure options.
- Generate useful teacher intervention data.

Recommended structure:

```ts
{
  prompt: 'How confident are you explaining this topic?',
  leastSecureOptions: ['Option 1', 'Option 2'],
  scale: [1, 2, 3, 4, 5]
}
```

## Quality checklist before marking a pathway ready

- [ ] Pathway has a clear enquiry focus.
- [ ] All required activities contain usable content.
- [ ] No activity relies on empty Supabase content.
- [ ] Fallback content exists for every activity in the route.
- [ ] Quiz follows the quiz authoring standard.
- [ ] Timeline events have explanatory detail.
- [ ] AO3 interpretations are plausible and balanced.
- [ ] PEEL task links clearly to AQA written response skills.
- [ ] Confidence check gives useful intervention categories.
- [ ] The full teacher to student to progress-dashboard workflow has been tested.

## Marking a pathway as ready

Only mark a pathway as `ready` in `lib/pathwayRegistry.ts` when:

1. The route loads.
2. Every activity in the route loads with content.
3. The assignment workflow works.
4. At least one saved activity appears in teacher progress.
5. The content has passed manual academic review.
