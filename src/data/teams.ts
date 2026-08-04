// Current 3 teams (REV 5 §4 structure). A 5-department reorg, if it lands, only
// swaps this file. Copy follows the REV 6 doctrine: outline the teams, don't
// itemize them — results-state over routine, iceberg mostly underwater.

export type Team = {
  slug: string
  name: string
  english: string
  tagline: string
  story: string
}

export const teams: Team[] = [
  {
    slug: 'research',
    name: '리서치',
    english: 'Research',
    tagline: '논문·프로토콜 리서치',
    story: '블록체인 논문과 프로토콜을 연구하고, 분석 결과를 글로 남깁니다.',
  },
  {
    slug: 'dev',
    name: '개발',
    english: 'Development',
    tagline: '만들고, 겨룬다',
    story:
      '스마트 컨트랙트와 DApp을 개발합니다. BuidlHack 2026에는 두 팀이 참가했습니다.',
  },
  {
    slug: 'degen',
    name: '디젠',
    english: 'Degen',
    tagline: '온체인·퀀트 트레이딩',
    story: '온체인 데이터와 퀀트 전략을 연구하고, 트레이딩에 적용합니다.',
  },
]
