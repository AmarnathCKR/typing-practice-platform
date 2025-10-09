export const wordLists = {
  easy: [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her',
    'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how',
    'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did',
    'its', 'let', 'put', 'say', 'she', 'too', 'use', 'dad', 'mom', 'pet',
    'add', 'age', 'ago', 'air', 'end', 'eye', 'far', 'fun', 'got', 'hot',
    'job', 'lot', 'may', 'own', 'run', 'sat', 'set', 'top', 'try', 'yet'
  ],
  medium: [
    'about', 'after', 'again', 'before', 'being', 'below', 'between', 'both',
    'during', 'each', 'few', 'from', 'further', 'here', 'into', 'more', 'most',
    'other', 'over', 'own', 'same', 'should', 'some', 'such', 'than', 'that',
    'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through',
    'under', 'very', 'what', 'when', 'where', 'which', 'while', 'with', 'would',
    'your', 'could', 'first', 'found', 'great', 'house', 'know', 'little', 'place',
    'right', 'think', 'three', 'water', 'where', 'years', 'every', 'still', 'world'
  ],
  hard: [
    'according', 'actually', 'although', 'anything', 'approach', 'available',
    'because', 'believe', 'business', 'community', 'company', 'continue',
    'country', 'develop', 'different', 'difficult', 'during', 'education',
    'environment', 'especially', 'everything', 'experience', 'financial',
    'following', 'government', 'however', 'important', 'including', 'increase',
    'information', 'interest', 'international', 'knowledge', 'language',
    'management', 'morning', 'necessary', 'nothing', 'Number', 'particular',
    'people', 'perhaps', 'political', 'population', 'position', 'possible',
    'problem', 'product', 'program', 'property', 'provide', 'question',
    'research', 'result', 'security', 'service', 'similar', 'situation',
    'something', 'standard', 'student', 'support', 'system', 'technology'
  ],
  expert: [
    'accommodation', 'acknowledge', 'acquisition', 'administrative', 'approximately',
    'architecture', 'authorization', 'characteristic', 'classification', 'communication',
    'comprehensive', 'concentration', 'configuration', 'consequently', 'consideration',
    'contemporary', 'contribution', 'controversial', 'conventional', 'coordination',
    'demonstration', 'determination', 'disadvantage', 'discrimination', 'distribution',
    'documentation', 'effectiveness', 'embarrassment', 'establishment', 'implementation',
    'infrastructure', 'institutional', 'interpretation', 'investigation', 'manufacturer',
    'mediterranean', 'neighbourhood', 'nevertheless', 'opportunities', 'participation',
    'pharmaceutical', 'philosophical', 'photographers', 'pronunciation', 'psychological',
    'recommendation', 'refrigerator', 'representative', 'responsibility', 'revolutionary',
    'significance', 'substantially', 'successfully', 'technological', 'understanding',
    'unfortunately', 'unprecedented', 'administration', 'appropriately', 'consciousness'
  ]
};

export function generateText(difficulty: Difficulty, wordCount: number): string {
  const words = wordLists[difficulty];
  const result: string[] = [];

  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    result.push(words[randomIndex]);
  }

  return result.join(' ');
}
