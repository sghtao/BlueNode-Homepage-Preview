import createGlobe, { type Globe } from 'cobe'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type SceneName =
  | 'entry'
  | 'bluenode'
  | 'about'
  | 'activities'
  | 'awards'
  | 'research'
  | 'network'
  | 'join'

type SceneRange = {
  name: SceneName
  start: number
  end: number
}

const TOTAL_VH = 1540
const RESPONSIVE_TOTAL_VH = 1160
const BACKGROUND_DESIGN_WIDTH = 1440
const BACKGROUND_DESIGN_HEIGHT = 900
const sceneRanges: SceneRange[] = [
  { name: 'entry', start: 0, end: 150 },
  { name: 'bluenode', start: 150, end: 270 },
  { name: 'about', start: 270, end: 450 },
  { name: 'activities', start: 450, end: 750 },
  { name: 'awards', start: 750, end: 940 },
  { name: 'research', start: 940, end: 1160 },
  { name: 'network', start: 1160, end: 1380 },
  { name: 'join', start: 1380, end: 1540 },
]

const responsiveSceneRanges: SceneRange[] = [
  { name: 'entry', start: 0, end: 110 },
  { name: 'bluenode', start: 110, end: 200 },
  { name: 'about', start: 200, end: 350 },
  { name: 'activities', start: 350, end: 560 },
  { name: 'awards', start: 560, end: 710 },
  { name: 'research', start: 710, end: 875 },
  { name: 'network', start: 875, end: 1030 },
  { name: 'join', start: 1030, end: 1160 },
]

const backgroundOrbNames = ['milk', 'ivory', 'cool', 'pearl', 'ice'] as const
type BackgroundOrbName = (typeof backgroundOrbNames)[number]
type BackgroundOrbGeometry = {
  x: number
  y: number
  width: number
  height: number
  opacity?: number
}

const backgroundGeometry: Record<SceneName, Record<BackgroundOrbName, BackgroundOrbGeometry>> = {
  entry: {
    milk: { x: -170, y: 110, width: 610, height: 500 },
    ivory: { x: 410, y: -220, width: 540, height: 440 },
    cool: { x: 1040, y: 20, width: 570, height: 650 },
    pearl: { x: 170, y: 570, width: 720, height: 430 },
    ice: { x: 940, y: 640, width: 500, height: 360 },
  },
  bluenode: {
    milk: { x: -180, y: -210, width: 720, height: 650 },
    ivory: { x: 930, y: -220, width: 760, height: 680 },
    cool: { x: 510, y: 70, width: 570, height: 650, opacity: 0 },
    pearl: { x: 820, y: 500, width: 720, height: 560 },
    ice: { x: 40, y: 520, width: 740, height: 560 },
  },
  about: {
    milk: { x: -160, y: -120, width: 560, height: 520 },
    ivory: { x: -210, y: 520, width: 650, height: 520 },
    cool: { x: 720, y: -180, width: 760, height: 650 },
    pearl: { x: 760, y: 540, width: 820, height: 470 },
    ice: { x: 1070, y: 150, width: 520, height: 480 },
  },
  activities: {
    milk: { x: -250, y: 380, width: 720, height: 650 },
    ivory: { x: 980, y: -250, width: 620, height: 520 },
    cool: { x: 420, y: 40, width: 900, height: 720 },
    pearl: { x: 1030, y: 560, width: 580, height: 420 },
    ice: { x: 680, y: -220, width: 520, height: 480 },
  },
  awards: {
    milk: { x: -260, y: -210, width: 690, height: 560 },
    ivory: { x: 940, y: -210, width: 650, height: 520 },
    cool: { x: 330, y: 40, width: 760, height: 600 },
    pearl: { x: -150, y: 560, width: 760, height: 460 },
    ice: { x: 940, y: 570, width: 610, height: 430 },
  },
  research: {
    milk: { x: -220, y: -150, width: 660, height: 560 },
    ivory: { x: 790, y: -260, width: 640, height: 470 },
    cool: { x: 440, y: 210, width: 760, height: 650 },
    pearl: { x: -120, y: 520, width: 790, height: 460 },
    ice: { x: 1030, y: 555, width: 590, height: 440 },
  },
  network: {
    milk: { x: -330, y: 470, width: 900, height: 720 },
    ivory: { x: 1050, y: -280, width: 700, height: 560 },
    cool: { x: 170, y: -90, width: 1100, height: 760 },
    pearl: { x: 1060, y: 470, width: 650, height: 540 },
    ice: { x: 500, y: -210, width: 700, height: 560 },
  },
  join: {
    milk: { x: -270, y: -185, width: 660, height: 560 },
    ivory: { x: 850, y: -245, width: 640, height: 470 },
    cool: { x: 520, y: 205, width: 760, height: 650 },
    pearl: { x: -180, y: 535, width: 790, height: 460 },
    ice: { x: 1040, y: 585, width: 590, height: 440 },
  },
}

const q = <T extends Element>(root: ParentNode, selector: string) => root.querySelector<T>(selector)
const qa = <T extends Element>(root: ParentNode, selector: string) => [
  ...root.querySelectorAll<T>(selector),
]

