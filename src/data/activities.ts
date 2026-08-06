export type Activity = {
  title: string
  src: string
  alt: string
  width: number
  height: number
  objectPosition: string
  objectPositionXs: string
}

// The six approved people-centered moments in Figma frame 301:1141.
export const activities: Activity[] = [
  {
    title: 'Mantle Hackathon',
    src: '/images/activities/mantle-hackathon.jpeg',
    alt: 'Mantle Global Hackathon 행사장에서 함께한 BlueNode 구성원들',
    width: 1920,
    height: 1440,
    objectPosition: 'center 50%',
    objectPositionXs: 'center 50%',
  },
  {
    title: 'BlueNode × Tiger Research',
    src: '/images/activities/tiger-research.jpeg',
    alt: 'Tiger Research 공간에서 단체 사진을 찍는 BlueNode 구성원들',
    width: 2048,
    height: 1536,
    objectPosition: 'center 58%',
    objectPositionXs: 'center 55%',
  },
  {
    title: 'Ninja Labs Session / Lecture',
    src: '/images/activities/ninja-labs-lecture.jpeg',
    alt: '강의실에서 Ninja Labs 세션을 듣는 참가자들',
    width: 1280,
    height: 720,
    objectPosition: 'center 52%',
    objectPositionXs: 'center 52%',
  },
  {
    title: 'Ninja Labs Session / Group',
    src: '/images/activities/ninja-labs-group.jpeg',
    alt: 'Ninja Labs 세션을 마치고 함께한 참가자 단체 사진',
    width: 1280,
    height: 960,
    objectPosition: 'center 58%',
    objectPositionXs: 'center 55%',
  },
  {
    title: 'BUIDL Hack 1st Place',
    src: '/images/activities/buidl-hack-first-place.jpeg',
    alt: 'BUIDL Hack 2026에서 1위 수상 팻말을 든 팀',
    width: 1280,
    height: 960,
    objectPosition: 'center 58%',
    objectPositionXs: 'center 55%',
  },
  {
    title: 'Onboarding Study',
    src: '/images/activities/onboarding-study.jpeg',
    alt: '강의실에서 온보딩 스터디에 참여한 BlueNode 구성원들',
    width: 1920,
    height: 2560,
    objectPosition: 'center 60%',
    objectPositionXs: 'center 60%',
  },
]
