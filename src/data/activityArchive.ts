import { activities, type Activity } from './activities'

export type ActivityArchiveItem = Activity & {
  slug: string
  kind: 'Hackathon' | 'Session' | 'Study' | 'Community'
  summary: string
  result?: string
  relatedSlugs: string[]
}

export const activityArchive: ActivityArchiveItem[] = [
  {
    ...activities[0],
    src: '/images/activities/mantle-hackathon.webp',
    width: 1800,
    height: 1350,
    slug: 'mantle-hackathon',
    kind: 'Hackathon',
    summary: 'Mantle Global Hackathon 현장에서 함께한 BlueNode 구성원들의 활동 기록입니다.',
    relatedSlugs: ['buidl-hack-first-place'],
  },
  {
    ...activities[4],
    src: '/images/activities/buidl-hack-first-place.webp',
    slug: 'buidl-hack-first-place',
    kind: 'Hackathon',
    summary: 'BUIDL Hack 2026에서 1위를 수상한 팀의 현장 기록입니다.',
    result: 'BUIDL Hack 2026 · BNB Chain Track — 1st Place',
    relatedSlugs: ['mantle-hackathon'],
  },
  {
    ...activities[1],
    src: '/images/activities/tiger-research.webp',
    width: 1800,
    height: 1350,
    slug: 'tiger-research',
    kind: 'Community',
    summary: 'Tiger Research 공간에서 함께한 BlueNode 구성원들의 교류 기록입니다.',
    relatedSlugs: ['ninja-labs-session'],
  },
  {
    ...activities[2],
    src: '/images/activities/ninja-labs-lecture.webp',
    slug: 'ninja-labs-session',
    kind: 'Session',
    summary: '강의실에서 Ninja Labs 세션을 듣는 참가자들의 현장 기록입니다.',
    relatedSlugs: ['ninja-labs-group'],
  },
  {
    ...activities[3],
    src: '/images/activities/ninja-labs-group.webp',
    slug: 'ninja-labs-group',
    kind: 'Session',
    summary: 'Ninja Labs 세션을 마치고 함께한 참가자들의 기록입니다.',
    relatedSlugs: ['ninja-labs-session'],
  },
  {
    ...activities[5],
    src: '/images/activities/onboarding-study.webp',
    width: 1350,
    height: 1800,
    slug: 'onboarding-study',
    kind: 'Study',
    summary: '강의실에서 진행한 BlueNode 온보딩 스터디의 현장 기록입니다.',
    relatedSlugs: ['tiger-research'],
  },
]

export function getActivityBySlug(slug: string): ActivityArchiveItem | undefined {
  return activityArchive.find((activity) => activity.slug === slug)
}