function initialisePrototype() {
  const root = q<HTMLElement>(document, '[data-prototype-root]')
  const viewport = q<HTMLElement>(document, '[data-prototype-viewport]')
  const header = q<HTMLElement>(document, '[data-prototype-header]')
  const progressFill = q<HTMLElement>(document, '[data-progress-fill]')

  if (!root || !viewport || !header || !progressFill) return

  const scenes = qa<HTMLElement>(root, '[data-scene]')
  const sceneByName = new Map<SceneName, HTMLElement>()
  scenes.forEach((scene) => sceneByName.set(scene.dataset.scene as SceneName, scene))

  const entry = sceneByName.get('entry')
  const bluenode = sceneByName.get('bluenode')
  const about = sceneByName.get('about')
  const activities = sceneByName.get('activities')
  const awards = sceneByName.get('awards')
  const research = sceneByName.get('research')
  const network = sceneByName.get('network')
  const join = sceneByName.get('join')

  if (!entry || !bluenode || !about || !activities || !awards || !research || !network || !join) {
    return
  }

  const entryType = q<HTMLElement>(entry, '[data-entry-type]')
  const entryScrollCue = q<HTMLElement>(entry, '[data-entry-scroll-cue]')
  const bluenodeLogo = q<HTMLElement>(bluenode, '[data-bluenode-logo]')
  const aboutType = q<HTMLElement>(about, '[data-about-type]')
  const aboutPengu = q<HTMLElement>(about, '[data-about-pengu]')
  const aboutMeta = q<HTMLElement>(about, '[data-about-meta]')
  const aboutCta = q<HTMLElement>(about, '[data-about-cta]')
  const activitiesWord = q<HTMLElement>(activities, '[data-activities-word]')
  const activitiesRail = q<HTMLElement>(activities, '[data-activities-rail]')
  const activityCards = qa<HTMLElement>(activities, '[data-activity-card]')
  const activityImages = activityCards.map((card) => q<HTMLImageElement>(card, 'img'))
  const activityTitles = qa<HTMLElement>(activities, '[data-activity-title]')
  const activitiesCta = q<HTMLElement>(activities, '[data-activities-cta]')
  const awardsTitle = q<HTMLElement>(awards, '[data-awards-title]')
  const awardRows = qa<HTMLElement>(awards, '[data-award-row]')
  const awardsCount = q<HTMLElement>(awards, '[data-awards-count]')
  const researchTitle = q<HTMLElement>(research, '[data-research-title]')
  const researchList = q<HTMLElement>(research, '.research-list')
  const researchRows = qa<HTMLElement>(research, '[data-research-row]')
  const researchAll = q<HTMLElement>(research, '[data-research-all]')
  const researchSource = q<HTMLElement>(research, '[data-research-source]')
  const networkTitle = q<HTMLElement>(network, '[data-network-title]')
  const networkOrigin = q<HTMLElement>(network, '[data-network-origin]')
  const networkStage = q<HTMLElement>(network, '[data-network-globe-stage]')
  const networkHub = q<HTMLElement>(network, '[data-network-hub]')
  const networkDomesticRoutes = q<HTMLImageElement>(network, '[data-network-domestic-routes]')
  const networkFarRoutes = q<HTMLImageElement>(network, '[data-network-far-routes]')
  const domesticLabels = qa<HTMLElement>(network, '[data-network-domestic] .network-label')
  const farLabels = qa<HTMLElement>(network, '[data-network-far] .network-label')
  const networkCta = q<HTMLElement>(network, '[data-network-cta]')
  const joinTitle = q<HTMLElement>(join, '[data-join-title]')
  const joinFields = qa<HTMLElement>(join, '[data-join-field]')
  const joinInterests = q<HTMLElement>(join, '[data-join-interests]')
  const joinSubmit = q<HTMLElement>(join, '[data-join-submit]')
  const joinFooter = q<HTMLElement>(join, '[data-join-footer]')
  const navigationButtons = qa<HTMLButtonElement>(header, '[data-jump-vh]')
  const backgroundOrbs = Object.fromEntries(
    backgroundOrbNames.map((name) => [
      name,
      q<HTMLImageElement>(root, `[data-background-orb="${name}"]`),
    ]),
  ) as Record<BackgroundOrbName, HTMLImageElement | null>

  if (backgroundOrbNames.some((name) => !backgroundOrbs[name])) return

  const activeBackgroundOrbs = backgroundOrbs as Record<BackgroundOrbName, HTMLImageElement>

  let lastSceneName: SceneName | undefined
  let lastActivityIndex = -1
  let lastAboutCtaInteractive: boolean | undefined

  const setAboutCtaInteractive = (time: number, start = 394, end = 414) => {
    const interactive = time >= start && time < end
    if (interactive === lastAboutCtaInteractive || !aboutCta) return
    lastAboutCtaInteractive = interactive
    const button = aboutCta as HTMLButtonElement
    button.tabIndex = interactive ? 0 : -1
    if (interactive) button.removeAttribute('aria-disabled')
    else button.setAttribute('aria-disabled', 'true')
  }

  const setActiveScene = (time: number, ranges = sceneRanges) => {
    const range = ranges.find((candidate, index) => {
      const isLast = index === ranges.length - 1
      return time >= candidate.start && (time < candidate.end || isLast)
    }) ?? ranges[0]

    if (range.name === lastSceneName) return
    lastSceneName = range.name
    root.dataset.activeScene = range.name

    scenes.forEach((scene) => {
      const active = scene.dataset.scene === range.name
      scene.classList.toggle('is-active', active)
      scene.setAttribute('aria-hidden', String(!active))
      scene.inert = !active
    })

    navigationButtons.forEach((button) => {
      const destination = Number(button.dataset.jumpVh ?? 0)
      const active = destination === range.start
      if (active) button.setAttribute('aria-current', 'page')
      else button.removeAttribute('aria-current')
    })
  }

  const setActiveActivity = (time: number) => {
    let index = 0
    if (time >= 675) index = 3
    else if (time >= 603) index = 2
    else if (time >= 518) index = 1
    if (index === lastActivityIndex) return
    lastActivityIndex = index
    activityTitles.forEach((title, titleIndex) => {
      title.setAttribute('aria-hidden', String(titleIndex !== index))
    })
  }

  const bindFormControls = () => {
    qa<HTMLButtonElement>(join, '.join-interests button').forEach((button) => {
      button.addEventListener('click', () => {
        const active = button.classList.toggle('is-active')
        button.setAttribute('aria-pressed', String(active))
      })
    })
    q<HTMLFormElement>(join, '[data-join-form]')?.addEventListener('submit', (event) => {
      event.preventDefault()
    })
  }

  const jumpToVh = (
    targetVh: number,
    timeline?: gsap.core.Timeline,
    totalVh = TOTAL_VH,
    ranges = sceneRanges,
  ) => {
    const trigger = timeline?.scrollTrigger
    if (!trigger) {
      const targetName = ranges.find((range) => range.start === targetVh)?.name
      sceneByName.get(targetName ?? 'entry')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    const targetScroll = trigger.start + (targetVh / totalVh) * (trigger.end - trigger.start)
    window.scrollTo({ top: targetScroll, behavior: 'smooth' })
  }

  type GlobeController = {
    render: (timelineTime?: number, rangeStart?: number, rangeDuration?: number) => void
    destroy: () => void
  }

  const initialiseGlobe = (): GlobeController => {
    const canvas = q<HTMLCanvasElement>(network, '[data-network-canvas]')
    const stage = q<HTMLElement>(network, '[data-network-globe-stage]')
    const fallback = q<HTMLElement>(network, '[data-network-fallback]')
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
    )
    const globePixelRatio = Math.min(devicePixelRatio || 1, 2)

    const INCHEON: [number, number] = [37.4563, 126.7052]
    const INITIAL_PHI = Math.PI / 2 - (INCHEON[1] * Math.PI) / 180 + Math.PI
    const INITIAL_THETA = (INCHEON[0] * Math.PI) / 180

    let globe: Globe | undefined
    let phi = INITIAL_PHI
    let theta = INITIAL_THETA
    let dragStartX = 0
    let dragStartY = 0
    let dragStartPhi = phi
    let dragStartTheta = theta
    let dragging = false

    const showFallback = () => {
      stage?.classList.remove('is-cobe-ready')
      fallback?.setAttribute('aria-hidden', 'false')
    }

    const resize = () => {
      if (!canvas || !globe) return
      const bounds = canvas.getBoundingClientRect()
      globe.update({
        width: Math.max(1, Math.round(bounds.width)),
        height: Math.max(1, Math.round(bounds.height)),
        devicePixelRatio: globePixelRatio,
        phi,
        theta,
      })
    }

    if (!canvas || !stage || saveData) {
      showFallback()
      return { render: () => undefined, destroy: () => undefined }
    }

    const hasWebGl = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
    if (!hasWebGl) {
      showFallback()
      return { render: () => undefined, destroy: () => undefined }
    }

    try {
      const bounds = canvas.getBoundingClientRect()
      globe = createGlobe(canvas, {
        width: Math.max(1, Math.round(bounds.width)),
        height: Math.max(1, Math.round(bounds.height)),
        devicePixelRatio: globePixelRatio,
        phi,
        theta,
        dark: 0,
        diffuse: 1.2,
        opacity: 1,
        scale: 1,
        mapSamples: 16000,
        mapBrightness: 6,
        mapBaseBrightness: 0,
        baseColor: [1, 1, 1],
        markerColor: [0.2, 0.4, 1],
        glowColor: [1, 1, 1],
        arcColor: [0.3, 0.5, 1],
        arcWidth: 0.5,
        arcHeight: 0.3,
        markerElevation: 0,
        markers: [],
        arcs: [],
      })
      stage.classList.add('is-cobe-ready')
      fallback?.setAttribute('aria-hidden', 'true')
      resize()
    } catch {
      globe = undefined
      showFallback()
    }

    const render = (timelineTime = 1160, rangeStart = 1160, rangeDuration = 220) => {
      if (!globe || !canvas || document.hidden) return
      if (!dragging) {
        const localProgress = Math.max(0, Math.min(1, (timelineTime - rangeStart) / rangeDuration))
        phi = INITIAL_PHI + localProgress * 0.24
      }
      resize()
    }

    canvas.addEventListener('pointerdown', (event) => {
      if (!globe) return
      dragging = true
      dragStartX = event.clientX
      dragStartY = event.clientY
      dragStartPhi = phi
      dragStartTheta = theta
      canvas.setPointerCapture(event.pointerId)
    })

    canvas.addEventListener('pointermove', (event) => {
      if (!dragging || !globe) return
      phi = dragStartPhi + (event.clientX - dragStartX) / 260
      theta = Math.max(-1.05, Math.min(1.05, dragStartTheta + (event.clientY - dragStartY) / 360))
      resize()
    })

    const stopDragging = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    }

    canvas.addEventListener('pointerup', stopDragging)
    canvas.addEventListener('pointercancel', stopDragging)

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    return {
      render,
      destroy: () => {
        observer.disconnect()
        globe?.destroy()
      },
    }
  }

  bindFormControls()

  const media = gsap.matchMedia()
  media.add(
    {
      desktop: '(min-width: 1024px)',
      responsive: '(max-width: 1023px)',
      compact: '(max-height: 700px)',
      reduce: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { desktop, compact, reduce } = context.conditions as {
        desktop: boolean
        compact: boolean
        reduce: boolean
      }

      if (!desktop && reduce) {
        const responsiveStaticScenes = [entry, bluenode, about, activities, awards, research, network, join]
        root.classList.add('is-responsive-static')

        scenes.forEach((scene) => {
          const visible = responsiveStaticScenes.includes(scene)
          scene.setAttribute('aria-hidden', String(!visible))
          scene.inert = !visible
        })

        if (aboutCta) {
          const aboutButton = aboutCta as HTMLButtonElement
          aboutButton.removeAttribute('aria-disabled')
          aboutButton.tabIndex = 0
        }

        const mobileBrandButtons = qa<HTMLButtonElement>(root, '.responsive-scene-header__brand')
        const jumpToEntry = () => entry.scrollIntoView({ behavior: 'smooth' })
        mobileBrandButtons.forEach((button) => button.addEventListener('click', jumpToEntry))

        return () => {
          root.classList.remove('is-responsive-static')
          mobileBrandButtons.forEach((button) => button.removeEventListener('click', jumpToEntry))
          scenes.forEach((scene, index) => {
            const active = index === 0
            scene.setAttribute('aria-hidden', String(!active))
            scene.inert = !active
          })
        }
      }

      if (!desktop) {
        root.classList.remove('is-responsive-static', 'is-reduced')
        root.classList.add('is-responsive-motion')
        const globe = initialiseGlobe()

        if (aboutCta) {
          const aboutButton = aboutCta as HTMLButtonElement
          aboutButton.removeAttribute('aria-disabled')
          aboutButton.tabIndex = 0
        }

        gsap.set(scenes, { autoAlpha: 0, yPercent: 0, scale: 1 })
        gsap.set(entry, { autoAlpha: 1, yPercent: 0 })
        gsap.set([bluenode, about, activities], { autoAlpha: 1, yPercent: 100 })
        gsap.set([awards, research, network, join], { autoAlpha: 0, yPercent: 0 })

        gsap.set(bluenodeLogo, { autoAlpha: 1, scale: 0.94, xPercent: -50, yPercent: -50 })
        gsap.set(aboutType, { autoAlpha: 0.35, x: -18 })
        gsap.set(aboutPengu, { autoAlpha: 0, x: 30, scale: 0.96 })
        gsap.set(aboutMeta, { autoAlpha: 0, y: 14 })
        gsap.set(aboutCta, { autoAlpha: 0, y: 12, scale: 0.97 })
        gsap.set(activitiesWord, { autoAlpha: 0 })
        gsap.set([activitiesRail, activitiesCta], { autoAlpha: 0 })
        gsap.set([awardsTitle, awardsCount, researchTitle, researchAll, researchSource], {
          autoAlpha: 0,
          y: 18,
        })
        gsap.set(awardRows, { autoAlpha: 0, y: 14 })
        const compactResearchRowOffset = researchRows[0]?.offsetHeight || 220
        if (compact) {
          researchRows.forEach((row, index) => {
            gsap.set(row, { autoAlpha: 0, y: 14 - index * compactResearchRowOffset })
          })
        } else {
          gsap.set(researchRows, { autoAlpha: 0, y: 14 })
        }
        if (researchList) gsap.set(researchList, { y: 0 })
        gsap.set([networkTitle, networkOrigin, joinTitle], { autoAlpha: 0, y: 18 })
        gsap.set([networkStage, networkHub, networkDomesticRoutes, networkFarRoutes, networkCta], {
          autoAlpha: 0,
        })
        gsap.set(networkStage, { scale: 0.94, yPercent: 4 })
        gsap.set(domesticLabels, { autoAlpha: 0, y: 8 })
        gsap.set(farLabels, { autoAlpha: 0, y: 8 })
        gsap.set([...joinFields, joinInterests, joinSubmit], { autoAlpha: 0, y: 12 })
        gsap.set(joinFooter, { autoAlpha: 0 })

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: () => {
            const time = timeline.time()
            setActiveScene(time, responsiveSceneRanges)
            setAboutCtaInteractive(time, 252, 310)
            if (time >= 845 && time <= 1040) globe.render(time, 875, 155)
          },
          scrollTrigger: {
            id: 'bluenode-responsive-prototype',
            trigger: root,
            start: 'top top',
            end: () => `+=${Math.round(innerHeight * 11.6)}`,
            pin: viewport,
            pinSpacing: true,
            scrub: 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // 01 Entry → 02 BlueNode — the next atmosphere rises with the scene instead of cutting.
        timeline.to(entryScrollCue, { autoAlpha: 0, y: -6, duration: 24 }, 58)
        timeline.to(entryType, { autoAlpha: 0.82, y: -10, duration: 40 }, 70)
        timeline.to(entry, { yPercent: -100, duration: 40 }, 70)
        timeline.to(bluenode, { yPercent: 0, duration: 40 }, 70)
        timeline.to(bluenodeLogo, { scale: 1, duration: 38, ease: 'power2.out' }, 110)

        // 02 BlueNode → 03 About — a short identity pause, then a second full-screen push.
        timeline.to(bluenode, { yPercent: -100, duration: 35 }, 165)
        timeline.to(about, { yPercent: 0, duration: 35 }, 165)
        timeline.to(bluenodeLogo, { scale: 1.025, duration: 35 }, 165)
        timeline.to(aboutType, { autoAlpha: 1, x: 0, duration: 34, ease: 'power2.out' }, 200)
        timeline.to(aboutPengu, { autoAlpha: 1, x: 0, scale: 1, duration: 44, ease: 'power3.out' }, 214)
        timeline.to(aboutMeta, { autoAlpha: 1, y: 0, duration: 30, ease: 'power2.out' }, 236)
        timeline.to(aboutCta, { autoAlpha: 1, y: 0, scale: 1, duration: 28, ease: 'power2.out' }, 252)

        // 03 About → 04 Activities — retain the approved responsive compositions during the handoff.
        timeline.to(about, { yPercent: -100, duration: 40 }, 310)
        timeline.to(activities, { yPercent: 0, duration: 40 }, 310)
        timeline.to(activitiesWord, { autoAlpha: 1, duration: 34, ease: 'power2.out' }, 350)
        timeline.to(activitiesRail, { autoAlpha: 1, duration: 42, ease: 'power2.out' }, 364)
        timeline.to(activitiesCta, { autoAlpha: 1, duration: 30, ease: 'power2.out' }, 394)

        // 04 Activities → 05 Awards — the reel holds, then dissolves into evidence.
        timeline.to(activities, { autoAlpha: 0, scale: 0.985, duration: 30 }, 530)
        timeline.to(awards, { autoAlpha: 1, duration: 30 }, 530)
        timeline.to(awardsTitle, { autoAlpha: 1, y: 0, duration: 30, ease: 'power2.out' }, 560)
        timeline.to(awardRows.slice(0, 4), {
          autoAlpha: 1,
          y: 0,
          duration: 28,
          stagger: 4,
          ease: 'power2.out',
        }, 574)
        timeline.to(awardRows.slice(4), {
          autoAlpha: 1,
          y: 0,
          duration: 28,
          stagger: 4,
          ease: 'power2.out',
        }, 610)
        timeline.to(awardsCount, { autoAlpha: 1, y: 0, duration: 24, ease: 'power2.out' }, 632)

        // 05 Awards → 06 Research — a soft editorial crossfade; compact screens scroll the list inside the scene.
        timeline.to([awardsTitle, ...awardRows, awardsCount], { autoAlpha: 0, y: -14, duration: 30 }, 680)
        timeline.to(awards, { autoAlpha: 0, duration: 30 }, 680)
        timeline.to(research, { autoAlpha: 1, duration: 30 }, 680)
        timeline.to([researchTitle, researchAll], { autoAlpha: 1, y: 0, duration: 30, ease: 'power2.out' }, 710)
        if (compact) {
          timeline.to(researchRows[0], { autoAlpha: 1, y: 0, duration: 26, ease: 'power2.out' }, 720)
          timeline.to(researchRows[0], { autoAlpha: 0, y: -14, duration: 8 }, 750)
          timeline.to(researchRows[1], {
            autoAlpha: 1,
            y: -compactResearchRowOffset,
            duration: 22,
            ease: 'power2.out',
          }, 758)
          timeline.to(researchRows[1], {
            autoAlpha: 0,
            y: -compactResearchRowOffset - 14,
            duration: 8,
          }, 790)
          timeline.to(researchRows[2], {
            autoAlpha: 1,
            y: -compactResearchRowOffset * 2,
            duration: 24,
            ease: 'power2.out',
          }, 800)
        } else {
          timeline.to(researchRows[0], { autoAlpha: 1, y: 0, duration: 28, ease: 'power2.out' }, 720)
          timeline.to(researchRows[1], { autoAlpha: 1, y: 0, duration: 28, ease: 'power2.out' }, 748)
          timeline.to(researchRows[2], { autoAlpha: 1, y: 0, duration: 28, ease: 'power2.out' }, 776)
        }
        timeline.to(researchSource, { autoAlpha: 0.62, y: 0, duration: 24, ease: 'power2.out' }, 796)

        // 06 Research → 07 Network — globe first, Korea next, distant touchpoints last.
        timeline.to(research, { autoAlpha: 0, yPercent: -5, duration: 30 }, 845)
        timeline.to(network, { autoAlpha: 1, duration: 30 }, 845)
        timeline.to([networkTitle, networkOrigin], {
          autoAlpha: 1,
          y: 0,
          duration: 30,
          ease: 'power2.out',
        }, 875)
        timeline.to(networkStage, { autoAlpha: 1, scale: 1, yPercent: 0, duration: 36, ease: 'power2.out' }, 875)
        timeline.to(networkHub, { autoAlpha: 1, duration: 26, ease: 'power2.out' }, 904)
        timeline.to(networkDomesticRoutes, { autoAlpha: 1, duration: 30, ease: 'power2.out' }, 910)
        timeline.to(domesticLabels, {
          autoAlpha: 1,
          y: 0,
          duration: 30,
          stagger: 4,
          ease: 'power2.out',
        }, 918)
        timeline.to(networkFarRoutes, { autoAlpha: 1, duration: 30, ease: 'power2.out' }, 958)
        timeline.to(farLabels, {
          autoAlpha: 0.68,
          y: 0,
          duration: 30,
          stagger: 8,
          ease: 'power2.out',
        }, 964)
        timeline.to(networkCta, { autoAlpha: 1, duration: 26, ease: 'power2.out' }, 988)

        // 07 Network → 08 Join — relationship marks quiet down before the invitation takes over.
        timeline.to([
          networkHub,
          networkDomesticRoutes,
          networkFarRoutes,
          ...domesticLabels,
          ...farLabels,
          networkCta,
        ], { autoAlpha: 0, duration: 28 }, 1002)
        timeline.to(network, { autoAlpha: 0, scale: 0.985, duration: 28 }, 1002)
        timeline.to(join, { autoAlpha: 1, duration: 28 }, 1002)
        timeline.to(joinTitle, { autoAlpha: 1, y: 0, duration: 32, ease: 'power2.out' }, 1030)
        timeline.to(joinFields, {
          autoAlpha: 1,
          y: 0,
          duration: 32,
          stagger: 7,
          ease: 'power2.out',
        }, 1060)
        timeline.to([joinInterests, joinSubmit], {
          autoAlpha: 1,
          y: 0,
          duration: 32,
          ease: 'power2.out',
        }, 1090)
        timeline.to(joinFooter, { autoAlpha: 1, duration: 28, ease: 'power2.out' }, 1122)

        lastSceneName = undefined
        setActiveScene(0, responsiveSceneRanges)
        setAboutCtaInteractive(0, 252, 310)

        const mobileBrandButtons = qa<HTMLButtonElement>(root, '.responsive-scene-header__brand')
        const mobileJoinButtons = qa<HTMLButtonElement>(root, '.responsive-scene-header__join')
        const jumpToEntry = () => jumpToVh(0, timeline, RESPONSIVE_TOTAL_VH, responsiveSceneRanges)
        const jumpToJoin = () => jumpToVh(1030, timeline, RESPONSIVE_TOTAL_VH, responsiveSceneRanges)
        mobileBrandButtons.forEach((button) => button.addEventListener('click', jumpToEntry))
        mobileJoinButtons.forEach((button) => button.addEventListener('click', jumpToJoin))

        const refresh = () => ScrollTrigger.refresh()
        document.fonts?.ready.then(refresh)
        addEventListener('load', refresh, { once: true })

        return () => {
          mobileBrandButtons.forEach((button) => button.removeEventListener('click', jumpToEntry))
          mobileJoinButtons.forEach((button) => button.removeEventListener('click', jumpToJoin))
          removeEventListener('load', refresh)
          timeline.scrollTrigger?.kill()
          timeline.kill()
          globe.destroy()
          root.classList.remove('is-responsive-motion')
          lastSceneName = undefined
          lastAboutCtaInteractive = undefined
        }
      }

      const globe = initialiseGlobe()

      if (reduce) {
        root.classList.add('is-reduced')
        if (aboutCta) {
          const aboutButton = aboutCta as HTMLButtonElement
          aboutButton.removeAttribute('aria-disabled')
          aboutButton.tabIndex = 0
        }
        scenes.forEach((scene) => {
          scene.removeAttribute('aria-hidden')
          scene.inert = false
        })
        navigationButtons.forEach((button) => {
          button.addEventListener('click', () => jumpToVh(Number(button.dataset.jumpVh ?? 0)))
        })
        globe.render(1160)
        return () => {
          root.classList.remove('is-reduced')
          globe.destroy()
        }
      }

      root.classList.remove('is-reduced')

      const interpolateActivityValue = (medium: number, large: number) => {
        const progress = Math.max(0, Math.min(1, (innerWidth - 1024) / (1440 - 1024)))
        return medium + (large - medium) * progress
      }
      const activitySideScaleX = () => interpolateActivityValue(330 / 460, 430 / 570)
      const activitySideScaleY = () => interpolateActivityValue(254 / 412, 331 / 511)
      const activitySideOffsetY = () => interpolateActivityValue(15, 8)

      gsap.set(scenes, { autoAlpha: 1, yPercent: 100 })
      gsap.set(entry, { autoAlpha: 1, yPercent: 0 })
      gsap.set([awards, research, network, join], { autoAlpha: 0, yPercent: 0 })
      backgroundOrbNames.forEach((name) => {
        gsap.set(activeBackgroundOrbs[name], {
          opacity: backgroundGeometry.entry[name].opacity ?? 1,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
        })
      })
      gsap.set(bluenodeLogo, { autoAlpha: 1, scale: 0.96, xPercent: -50, yPercent: -50 })
      gsap.set(aboutType, { autoAlpha: 0.35, x: -32 })
      gsap.set(aboutPengu, { autoAlpha: 0, x: 80, scale: 0.92 })
      gsap.set(aboutMeta, { autoAlpha: 0, y: 24 })
      gsap.set(aboutCta, { autoAlpha: 0, y: 18, scale: 0.96 })
      gsap.set(activitiesWord, { autoAlpha: 0, y: 30 })
      gsap.set(activitiesCta, { autoAlpha: 0, y: 16, scale: 0.96 })
      gsap.set(activityCards, {
        autoAlpha: 1,
        scaleX: activitySideScaleX,
        scaleY: activitySideScaleY,
        y: activitySideOffsetY,
        '--activity-active-border': 0,
      })
      gsap.set(activityImages, { scaleY: 1.16465 })
      gsap.set(activityCards[0], {
        autoAlpha: 1,
        scaleX: 1,
        scaleY: 1,
        y: 0,
        '--activity-active-border': 1,
      })
      gsap.set(activityImages[0], { scaleY: 1 })
      gsap.set(activityTitles, { autoAlpha: 0, y: 12 })
      gsap.set(activityTitles[0], { autoAlpha: 1, y: 0 })
      gsap.set([awardsTitle, researchTitle, researchAll, researchSource, networkTitle, networkOrigin, joinTitle], {
        autoAlpha: 0,
        y: 26,
      })
      gsap.set([networkStage, networkHub, networkDomesticRoutes, networkFarRoutes, networkCta], { autoAlpha: 0 })
      gsap.set(networkStage, { scale: 0.93, yPercent: 5 })
      gsap.set(networkCta, { xPercent: -50 })
      gsap.set(domesticLabels, { autoAlpha: 0, y: 10 })
      gsap.set(farLabels, { autoAlpha: 0, y: 10 })
      gsap.set([...joinFields, joinInterests, joinSubmit], { autoAlpha: 0, y: 16 })
      gsap.set(joinFooter, { autoAlpha: 0 })

      const railX = (index: number) => () => {
        const card = activityCards[0]
        if (!card || !activitiesRail) return 0
        // Use the untransformed layout width so later stops stay centered after
        // the first card has already become a scaled side preview.
        const cardWidth = card.offsetWidth
        const gap = Number.parseFloat(getComputedStyle(activitiesRail).columnGap || '0')
        return innerWidth / 2 - cardWidth / 2 - index * (cardWidth + gap)
      }
      gsap.set(activitiesRail, { x: railX(0) })

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: () => {
          const time = timeline.time()
          setActiveScene(time)
          setActiveActivity(time)
          setAboutCtaInteractive(time)
          if (time >= 1120 && time <= 1400) globe.render(time)
        },
        scrollTrigger: {
          id: 'bluenode-desktop-prototype',
          trigger: root,
          start: 'top top',
          end: () => `+=${Math.round(innerHeight * 15.4)}`,
          pin: viewport,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      const addBackgroundTransition = (scene: SceneName, start: number, duration: number) => {
        backgroundOrbNames.forEach((name) => {
          const base = backgroundGeometry.entry[name]
          const target = backgroundGeometry[scene][name]
          timeline.to(
            activeBackgroundOrbs[name],
            {
              x: () => ((target.x - base.x) / BACKGROUND_DESIGN_WIDTH) * viewport.clientWidth,
              y: () => ((target.y - base.y) / BACKGROUND_DESIGN_HEIGHT) * viewport.clientHeight,
              scaleX: target.width / base.width,
              scaleY: target.height / base.height,
              opacity: target.opacity ?? 1,
              duration,
              ease: 'none',
            },
            start,
          )
        })
      }

      timeline.to(progressFill, { scaleX: 1, duration: TOTAL_VH }, 0)
      timeline.to(Object.values(activeBackgroundOrbs), { y: 8, duration: 68 }, 0)

      addBackgroundTransition('bluenode', 68, 82)
      addBackgroundTransition('about', 192, 78)
      addBackgroundTransition('activities', 414, 81)
      addBackgroundTransition('awards', 720, 30)
      addBackgroundTransition('research', 900, 40)
      addBackgroundTransition('network', 1120, 40)
      addBackgroundTransition('join', 1340, 40)

      // 01 Entry / 0–150vh — read, micro-hold, then a two-stage vertical handoff.
      timeline.to(entryScrollCue, { autoAlpha: 0, y: -8, duration: 28 }, 68)
      timeline.to(entry, { yPercent: -45, duration: 40 }, 68)
      timeline.to(bluenode, { yPercent: 55, duration: 40 }, 68)
      timeline.to(entryType, { autoAlpha: 0.82, y: -12, duration: 40 }, 68)
      timeline.to(entry, { yPercent: -100, duration: 42 }, 108)
      timeline.to(bluenode, { yPercent: 0, duration: 42 }, 108)
      timeline.to(header, { autoAlpha: 0, y: -8, duration: 42 }, 108)

      // 02 BlueNode / 150–270vh — logo pause before the next full-viewport push.
      timeline.to(bluenodeLogo, { scale: 1, duration: 42, ease: 'power2.out' }, 150)
      timeline.to(bluenode, { yPercent: -45, duration: 44 }, 192)
      timeline.to(about, { yPercent: 55, duration: 44 }, 192)
      timeline.to(bluenodeLogo, { scale: 1.03, duration: 44 }, 192)
      timeline.to(bluenode, { yPercent: -100, duration: 34 }, 236)
      timeline.to(about, { yPercent: 0, duration: 34 }, 236)
      timeline.to(header, { autoAlpha: 1, y: 0, duration: 34 }, 236)

      // 03 About / 270–450vh — type, Pengu, metadata, then CTA.
      timeline.to(aboutType, { autoAlpha: 1, x: 0, duration: 45, ease: 'power2.out' }, 270)
      timeline.to(aboutPengu, { autoAlpha: 1, x: 0, scale: 1, duration: 65, ease: 'power3.out' }, 310)
      timeline.to(aboutMeta, { autoAlpha: 1, y: 0, duration: 50, ease: 'power2.out' }, 338)
      timeline.to(aboutCta, { autoAlpha: 1, y: 0, scale: 1, duration: 44, ease: 'power2.out' }, 350)
      timeline.to(about, { yPercent: -45, duration: 36 }, 414)
      timeline.to(activities, { yPercent: 55, duration: 36 }, 414)

      // 04 Activities / 450–750vh — vertical scroll drives a four-stop horizontal reel.
      timeline.to(about, { yPercent: -100, duration: 45 }, 450)
      timeline.to(activities, { yPercent: 0, duration: 45 }, 450)
      timeline.to(activitiesWord, { autoAlpha: 1, y: 0, duration: 45, ease: 'power2.out' }, 450)
      timeline.to(activitiesRail, { x: railX(1), duration: 45 }, 495)
      timeline.to(activityCards[0], {
        autoAlpha: 1,
        scaleX: activitySideScaleX,
        scaleY: activitySideScaleY,
        y: activitySideOffsetY,
        '--activity-active-border': 0,
        duration: 45,
      }, 495)
      timeline.to(activityImages[0], { scaleY: 1.16465, duration: 45 }, 495)
      timeline.to(activityCards[1], {
        autoAlpha: 1,
        scaleX: 1,
        scaleY: 1,
        y: 0,
        '--activity-active-border': 1,
        duration: 45,
      }, 495)
      timeline.to(activityImages[1], { scaleY: 1, duration: 45 }, 495)
      timeline.to(activityTitles[0], { autoAlpha: 0, y: -12, duration: 20 }, 495)
      timeline.to(activityTitles[1], { autoAlpha: 1, y: 0, duration: 25 }, 515)
      timeline.to(activitiesCta, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 30,
        ease: 'power2.out',
      }, 510)

      // Hold the Figma-authored BUIDLHACK composition before advancing the reel.
      timeline.to(activitiesRail, { x: railX(2), duration: 55 }, 575)
      timeline.to(activityCards[1], {
        autoAlpha: 1,
        scaleX: activitySideScaleX,
        scaleY: activitySideScaleY,
        y: activitySideOffsetY,
        '--activity-active-border': 0,
        duration: 55,
      }, 575)
      timeline.to(activityImages[1], { scaleY: 1.16465, duration: 55 }, 575)
      timeline.to(activityCards[2], {
        autoAlpha: 1,
        scaleX: 1,
        scaleY: 1,
        y: 0,
        '--activity-active-border': 1,
        duration: 55,
      }, 575)
      timeline.to(activityImages[2], { scaleY: 1, duration: 55 }, 575)
      timeline.to(activityTitles[1], { autoAlpha: 0, y: -12, duration: 20 }, 575)
      timeline.to(activityTitles[2], { autoAlpha: 1, y: 0, duration: 30 }, 595)

      timeline.to(activitiesRail, { x: railX(3), duration: 50 }, 650)
      timeline.to(activityCards[2], {
        autoAlpha: 1,
        scaleX: activitySideScaleX,
        scaleY: activitySideScaleY,
        y: activitySideOffsetY,
        '--activity-active-border': 0,
        duration: 50,
      }, 650)
      timeline.to(activityImages[2], { scaleY: 1.16465, duration: 50 }, 650)
      timeline.to(activityCards[3], {
        autoAlpha: 1,
        scaleX: 1,
        scaleY: 1,
        y: 0,
        '--activity-active-border': 1,
        duration: 50,
      }, 650)
      timeline.to(activityImages[3], { scaleY: 1, duration: 50 }, 650)
      timeline.to(activityTitles[2], { autoAlpha: 0, y: -12, duration: 20 }, 650)
      timeline.to(activityTitles[3], { autoAlpha: 1, y: 0, duration: 30 }, 670)
      timeline.to(activities, { autoAlpha: 0, scale: 0.985, duration: 30 }, 720)
      timeline.to(awards, { autoAlpha: 1, duration: 30 }, 720)
      timeline.to(header, { autoAlpha: 0, y: -8, duration: 30 }, 720)

      // 05 Awards / 750–940vh — evidence rows build in two measured groups.
      timeline.to(awardsTitle, { autoAlpha: 1, y: 0, duration: 38, ease: 'power2.out' }, 750)
      timeline.to(awardRows.slice(0, 4), {
        autoAlpha: 1,
        y: 0,
        duration: 32,
        stagger: 6,
        ease: 'power2.out',
      }, 770)
      timeline.to(awardRows.slice(4), {
        autoAlpha: 1,
        y: 0,
        duration: 32,
        stagger: 6,
        ease: 'power2.out',
      }, 812)
      timeline.to(awardsCount, { autoAlpha: 1, y: 0, duration: 25, ease: 'power2.out' }, 825)
      timeline.to([awardsTitle, ...awardRows, awardsCount], {
        autoAlpha: 0,
        y: -22,
        duration: 40,
      }, 900)
      timeline.to(awards, { autoAlpha: 0, duration: 40 }, 900)
      timeline.to(research, { autoAlpha: 1, duration: 40 }, 900)
      timeline.to(header, { autoAlpha: 1, y: 0, duration: 40 }, 900)

      // 06 Research / 940–1160vh — editorial rows build, then hold as one readable page.
      timeline.to([researchTitle, researchAll], { autoAlpha: 1, y: 0, duration: 36, ease: 'power2.out' }, 940)
      timeline.to(researchRows[0], { autoAlpha: 1, y: 0, duration: 36, ease: 'power2.out' }, 948)
      timeline.to(researchRows[1], { autoAlpha: 1, y: 0, duration: 36, ease: 'power2.out' }, 985)
      timeline.to(researchRows[2], { autoAlpha: 1, y: 0, duration: 36, ease: 'power2.out' }, 1022)
      timeline.to(researchSource, { autoAlpha: 0.62, y: 0, duration: 28, ease: 'power2.out' }, 1045)
      timeline.to(research, { autoAlpha: 0, yPercent: -7, duration: 40 }, 1120)
      timeline.to(network, { autoAlpha: 1, duration: 40 }, 1120)
      timeline.to(networkStage, { autoAlpha: 1, scale: 1, yPercent: 0, duration: 40, ease: 'power2.out' }, 1120)
      timeline.to([networkTitle, networkOrigin], { autoAlpha: 1, y: 0, duration: 40, ease: 'power2.out' }, 1120)

      // 07 Network / 1160–1380vh — Korea first, distant nodes second.
      timeline.to(networkHub, { autoAlpha: 1, y: 0, duration: 44, ease: 'power2.out' }, 1160)
      timeline.to(networkDomesticRoutes, { autoAlpha: 1, duration: 45, ease: 'power2.out' }, 1170)
      timeline.to(domesticLabels, {
        autoAlpha: 1,
        y: 0,
        duration: 45,
        stagger: 5,
        ease: 'power2.out',
      }, 1188)
      timeline.to(networkFarRoutes, { autoAlpha: 1, duration: 48, ease: 'power2.out' }, 1245)
      timeline.to(farLabels, {
        autoAlpha: 0.68,
        y: 0,
        duration: 55,
        stagger: 12,
        ease: 'power2.out',
      }, 1259)
      timeline.to(networkCta, { autoAlpha: 1, duration: 36, ease: 'power2.out' }, 1280)
      timeline.to([networkHub, networkDomesticRoutes, networkFarRoutes, ...domesticLabels, ...farLabels, networkCta], { autoAlpha: 0, y: -10, duration: 40 }, 1340)
      timeline.to(network, { autoAlpha: 0, scale: 0.985, duration: 40 }, 1340)
      timeline.to(join, { autoAlpha: 1, duration: 40 }, 1340)
      timeline.to(header, { autoAlpha: 1, y: 0, duration: 40 }, 1340)

      // 08 Join / 1380–1540vh — BlueNode Original Direction editorial form.
      timeline.to(joinTitle, { autoAlpha: 1, y: 0, duration: 40, ease: 'power2.out' }, 1380)
      timeline.to(joinFields, {
        autoAlpha: 1,
        y: 0,
        duration: 40,
        stagger: 8,
        ease: 'power2.out',
      }, 1420)
      timeline.to([joinInterests, joinSubmit], {
        autoAlpha: 1,
        y: 0,
        duration: 40,
        ease: 'power2.out',
      }, 1460)
      timeline.to(joinFooter, { autoAlpha: 1, duration: 40, ease: 'power2.out' }, 1500)

      setActiveScene(0)
      setActiveActivity(0)
      setAboutCtaInteractive(0)

      const jumpHandlers = new Map<HTMLButtonElement, () => void>()
      navigationButtons.forEach((button) => {
        const handler = () => jumpToVh(Number(button.dataset.jumpVh ?? 0), timeline)
        jumpHandlers.set(button, handler)
        button.addEventListener('click', handler)
      })

      const refresh = () => ScrollTrigger.refresh()
      document.fonts?.ready.then(refresh)
      addEventListener('load', refresh, { once: true })

      return () => {
        jumpHandlers.forEach((handler, button) => button.removeEventListener('click', handler))
        removeEventListener('load', refresh)
        globe.destroy()
        timeline.scrollTrigger?.kill()
        timeline.kill()
      }
    },
  )

  addEventListener('pagehide', () => media.revert(), { once: true })
}

initialisePrototype()
