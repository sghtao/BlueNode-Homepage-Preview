import createGlobe, { type Globe } from 'cobe'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

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

const sceneProgressTime = (ranges: SceneRange[], name: SceneName, progress: number) => {
  const range = ranges.find((candidate) => candidate.name === name)
  if (!range) return 0
  return range.start + (range.end - range.start) * progress
}

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

  // A hot-reloaded preview can otherwise retain the navigator's document-level
  // scroll lock or an earlier pinned ScrollTrigger after its DOM has changed.
  document.documentElement.classList.remove('has-prototype-navigator')
  viewport.inert = false
  ;['bluenode-responsive-prototype', 'bluenode-desktop-prototype'].forEach((id) => {
    const staleTrigger = ScrollTrigger.getById(id)
    staleTrigger?.animation?.kill()
    staleTrigger?.kill(true)
  })

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
  const aboutCta = q<HTMLButtonElement>(about, '[data-about-cta]')
  const activitiesWord = q<HTMLElement>(activities, '[data-activities-word]')
  const activitiesRail = q<HTMLElement>(activities, '[data-activities-rail]')
  const activityCards = qa<HTMLElement>(activities, '[data-activity-card]')
  const activityImages = activityCards.map((card) => q<HTMLImageElement>(card, 'img'))
  const activityTitles = qa<HTMLElement>(activities, '[data-activity-title]')
  const activitiesCta = q<HTMLButtonElement>(activities, '[data-activities-cta]')
  const awardsTitle = q<HTMLElement>(awards, '[data-awards-title]')
  const awardRows = qa<HTMLElement>(awards, '[data-award-row]')
  const awardsCount = q<HTMLElement>(awards, '[data-awards-count]')
  const researchTitle = q<HTMLElement>(research, '[data-research-title]')
  const researchList = q<HTMLElement>(research, '.research-list')
  const researchRows = qa<HTMLElement>(research, '[data-research-row]')
  const researchAll = q<HTMLElement>(research, '[data-research-all]')
  const networkTitle = q<HTMLElement>(network, '[data-network-title]')
  const networkOrigin = q<HTMLElement>(network, '[data-network-origin]')
  const networkStage = q<HTMLElement>(network, '[data-network-globe-stage]')
  const networkHub = q<HTMLElement>(network, '[data-network-hub]')
  const networkDomesticRoutes = q<HTMLImageElement>(network, '[data-network-domestic-routes]')
  const networkFarRoutes = q<HTMLImageElement>(network, '[data-network-far-routes]')
  const domesticLabels = qa<HTMLElement>(network, '[data-network-domestic] .network-label')
  const farLabels = qa<HTMLElement>(network, '[data-network-far] .network-label')
  const networkCta = q<HTMLButtonElement>(network, '[data-network-cta]')
  const joinTitle = q<HTMLElement>(join, '[data-join-title]')
  const joinFields = qa<HTMLElement>(join, '[data-join-field]')
  const joinInterests = q<HTMLElement>(join, '[data-join-interests]')
  const joinSubmit = q<HTMLElement>(join, '[data-join-submit]')
  const joinFooter = q<HTMLElement>(join, '[data-join-footer]')
  const brandButton = q<HTMLButtonElement>(header, '.prototype-header__brand')
  const navigationButtons = qa<HTMLButtonElement>(header, '[data-jump-vh]')
  const mobileJoinButton = q<HTMLButtonElement>(header, '[data-mobile-join]')
  const mobileMenuButton = q<HTMLButtonElement>(header, '[data-mobile-menu]')
  const navigatorPanel = q<HTMLElement>(root, '[data-prototype-navigator]')
  const navigatorCloseButton = q<HTMLButtonElement>(root, '[data-navigator-close]')
  const navigatorSceneButtons = qa<HTMLButtonElement>(root, '[data-navigator-scene]')
  const backgroundOrbs = Object.fromEntries(
    backgroundOrbNames.map((name) => [
      name,
      q<HTMLImageElement>(root, `[data-background-orb="${name}"]`),
    ]),
  ) as Record<BackgroundOrbName, HTMLImageElement | null>

  if (backgroundOrbNames.some((name) => !backgroundOrbs[name])) return

  const activeBackgroundOrbs = backgroundOrbs as Record<BackgroundOrbName, HTMLImageElement>

  const resetBackgroundOrbs = () => {
    backgroundOrbNames.forEach((name) => {
      gsap.set(activeBackgroundOrbs[name], {
        opacity: backgroundGeometry.entry[name].opacity ?? 1,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
      })
    })
  }

  const addBackgroundTransition = (
    timeline: gsap.core.Timeline,
    scene: SceneName,
    start: number,
    duration: number,
  ) => {
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

  let lastSceneName: SceneName | undefined
  let lastActivityIndex = -1

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

  const setActiveActivity = (time: number, stops: readonly number[] = [550, 620, 685]) => {
    let index = 0
    if (time >= stops[2]) index = 3
    else if (time >= stops[1]) index = 2
    else if (time >= stops[0]) index = 1
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
      const form = event.currentTarget as HTMLFormElement
      const destination = form.dataset.joinRoute
      if (destination) window.location.assign(destination)
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

    const updateOrientation = () => {
      globe?.update({ phi, theta })
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
      const renderMargin = Math.max(24, rangeDuration * 0.18)
      if (
        !dragging
        && (timelineTime < rangeStart - renderMargin || timelineTime > rangeStart + rangeDuration + renderMargin)
      ) return
      if (!dragging) {
        const localProgress = Math.max(0, Math.min(1, (timelineTime - rangeStart) / rangeDuration))
        phi = INITIAL_PHI + localProgress * 0.24
      }
      updateOrientation()
    }

    const startDragging = (event: PointerEvent) => {
      if (!globe) return
      dragging = true
      dragStartX = event.clientX
      dragStartY = event.clientY
      dragStartPhi = phi
      dragStartTheta = theta
      canvas.setPointerCapture(event.pointerId)
    }

    const dragGlobe = (event: PointerEvent) => {
      if (!dragging || !globe) return
      phi = dragStartPhi + (event.clientX - dragStartX) / 260
      theta = Math.max(-1.05, Math.min(1.05, dragStartTheta + (event.clientY - dragStartY) / 360))
      updateOrientation()
    }

    const stopDragging = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    }

    canvas.addEventListener('pointerdown', startDragging)
    canvas.addEventListener('pointermove', dragGlobe)
    canvas.addEventListener('pointerup', stopDragging)
    canvas.addEventListener('pointercancel', stopDragging)

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    return {
      render,
      destroy: () => {
        observer.disconnect()
        canvas.removeEventListener('pointerdown', startDragging)
        canvas.removeEventListener('pointermove', dragGlobe)
        canvas.removeEventListener('pointerup', stopDragging)
        canvas.removeEventListener('pointercancel', stopDragging)
        globe?.destroy()
      },
    }
  }

  let navigatorReturnFocus: HTMLElement | null = null
  let navigateFromPanel = (sceneName: SceneName) => {
    sceneByName.get(sceneName)?.scrollIntoView({ behavior: 'smooth' })
  }

  const setNavigatorOpen = (open: boolean) => {
    if (!navigatorPanel) return
    if (open) navigatorReturnFocus = document.activeElement as HTMLElement | null
    navigatorPanel.classList.toggle('is-open', open)
    navigatorPanel.setAttribute('aria-hidden', String(!open))
    navigatorPanel.inert = !open
    viewport.inert = open
    mobileMenuButton?.setAttribute('aria-expanded', String(open))
    document.documentElement.classList.toggle('has-prototype-navigator', open)
    if (open) navigatorCloseButton?.focus()
    else navigatorReturnFocus?.focus()
  }

  const openNavigator = () => setNavigatorOpen(true)
  const closeNavigator = () => setNavigatorOpen(false)
  const handleNavigatorKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && navigatorPanel?.classList.contains('is-open')) closeNavigator()
  }

  // Always begin unlocked, including after Astro/Vite hot reloads.
  setNavigatorOpen(false)

  // ScrollTrigger normally delegates to native scrolling. Touch-only Safari
  // can intermittently stop reporting the gestures that drive a long pinned
  // timeline, so let ScrollTrigger normalise that input on phones/tablets.
  // Pointer-only desktops retain their native scroll behaviour.
  const usesTouchNormalizer = ScrollTrigger.isTouch > 0
  const enableTouchNormalizer = () => ScrollTrigger.normalizeScroll({
    allowNestedScroll: true,
    lockAxis: true,
    // normalizeScroll's default flick momentum is too strong for this long
    // scene timeline on a phone. Cap the glide to a fraction of a second so a
    // normal swipe advances deliberately instead of skipping several scenes.
    momentum: (self) => Math.min(0.24, Math.abs(self.velocityY) / 16000),
    type: 'touch,wheel',
  })
  if (usesTouchNormalizer) enableTouchNormalizer()

  mobileMenuButton?.addEventListener('click', openNavigator)
  navigatorCloseButton?.addEventListener('click', closeNavigator)
  navigatorSceneButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const sceneName = button.dataset.navigatorScene as SceneName | undefined
      if (!sceneName) return
      closeNavigator()
      navigateFromPanel(sceneName)
    })
  })
  document.addEventListener('keydown', handleNavigatorKeydown)

  bindFormControls()

  const media = gsap.matchMedia()
  media.add(
    {
      desktop: '(min-width: 1024px)',
      responsive: '(max-width: 1023px)',
      compact: '(max-height: 700px)',
      shortLandscape: '(max-width: 1023px) and (max-height: 500px) and (orientation: landscape)',
      reduce: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { desktop, compact, shortLandscape, reduce } = context.conditions as {
        desktop: boolean
        compact: boolean
        shortLandscape: boolean
        reduce: boolean
      }

      if (!desktop && (reduce || shortLandscape)) {
        const responsiveStaticScenes = [entry, bluenode, about, activities, awards, research, network, join]
        root.classList.add('is-responsive-static')
        navigateFromPanel = (sceneName) => {
          sceneByName.get(sceneName)?.scrollIntoView({ behavior: 'smooth' })
        }

        scenes.forEach((scene) => {
          const visible = responsiveStaticScenes.includes(scene)
          scene.setAttribute('aria-hidden', String(!visible))
          scene.inert = !visible
        })

        const jumpToEntry = () => entry.scrollIntoView({ behavior: 'smooth' })
        const jumpToJoin = () => join.scrollIntoView({ behavior: 'smooth' })
        brandButton?.addEventListener('click', jumpToEntry)
        mobileJoinButton?.addEventListener('click', jumpToJoin)

        return () => {
          root.classList.remove('is-responsive-static')
          navigateFromPanel = (sceneName) => {
            sceneByName.get(sceneName)?.scrollIntoView({ behavior: 'smooth' })
          }
          brandButton?.removeEventListener('click', jumpToEntry)
          mobileJoinButton?.removeEventListener('click', jumpToJoin)
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

        resetBackgroundOrbs()
        gsap.set(progressFill, { scaleX: 0 })
        gsap.set(header, { autoAlpha: 1, y: 0 })
        gsap.set(scenes, { autoAlpha: 1, yPercent: 100, scale: 1 })
        gsap.set(entry, { yPercent: 0 })

        gsap.set(bluenodeLogo, { autoAlpha: 1, scale: 0.94, xPercent: -50, yPercent: -50 })
        gsap.set(aboutType, { autoAlpha: 0.35, x: -18 })
        gsap.set(aboutPengu, { autoAlpha: 0, x: 30, scale: 0.96 })
        gsap.set(aboutMeta, { autoAlpha: 0, y: 14 })
        gsap.set(aboutCta, { autoAlpha: 0 })
        gsap.set(activitiesWord, { autoAlpha: 0 })
        const responsiveActivityRailX = (index: number) => () => {
          const card = activityCards[0]
          if (!card || !activitiesRail) return 0
          const cardWidth = card.offsetWidth
          const gap = Number.parseFloat(getComputedStyle(activitiesRail).columnGap || '0')
          return innerWidth / 2 - cardWidth / 2 - index * (cardWidth + gap)
        }
        gsap.set(activitiesRail, { autoAlpha: 0, x: responsiveActivityRailX(0) })
        gsap.set(activityCards, {
          autoAlpha: 0.42,
          scale: 0.76,
          y: 0,
          '--activity-active-border': 0,
        })
        gsap.set(activityImages, { scale: 1 })
        gsap.set(activityCards[0], {
          autoAlpha: 1,
          scale: 1,
          '--activity-active-border': 1,
        })
        gsap.set(activityTitles, { autoAlpha: 0, y: 10 })
        gsap.set(activityTitles[0], { autoAlpha: 1, y: 0 })
        gsap.set(activitiesCta, { autoAlpha: 0 })
        gsap.set([awardsTitle, awardsCount, researchTitle, researchAll], {
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
        gsap.set([networkStage, networkHub, networkDomesticRoutes, networkFarRoutes], {
          autoAlpha: 0,
        })
        gsap.set(networkStage, { scale: 0.86, yPercent: 12 })
        gsap.set(domesticLabels, { autoAlpha: 0, y: 8 })
        gsap.set(farLabels, { autoAlpha: 0, y: 8 })
        gsap.set(networkCta, { autoAlpha: 0 })
        gsap.set([...joinFields, joinInterests, joinSubmit], { autoAlpha: 0, y: 12 })
        gsap.set(joinFooter, { autoAlpha: 0 })

        const responsiveState = (name: SceneName, progress: number) =>
          sceneProgressTime(responsiveSceneRanges, name, progress)

        // The page must visibly answer the first wheel/trackpad input. Keep the
        // full entry composition, but begin its lift after a short 8% pause.
        const entryHold = responsiveState('entry', 0.08)
        const entryLift = responsiveState('entry', 0.48)
        const entryEnd = responsiveState('entry', 1)
        const bluenodeLock = responsiveState('bluenode', 0.35)
        const bluenodeLift = responsiveState('bluenode', 0.72)
        const bluenodeEnd = responsiveState('bluenode', 1)
        const aboutTypeLock = responsiveState('about', 0.25)
        const aboutPenguLock = responsiveState('about', 0.55)
        const aboutExit = responsiveState('about', 0.82)
        const aboutEnd = responsiveState('about', 1)
        const activitiesTitleLock = responsiveState('activities', 0.15)
        const activitiesReelOneHold = responsiveState('activities', 0.23)
        const activitiesReelTwo = responsiveState('activities', 0.34)
        const activitiesReelTwoHold = responsiveState('activities', 0.43)
        const activitiesReelThree = responsiveState('activities', 0.54)
        const activitiesReelThreeHold = responsiveState('activities', 0.63)
        const activitiesReelFour = responsiveState('activities', 0.74)
        const activitiesHold = responsiveState('activities', 0.79)
        const activitiesLift = responsiveState('activities', 0.86)
        const activitiesEnd = responsiveState('activities', 1)
        const awardsStatement = responsiveState('awards', 0.15)
        const awardsEvidence = responsiveState('awards', 0.38)
        const awardsCountLock = responsiveState('awards', 0.6)
        const awardsEnd = responsiveState('awards', 1)
        const researchArticleOne = responsiveState('research', 0.15)
        const researchArticleTwo = responsiveState('research', 0.35)
        const researchArticleThree = responsiveState('research', 0.55)
        const researchEnd = responsiveState('research', 1)
        const networkStart = responsiveState('network', 0)
        const networkDomestic = responsiveState('network', 0.16)
        const networkSettle = responsiveState('network', 0.36)
        const networkContext = responsiveState('network', 0.56)
        const networkEnd = responsiveState('network', 1)
        const joinStart = responsiveState('join', 0)
        const joinStatement = responsiveState('join', 0.25)
        const joinForm = responsiveState('join', 0.5)
        const joinInterest = responsiveState('join', 0.75)
        const joinEnd = responsiveState('join', 1)

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: () => {
            const time = timeline.time()
            setActiveScene(time, responsiveSceneRanges)
            setActiveActivity(time, [
              (activitiesReelOneHold + activitiesReelTwo) / 2,
              (activitiesReelTwoHold + activitiesReelThree) / 2,
              (activitiesReelThreeHold + activitiesReelFour) / 2,
            ])
            if (time >= researchEnd - 30 && time <= networkEnd + 10) {
              globe.render(time, networkStart, networkEnd - networkStart)
            }
          },
          scrollTrigger: {
            id: 'bluenode-responsive-prototype',
            trigger: root,
            start: 'top top',
            end: () => `+=${Math.round(innerHeight * 9.4)}`,
            pin: viewport,
            pinSpacing: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // Keep the first card optically centred after a width/orientation
        // change inside the same responsive media query. ScrollTrigger can
        // invalidate function-based timeline values, while a standalone
        // gsap.set() would otherwise retain the previous viewport width.
        timeline.set(activitiesRail, { x: responsiveActivityRailX(0) }, 0)
        timeline.to(progressFill, { scaleX: 1, duration: RESPONSIVE_TOTAL_VH }, 0)
        addBackgroundTransition(timeline, 'bluenode', entryHold, entryEnd - entryHold)
        addBackgroundTransition(timeline, 'about', bluenodeLock, bluenodeEnd - bluenodeLock)
        addBackgroundTransition(timeline, 'activities', aboutExit, activitiesTitleLock - aboutExit)
        addBackgroundTransition(timeline, 'awards', activitiesHold, activitiesEnd - activitiesHold)
        addBackgroundTransition(timeline, 'research', awardsEnd - 30, 30)
        addBackgroundTransition(timeline, 'network', researchEnd - 30, 30)
        addBackgroundTransition(timeline, 'join', networkEnd - 28, 28)

        const addResponsiveActivityStop = (
          fromIndex: number,
          toIndex: number,
          start: number,
          end: number,
        ) => {
          const duration = end - start
          timeline.to(activitiesRail, { x: responsiveActivityRailX(toIndex), duration }, start)
          timeline.to(activityCards[fromIndex], {
            autoAlpha: 0.42,
            scale: 0.76,
            '--activity-active-border': 0,
            duration,
          }, start)
          timeline.to(activityCards[toIndex], {
            autoAlpha: 1,
            scale: 1,
            '--activity-active-border': 1,
            duration,
          }, start)
          timeline.to(activityTitles[fromIndex], {
            autoAlpha: 0,
            y: -10,
            duration: duration * 0.45,
          }, start)
          timeline.to(activityTitles[toIndex], {
            autoAlpha: 1,
            y: 0,
            duration: duration * 0.55,
          }, start + duration * 0.45)
        }

        // 01 Entry → 02 BlueNode — immediate micro-response, then a two-stage lift.
        timeline.to(entryScrollCue, { y: -2, duration: entryHold }, 0)
        timeline.to(entryType, { y: -3, duration: entryHold }, 0)
        timeline.to(entryScrollCue, {
          autoAlpha: 0,
          y: -6,
          duration: entryLift - entryHold,
        }, entryHold)
        timeline.to(entryType, {
          autoAlpha: 0,
          y: -18,
          duration: entryEnd - entryHold,
        }, entryHold)
        timeline.to(entry, { yPercent: -30, duration: entryLift - entryHold }, entryHold)
        timeline.to(bluenode, { yPercent: 26, duration: entryLift - entryHold }, entryHold)
        timeline.to(entry, { yPercent: -100, duration: entryEnd - entryLift }, entryLift)
        timeline.to(bluenode, { yPercent: 0, duration: entryEnd - entryLift }, entryLift)
        timeline.to(header, {
          autoAlpha: 0,
          y: -8,
          duration: entryEnd - entryLift,
        }, entryLift)

        // 02 BlueNode → 03 About — logo settle, pause, then the same two-stage vertical push.
        timeline.to(bluenodeLogo, {
          scale: 1,
          duration: bluenodeLock - entryEnd,
          ease: 'power2.out',
        }, entryEnd)
        timeline.to(bluenode, {
          yPercent: -32,
          duration: bluenodeLift - bluenodeLock,
        }, bluenodeLock)
        timeline.to(about, {
          yPercent: 36,
          duration: bluenodeLift - bluenodeLock,
        }, bluenodeLock)
        timeline.to(bluenodeLogo, {
          scale: 1.025,
          duration: bluenodeLift - bluenodeLock,
        }, bluenodeLock)
        timeline.to(bluenode, {
          yPercent: -100,
          duration: bluenodeEnd - bluenodeLift,
        }, bluenodeLift)
        timeline.to(about, {
          yPercent: 0,
          duration: bluenodeEnd - bluenodeLift,
        }, bluenodeLift)
        timeline.to(header, {
          autoAlpha: 1,
          y: 0,
          duration: bluenodeEnd - bluenodeLift,
        }, bluenodeLift)

        // 03 About → 04 Activities — type, PENGU and metadata settle before the handoff.
        timeline.to(aboutType, {
          autoAlpha: 1,
          x: 0,
          duration: aboutTypeLock - bluenodeEnd,
          ease: 'power2.out',
        }, bluenodeEnd)
        timeline.to(aboutPengu, {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: aboutPenguLock - (bluenodeEnd + 12),
          ease: 'power3.out',
        }, bluenodeEnd + 12)
        timeline.to(aboutMeta, {
          autoAlpha: 1,
          y: 0,
          duration: aboutPenguLock - (bluenodeEnd + 28),
          ease: 'power2.out',
        }, bluenodeEnd + 28)
        timeline.to(aboutCta, {
          autoAlpha: 1,
          duration: aboutPenguLock - (bluenodeEnd + 28),
          ease: 'power2.out',
        }, bluenodeEnd + 28)
        timeline.to(aboutType, {
          autoAlpha: 0,
          duration: Math.max(8, (aboutEnd - aboutExit) * 0.38),
        }, aboutExit - 8)
        timeline.to([aboutPengu, aboutMeta, aboutCta], {
          autoAlpha: 0,
          duration: (aboutEnd - aboutExit) * 0.62,
        }, aboutExit)
        timeline.to(about, {
          yPercent: -36,
          duration: aboutEnd - aboutExit,
        }, aboutExit)
        timeline.to(activities, {
          yPercent: 42,
          duration: aboutEnd - aboutExit,
        }, aboutExit)
        timeline.to(about, {
          yPercent: -100,
          duration: activitiesTitleLock - aboutEnd,
        }, aboutEnd)
        timeline.to(activities, {
          yPercent: 0,
          duration: activitiesTitleLock - aboutEnd,
        }, aboutEnd)
        timeline.to(activitiesWord, {
          autoAlpha: 1,
          duration: activitiesTitleLock - aboutExit,
          ease: 'power2.out',
        }, aboutExit)
        timeline.to(activitiesRail, {
          autoAlpha: 1,
          duration: activitiesTitleLock - aboutExit,
          ease: 'power2.out',
        }, aboutExit)
        timeline.to(activitiesCta, {
          autoAlpha: 1,
          duration: activitiesTitleLock - aboutExit,
          ease: 'power2.out',
        }, aboutExit)
        addResponsiveActivityStop(0, 1, activitiesReelOneHold, activitiesReelTwo)
        addResponsiveActivityStop(1, 2, activitiesReelTwoHold, activitiesReelThree)
        addResponsiveActivityStop(2, 3, activitiesReelThreeHold, activitiesReelFour)
        // 04 Activities → 05 Awards — the fourth image holds, then becomes evidence rules.
        timeline.to([activitiesWord, activitiesRail, ...activityTitles, activitiesCta], {
          autoAlpha: 0,
          duration: (activitiesLift - activitiesHold) * 0.78,
        }, activitiesHold)
        timeline.to(activities, {
          yPercent: -36,
          duration: activitiesLift - activitiesHold,
        }, activitiesHold)
        timeline.to(awards, {
          yPercent: 42,
          duration: activitiesLift - activitiesHold,
        }, activitiesHold)
        timeline.to(activities, {
          yPercent: -100,
          duration: activitiesEnd - activitiesLift,
        }, activitiesLift)
        timeline.to(awards, {
          yPercent: 0,
          duration: activitiesEnd - activitiesLift,
        }, activitiesLift)
        timeline.to(header, {
          autoAlpha: 0,
          y: -8,
          duration: activitiesLift - activitiesHold,
        }, activitiesHold)
        timeline.to(awardsTitle, {
          autoAlpha: 1,
          y: 0,
          duration: awardsStatement - activitiesHold,
          ease: 'power2.out',
        }, activitiesHold)
        timeline.to(awardRows.slice(0, 4), {
          autoAlpha: 1,
          y: 0,
          duration: awardsEvidence - awardsStatement - 9,
          stagger: 3,
          ease: 'power2.out',
        }, awardsStatement)
        timeline.to(awardRows.slice(4), {
          autoAlpha: 1,
          y: 0,
          duration: awardsCountLock - awardsEvidence - 6,
          stagger: 3,
          ease: 'power2.out',
        }, awardsEvidence)
        timeline.to(awardsCount, {
          autoAlpha: 1,
          y: 0,
          duration: Math.min(18, awardsEnd - 30 - awardsCountLock),
          ease: 'power2.out',
        }, awardsCountLock)

        // 05 Awards → 06 Research — a soft editorial crossfade; compact screens scroll the list inside the scene.
        timeline.to([awardsTitle, ...awardRows, awardsCount], {
          autoAlpha: 0,
          y: -14,
          duration: 18,
        }, awardsEnd - 30)
        timeline.to(awards, { yPercent: -100, duration: 30 }, awardsEnd - 30)
        timeline.to(research, { yPercent: 0, duration: 30 }, awardsEnd - 30)
        timeline.to(header, { autoAlpha: 1, y: 0, duration: 30 }, awardsEnd - 30)
        timeline.to(researchTitle, {
          autoAlpha: 1,
          y: 0,
          duration: researchArticleOne - (awardsEnd - 30),
          ease: 'power2.out',
        }, awardsEnd - 30)
        if (compact) {
          timeline.to(researchRows[0], {
            autoAlpha: 1,
            y: 0,
            duration: researchArticleOne - awardsEnd,
            ease: 'power2.out',
          }, awardsEnd)
          timeline.to(researchRows[0], { autoAlpha: 0, y: -14, duration: 8 }, researchArticleOne)
          timeline.to(researchRows[1], {
            autoAlpha: 1,
            y: -compactResearchRowOffset,
            duration: researchArticleTwo - researchArticleOne,
            ease: 'power2.out',
          }, researchArticleOne)
          timeline.to(researchRows[1], {
            autoAlpha: 0,
            y: -compactResearchRowOffset - 14,
            duration: 8,
          }, researchArticleTwo)
          timeline.to(researchRows[2], {
            autoAlpha: 1,
            y: -compactResearchRowOffset * 2,
            duration: researchArticleThree - researchArticleTwo,
            ease: 'power2.out',
          }, researchArticleTwo)
        } else {
          timeline.to(researchRows[0], {
            autoAlpha: 1,
            y: 0,
            duration: researchArticleOne - awardsEnd,
            ease: 'power2.out',
          }, awardsEnd)
          timeline.to(researchRows[1], {
            autoAlpha: 1,
            y: 0,
            duration: researchArticleTwo - researchArticleOne,
            ease: 'power2.out',
          }, researchArticleOne)
          timeline.to(researchRows[2], {
            autoAlpha: 1,
            y: 0,
            duration: researchArticleThree - researchArticleTwo,
            ease: 'power2.out',
          }, researchArticleTwo)
        }
        timeline.to(researchAll, {
          autoAlpha: 1,
          y: 0,
          duration: researchArticleThree - researchArticleTwo,
          ease: 'power2.out',
        }, researchArticleTwo)
        // 06 Research → 07 Network — globe first, Korea next, distant touchpoints last.
        timeline.to([researchTitle, ...researchRows, researchAll], {
          autoAlpha: 0,
          y: -14,
          duration: 18,
        }, researchEnd - 30)
        timeline.to(research, { yPercent: -100, duration: 30 }, researchEnd - 30)
        timeline.to(network, { yPercent: 0, duration: 30 }, researchEnd - 30)
        timeline.to([networkTitle, networkOrigin], {
          autoAlpha: 1,
          y: 0,
          duration: networkDomestic - (researchEnd - 30),
          ease: 'power2.out',
        }, researchEnd - 30)
        timeline.to(networkStage, {
          autoAlpha: 1,
          scale: 1,
          yPercent: 0,
          duration: networkDomestic - (researchEnd - 30),
          ease: 'power2.out',
        }, researchEnd - 30)
        timeline.to(networkHub, {
          autoAlpha: 1,
          duration: networkDomestic - (researchEnd - 30),
          ease: 'power2.out',
        }, researchEnd - 30)
        timeline.to(networkDomesticRoutes, {
          autoAlpha: 1,
          duration: networkSettle - networkDomestic,
          ease: 'power2.out',
        }, networkDomestic)
        timeline.to(domesticLabels, {
          autoAlpha: 1,
          y: 0,
          duration: networkSettle - networkDomestic - 8,
          stagger: 4,
          ease: 'power2.out',
        }, networkDomestic + 8)
        timeline.to(networkFarRoutes, {
          autoAlpha: 1,
          duration: networkContext - networkSettle,
          ease: 'power2.out',
        }, networkSettle)
        timeline.to(farLabels, {
          autoAlpha: 0.72,
          y: 0,
          duration: networkContext - networkSettle - 12,
          stagger: 6,
          ease: 'power2.out',
        }, networkSettle + 6)
        timeline.to(networkCta, {
          autoAlpha: 1,
          duration: networkContext - networkSettle,
          ease: 'power2.out',
        }, networkSettle)
        // 07 Network → 08 Join — relationship marks quiet down before the invitation takes over.
        timeline.to([
          networkTitle,
          networkOrigin,
          networkStage,
          networkHub,
          networkDomesticRoutes,
          networkFarRoutes,
          networkCta,
          ...domesticLabels,
          ...farLabels,
        ], { autoAlpha: 0, duration: 18 }, networkEnd - 28)
        timeline.to(network, { yPercent: -100, duration: 28 }, networkEnd - 28)
        timeline.to(join, { yPercent: 0, duration: 28 }, networkEnd - 28)
        timeline.to(joinTitle, {
          autoAlpha: 1,
          y: 0,
          duration: joinStatement - (networkEnd - 28),
          ease: 'power2.out',
        }, networkEnd - 28)
        timeline.to(joinFields, {
          autoAlpha: 1,
          y: 0,
          duration: 18.5,
          stagger: 7,
          ease: 'power2.out',
        }, joinStatement)
        timeline.to([joinInterests, joinSubmit], {
          autoAlpha: 1,
          y: 0,
          duration: joinInterest - joinForm,
          ease: 'power2.out',
        }, joinForm)
        timeline.to(joinFooter, {
          autoAlpha: 1,
          duration: joinEnd - joinInterest,
          ease: 'power2.out',
        }, joinInterest)

        lastSceneName = undefined
        lastActivityIndex = -1
        setActiveScene(0, responsiveSceneRanges)
        setActiveActivity(0)

        const jumpToEntry = () => jumpToVh(0, timeline, RESPONSIVE_TOTAL_VH, responsiveSceneRanges)
        const jumpToJoin = () => jumpToVh(joinStart + 1, timeline, RESPONSIVE_TOTAL_VH, responsiveSceneRanges)
        navigateFromPanel = (sceneName) => {
          const range = responsiveSceneRanges.find((candidate) => candidate.name === sceneName)
          if (range) jumpToVh(range.start + 1, timeline, RESPONSIVE_TOTAL_VH, responsiveSceneRanges)
        }
        brandButton?.addEventListener('click', jumpToEntry)
        mobileJoinButton?.addEventListener('click', jumpToJoin)

        const refresh = () => ScrollTrigger.refresh()
        document.fonts?.ready.then(refresh)
        addEventListener('load', refresh, { once: true })

        return () => {
          brandButton?.removeEventListener('click', jumpToEntry)
          mobileJoinButton?.removeEventListener('click', jumpToJoin)
          removeEventListener('load', refresh)
          timeline.scrollTrigger?.kill()
          timeline.kill()
          globe.destroy()
          root.classList.remove('is-responsive-motion')
          navigateFromPanel = (sceneName) => {
            sceneByName.get(sceneName)?.scrollIntoView({ behavior: 'smooth' })
          }
          lastSceneName = undefined
          lastActivityIndex = -1
        }
      }

      const globe = initialiseGlobe()

      if (reduce) {
        root.classList.add('is-reduced')
        navigateFromPanel = (sceneName) => {
          sceneByName.get(sceneName)?.scrollIntoView({ behavior: 'smooth' })
        }
        scenes.forEach((scene) => {
          scene.removeAttribute('aria-hidden')
          scene.inert = false
        })
        const reducedJumpHandlers = new Map<HTMLButtonElement, () => void>()
        navigationButtons.forEach((button) => {
          const handler = () => jumpToVh(Number(button.dataset.jumpVh ?? 0))
          reducedJumpHandlers.set(button, handler)
          button.addEventListener('click', handler)
        })
        globe.render(1160)
        return () => {
          root.classList.remove('is-reduced')
          reducedJumpHandlers.forEach((handler, button) => {
            button.removeEventListener('click', handler)
          })
          navigateFromPanel = (sceneName) => {
            sceneByName.get(sceneName)?.scrollIntoView({ behavior: 'smooth' })
          }
          globe.destroy()
        }
      }

      root.classList.remove('is-reduced')

      const interpolateActivityValue = (medium: number, large: number, wide = large) => {
        if (innerWidth <= 1440) {
          const progress = Math.max(0, Math.min(1, (innerWidth - 1024) / (1440 - 1024)))
          return medium + (large - medium) * progress
        }

        const wideProgress = Math.max(0, Math.min(1, (innerWidth - 1440) / (1920 - 1440)))
        return large + (wide - large) * wideProgress
      }
      const activitySideScaleX = () => interpolateActivityValue(330 / 460, 430 / 570, 500 / 660)
      const activitySideScaleY = () => interpolateActivityValue(254 / 412, 331 / 511, 385 / 592)
      const activitySideOffsetY = () => interpolateActivityValue(15, 8, 2)

      gsap.set(scenes, { autoAlpha: 1, yPercent: 100 })
      gsap.set(entry, { autoAlpha: 1, yPercent: 0 })
      gsap.set([awards, research, network, join], { autoAlpha: 0, yPercent: 0 })
      resetBackgroundOrbs()
      gsap.set(progressFill, { scaleX: 0 })
      gsap.set(bluenodeLogo, { autoAlpha: 1, scale: 0.96, xPercent: -50, yPercent: -50 })
      gsap.set(aboutType, { autoAlpha: 0.35, x: -32 })
      gsap.set(aboutPengu, { autoAlpha: 0, x: 80, scale: 0.92 })
      gsap.set(aboutMeta, { autoAlpha: 0, y: 24 })
      gsap.set(aboutCta, { autoAlpha: 0 })
      gsap.set(activitiesWord, { autoAlpha: 0, y: 30 })
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
      gsap.set(activitiesCta, { autoAlpha: 0 })
      gsap.set([awardsTitle, researchTitle, researchAll, networkTitle, networkOrigin, joinTitle], {
        autoAlpha: 0,
        y: 26,
      })
      gsap.set([networkStage, networkHub, networkDomesticRoutes, networkFarRoutes], { autoAlpha: 0 })
      gsap.set(networkStage, { scale: 0.82, yPercent: 24 })
      gsap.set(domesticLabels, { autoAlpha: 0, y: 10 })
      gsap.set(farLabels, { autoAlpha: 0, y: 10 })
      gsap.set(networkCta, { autoAlpha: 0 })
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
          if (time >= 1120 && time <= 1400) globe.render(time)
        },
        scrollTrigger: {
          id: 'bluenode-desktop-prototype',
          trigger: root,
          start: 'top top',
          end: () => `+=${Math.round(innerHeight * 12.4)}`,
          pin: viewport,
          pinSpacing: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Re-evaluate the opening rail position when a desktop viewport grows
      // or shrinks without crossing the 1024px media-query boundary.
      timeline.set(activitiesRail, { x: railX(0) }, 0)
      timeline.to(progressFill, { scaleX: 1, duration: TOTAL_VH }, 0)
      timeline.to(Object.values(activeBackgroundOrbs), { y: 8, duration: 58 }, 0)

      const entryMotionStart = 12
      const entryMotionMid = 58
      const entryMotionEnd = 108

      addBackgroundTransition(
        timeline,
        'bluenode',
        entryMotionStart,
        entryMotionEnd - entryMotionStart,
      )
      addBackgroundTransition(timeline, 'about', 192, 78)
      addBackgroundTransition(timeline, 'activities', 420, 75)
      addBackgroundTransition(timeline, 'awards', 720, 30)
      addBackgroundTransition(timeline, 'research', 900, 40)
      addBackgroundTransition(timeline, 'network', 1120, 40)
      addBackgroundTransition(timeline, 'join', 1340, 40)

      // 01 Entry / 0–150vh — answer the first input, then complete the handoff.
      timeline.to(entryScrollCue, { y: -2, duration: entryMotionStart }, 0)
      timeline.to(entryType, { y: -3, duration: entryMotionStart }, 0)
      timeline.to(entryScrollCue, {
        autoAlpha: 0,
        y: -8,
        duration: entryMotionMid - entryMotionStart,
      }, entryMotionStart)
      timeline.to(entry, {
        yPercent: -45,
        duration: entryMotionMid - entryMotionStart,
      }, entryMotionStart)
      timeline.to(bluenode, {
        yPercent: 36,
        duration: entryMotionMid - entryMotionStart,
      }, entryMotionStart)
      timeline.to(entryType, {
        autoAlpha: 0,
        y: -12,
        duration: entryMotionMid - entryMotionStart,
      }, entryMotionStart)
      timeline.to(entry, {
        yPercent: -100,
        duration: entryMotionEnd - entryMotionMid,
      }, entryMotionMid)
      timeline.to(bluenode, {
        yPercent: 0,
        duration: entryMotionEnd - entryMotionMid,
      }, entryMotionMid)
      timeline.to(entryType, {
        autoAlpha: 0,
        y: -22,
        duration: entryMotionEnd - entryMotionMid,
      }, entryMotionMid)
      timeline.to(header, {
        autoAlpha: 0,
        y: -8,
        duration: entryMotionEnd - entryMotionMid,
      }, entryMotionMid)

      // 02 BlueNode / 150–270vh — logo pause before the next full-viewport push.
      timeline.to(bluenodeLogo, { scale: 1, duration: 42, ease: 'power2.out' }, 150)
      timeline.to(bluenode, { yPercent: -45, duration: 44 }, 192)
      timeline.to(about, { yPercent: 55, duration: 44 }, 192)
      timeline.to(bluenodeLogo, { scale: 1.03, duration: 44 }, 192)
      timeline.to(bluenode, { yPercent: -100, duration: 34 }, 236)
      timeline.to(about, { yPercent: 0, duration: 34 }, 236)
      timeline.to(header, { autoAlpha: 1, y: 0, duration: 34 }, 236)

      // 03 About / 270–450vh — type, Pengu and metadata settle before the handoff.
      timeline.to(aboutType, { autoAlpha: 1, x: 0, duration: 34, ease: 'power2.out' }, 270)
      timeline.to(aboutPengu, { autoAlpha: 1, x: 0, scale: 1, duration: 54, ease: 'power3.out' }, 294)
      timeline.to(aboutMeta, { autoAlpha: 1, y: 0, duration: 34, ease: 'power2.out' }, 310)
      timeline.to(aboutCta, { autoAlpha: 1, duration: 34, ease: 'power2.out' }, 310)
      timeline.to(about, { yPercent: -45, duration: 30 }, 420)
      timeline.to(activities, { yPercent: 55, duration: 30 }, 420)

      // 04 Activities / 450–750vh — vertical scroll drives a four-stop horizontal reel.
      timeline.to(about, { yPercent: -100, duration: 45 }, 450)
      timeline.to(activities, { yPercent: 0, duration: 45 }, 450)
      timeline.to(activitiesWord, { autoAlpha: 1, y: 0, duration: 75, ease: 'power2.out' }, 420)
      timeline.to(activitiesCta, { autoAlpha: 1, duration: 45, ease: 'power2.out' }, 450)
      timeline.to(activitiesRail, { x: railX(1), duration: 40 }, 530)
      timeline.to(activityCards[0], {
        autoAlpha: 1,
        scaleX: activitySideScaleX,
        scaleY: activitySideScaleY,
        y: activitySideOffsetY,
        '--activity-active-border': 0,
        duration: 40,
      }, 530)
      timeline.to(activityImages[0], { scaleY: 1.16465, duration: 40 }, 530)
      timeline.to(activityCards[1], {
        autoAlpha: 1,
        scaleX: 1,
        scaleY: 1,
        y: 0,
        '--activity-active-border': 1,
        duration: 40,
      }, 530)
      timeline.to(activityImages[1], { scaleY: 1, duration: 40 }, 530)
      timeline.to(activityTitles[0], { autoAlpha: 0, y: -12, duration: 18 }, 530)
      timeline.to(activityTitles[1], { autoAlpha: 1, y: 0, duration: 22 }, 548)
      timeline.to(activitiesRail, { x: railX(2), duration: 40 }, 600)
      timeline.to(activityCards[1], {
        autoAlpha: 1,
        scaleX: activitySideScaleX,
        scaleY: activitySideScaleY,
        y: activitySideOffsetY,
        '--activity-active-border': 0,
        duration: 40,
      }, 600)
      timeline.to(activityImages[1], { scaleY: 1.16465, duration: 40 }, 600)
      timeline.to(activityCards[2], {
        autoAlpha: 1,
        scaleX: 1,
        scaleY: 1,
        y: 0,
        '--activity-active-border': 1,
        duration: 40,
      }, 600)
      timeline.to(activityImages[2], { scaleY: 1, duration: 40 }, 600)
      timeline.to(activityTitles[1], { autoAlpha: 0, y: -12, duration: 18 }, 600)
      timeline.to(activityTitles[2], { autoAlpha: 1, y: 0, duration: 22 }, 618)

      timeline.to(activitiesRail, { x: railX(3), duration: 40 }, 665)
      timeline.to(activityCards[2], {
        autoAlpha: 1,
        scaleX: activitySideScaleX,
        scaleY: activitySideScaleY,
        y: activitySideOffsetY,
        '--activity-active-border': 0,
        duration: 40,
      }, 665)
      timeline.to(activityImages[2], { scaleY: 1.16465, duration: 40 }, 665)
      timeline.to(activityCards[3], {
        autoAlpha: 1,
        scaleX: 1,
        scaleY: 1,
        y: 0,
        '--activity-active-border': 1,
        duration: 40,
      }, 665)
      timeline.to(activityImages[3], { scaleY: 1, duration: 40 }, 665)
      timeline.to(activityTitles[2], { autoAlpha: 0, y: -12, duration: 18 }, 665)
      timeline.to(activityTitles[3], { autoAlpha: 1, y: 0, duration: 22 }, 683)
      timeline.to(activitiesCta, { autoAlpha: 0, duration: 24 }, 720)
      timeline.to(activities, { autoAlpha: 0, scale: 0.985, duration: 30 }, 720)
      timeline.to(awards, { autoAlpha: 1, duration: 30 }, 720)
      timeline.to(header, { autoAlpha: 0, y: -8, duration: 30 }, 720)

      // 05 Awards / 750–940vh — evidence rows build in two measured groups.
      timeline.to(awardsTitle, { autoAlpha: 1, y: 0, duration: 58, ease: 'power2.out' }, 720)
      timeline.to(awardRows.slice(0, 4), {
        autoAlpha: 1,
        y: 0,
        duration: 24,
        stagger: 4,
        ease: 'power2.out',
      }, 770)
      timeline.to(awardRows.slice(4), {
        autoAlpha: 1,
        y: 0,
        duration: 26,
        stagger: 4,
        ease: 'power2.out',
      }, 805)
      timeline.to(awardsCount, {
        autoAlpha: 1,
        y: 0,
        duration: 18,
        ease: 'power2.out',
      }, 838)
      timeline.to([awardsTitle, ...awardRows, awardsCount], {
        autoAlpha: 0,
        y: -22,
        duration: 40,
      }, 900)
      timeline.to(awards, { autoAlpha: 0, duration: 40 }, 900)
      timeline.to(research, { autoAlpha: 1, duration: 40 }, 900)
      timeline.to(header, { autoAlpha: 1, y: 0, duration: 40 }, 900)

      // 06 Research / 940–1160vh — editorial rows build, then hold as one readable page.
      timeline.to(researchTitle, {
        autoAlpha: 1,
        y: 0,
        duration: 70,
        ease: 'power2.out',
      }, 900)
      timeline.to(researchRows[0], {
        autoAlpha: 1,
        y: 0,
        duration: 30,
        ease: 'power2.out',
      }, 940)
      timeline.to(researchRows[1], {
        autoAlpha: 1,
        y: 0,
        duration: 34,
        ease: 'power2.out',
      }, 968)
      timeline.to(researchRows[2], {
        autoAlpha: 1,
        y: 0,
        duration: 36,
        ease: 'power2.out',
      }, 1004)
      timeline.to(researchAll, {
        autoAlpha: 1,
        y: 0,
        duration: 36,
        ease: 'power2.out',
      }, 1004)
      timeline.to(research, { autoAlpha: 0, yPercent: -7, duration: 40 }, 1120)
      timeline.to(network, { autoAlpha: 1, duration: 40 }, 1120)
      timeline.to(networkStage, { autoAlpha: 1, scale: 1, yPercent: 0, duration: 40, ease: 'power2.out' }, 1120)
      timeline.to([networkTitle, networkOrigin], { autoAlpha: 1, y: 0, duration: 40, ease: 'power2.out' }, 1120)

      // 07 Network / 1160–1380vh — Korea first, distant nodes second.
      timeline.to(networkHub, { autoAlpha: 1, y: 0, duration: 30, ease: 'power2.out' }, 1160)
      timeline.to(networkDomesticRoutes, {
        autoAlpha: 1,
        duration: 32,
        ease: 'power2.out',
      }, 1190)
      timeline.to(domesticLabels, {
        autoAlpha: 1,
        y: 0,
        duration: 24,
        stagger: 5,
        ease: 'power2.out',
      }, 1198)
      timeline.to(networkFarRoutes, {
        autoAlpha: 1,
        duration: 30,
        ease: 'power2.out',
      }, 1235)
      timeline.to(farLabels, {
        autoAlpha: 0.72,
        y: 0,
        duration: 22,
        stagger: 6,
        ease: 'power2.out',
      }, 1242)
      timeline.to(networkCta, { autoAlpha: 1, duration: 28, ease: 'power2.out' }, 1235)
      timeline.to([networkHub, networkDomesticRoutes, networkFarRoutes, networkCta, ...domesticLabels, ...farLabels], { autoAlpha: 0, y: -10, duration: 40 }, 1340)
      timeline.to(network, { autoAlpha: 0, scale: 0.985, duration: 40 }, 1340)
      timeline.to(join, { autoAlpha: 1, duration: 40 }, 1340)
      timeline.to(header, { autoAlpha: 1, y: 0, duration: 40 }, 1340)

      // 08 Join / 1380–1540vh — BlueNode Original Direction editorial form.
      timeline.to(joinTitle, { autoAlpha: 1, y: 0, duration: 70, ease: 'power2.out' }, 1340)
      timeline.to(joinFields, {
        autoAlpha: 1,
        y: 0,
        duration: 24,
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
      lastActivityIndex = -1
      setActiveActivity(0)

      const jumpHandlers = new Map<HTMLButtonElement, () => void>()
      navigateFromPanel = (sceneName) => {
        const range = sceneRanges.find((candidate) => candidate.name === sceneName)
        if (range) jumpToVh(range.start + 1, timeline)
      }
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
        navigateFromPanel = (sceneName) => {
          sceneByName.get(sceneName)?.scrollIntoView({ behavior: 'smooth' })
        }
        lastActivityIndex = -1
      }
    },
  )

  let lastLayoutWidth = innerWidth
  let layoutRefreshFrame = 0

  const refreshLayout = () => {
    cancelAnimationFrame(layoutRefreshFrame)
    layoutRefreshFrame = requestAnimationFrame(() => {
      ScrollTrigger.refresh(true)
      ScrollTrigger.update()
    })
  }

  const handleLayoutResize = () => {
    const nextWidth = innerWidth
    if (Math.abs(nextWidth - lastLayoutWidth) < 2) return
    lastLayoutWidth = nextWidth
    refreshLayout()
  }

  const handlePageShow = (event: PageTransitionEvent) => {
    // Safari may restore the document from bfcache with a class that previously
    // locked the navigator. Only retain the lock when the panel is truly open.
    if (!navigatorPanel?.classList.contains('is-open')) {
      document.documentElement.classList.remove('has-prototype-navigator')
      viewport.inert = false
    }
    if (usesTouchNormalizer) enableTouchNormalizer()
    if (event.persisted) refreshLayout()
  }

  const handlePageHide = (event: PageTransitionEvent) => {
    // Keep the timeline alive while the document is stored in the back-forward
    // cache. It is refreshed on pageshow instead of returning as a dead scene.
    if (event.persisted) return

    cancelAnimationFrame(layoutRefreshFrame)
    removeEventListener('resize', handleLayoutResize)
    removeEventListener('orientationchange', refreshLayout)
    removeEventListener('pageshow', handlePageShow)
    removeEventListener('pagehide', handlePageHide)
    if (usesTouchNormalizer) ScrollTrigger.normalizeScroll(false)
    media.revert()
    document.documentElement.classList.remove('has-prototype-navigator')
  }

  addEventListener('resize', handleLayoutResize)
  addEventListener('orientationchange', refreshLayout)
  addEventListener('pageshow', handlePageShow)
  addEventListener('pagehide', handlePageHide)
}

initialisePrototype()
