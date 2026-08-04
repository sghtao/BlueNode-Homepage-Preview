// Recognition that isn't a hackathon award — kept in its own row so it reads
// distinctly from the awards timeline (REV 5 §6). Owner-confirmed facts only.

export type Credential = {
  title: string
  detail: string
  year?: number
}

export const credentials: Credential[] = [
  {
    title: 'EDCON Osaka 2025 초청 연사',
    detail: 'Ethereum Foundation',
    year: 2025,
  },
  {
    title: 'Solana Superteam Korea · Guild Lead',
    detail: '카이스트 · 포스텍 · 연세 · 이화와 동격 선정',
  },
]

// Join flow (REV 5 §8 structure kept). REV 6 §2 selectivity: the four steps
// signal a threshold — the detail is a terse tone cue, not a how-to walkthrough.
export type JoinStep = {
  step: string
  name: string
  detail: string
}

export const joinSteps: JoinStep[] = [
  { step: '01', name: '지원', detail: '관심이 있다면' },
  { step: '02', name: '면접', detail: '직접 만납니다' },
  { step: '03', name: '승인', detail: '맞는 사람만' },
  { step: '04', name: '디스코드', detail: '합류가 시작됩니다' },
]
