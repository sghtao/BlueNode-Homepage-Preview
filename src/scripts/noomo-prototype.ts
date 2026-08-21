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
  const researchRows = qa<HTMLElement>(research, '[data-research-row]')
  const networkTitle = q<HTMLElement>(network, '[data-network-title]')
  const networkOrigin = q<HTMLElement>(network, '[data-network-origin]')
  const networkStage = q<HTMLElement>(network, '[data-network-globe-stage]')
  const networkHub = q<HTMLElement>(network, '[data-network-hub]')
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

  const setAboutCtaInteractive = (time: number) => {
    const interactive = time >= 394 && time < 414
    if (interactive === lastAboutCtaInteractive || !aboutCta) return
    lastAboutCtaInteractive = interactive
    const button = aboutCta as HTMLButtonElement
    button.tabIndex = interactive ? 0 : -1
    if (interactive) button.removeAttribute('aria-disabled')
    else button.setAttribute('aria-disabled', 'true')
  }

  const setActiveScene = (time: number) => {
    const range = sceneRanges.find((candidate, index) => {
      const isLast = index === sceneRanges.length - 1
      return time >= candidate.start && (time < candidate.end || isLast)
    }) ?? sceneRanges[0]

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
    if (time >= 690) index = 3
    else if (time >= 600) index = 2
    else if (time >= 525) index = 1
    if (index === lastActivityIndex) return
    lastActivityIndex = index
    activityTitles.forEach((title, titleIndex) => {
      title.setAttribute('aria-hidden', String(titleIndex !== index))
    })
  }

  const jumpToVh = (targetVh: number, timeline?: gsap.core.Timeline) => {
    const trigger = timeline?.scrollTrigger
    if (!trigger) {
      const targetName = sceneRanges.find((range) => range.start === targetVh)?.name
      sceneByName.get(targetName ?? 'entry')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    const targetScroll = trigger.start + (targetVh / TOTAL_VH) * (trigger.end - trigger.start)
    window.scrollTo({ top: targetScroll, behavior: 'smooth' })
  }

  const bindFormControls = () => {
    qa<HTMLButtonElement>(root, '.join-interests button').forEach((button) => {
      button.setAttribute('aria-pressed', 'false')
      button.addEventListener('click', () => {
        const pressed = button.getAttribute('aria-pressed') === 'true'
        button.setAttribute('aria-pressed', String(!pressed))
      })
    })

    q<HTMLFormElement>(root, '[data-join-form]')?.addEventListener('submit', (event) => {
      event.preventDefault()
    })
  }

  type GlobeController = {
    render: (timelineTime?: number) => void
    destroy: () => void
  }

  const initialiseGlobe = (): GlobeController => {
    const canvas = q<HTMLCanvasElement>(network, '[data-network-canvas]')
    const stage = q<HTMLElement>(network, '[data-network-globe-stage]')
    const fallback = q<HTMLElement>(network, '[data-network-fallback]')
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
    )

    const INCHEON: [number, number] = [37.4563, 126.7052]
    const TOKYO: [number, number] = [35.6895, 139.6917]
    const SINGAPORE: [number, number] = [1.3521, 103.8198]
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
        devicePixelRatio: Math.min(devicePixelRatio || 1, 2),
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
        devicePixelRatio: Math.min(devicePixelRatio || 1, 2),
        phi,
        theta,
        dark: 0,
        diffuse: 1.18,
        scale: 1.04,
        mapSamples: 16000,
        mapBrightness: 5.7,
        baseColor: [1, 1, 1],
        markerColor: [0.035, 0.04, 0.055],
        glowColor: [0.93, 0.96, 0.99],
        arcColor: [0.035, 0.04, 0.055],
        arcWidth: 0.68,
        arcHeight: 0.16,
        markerElevation: 0.02,
        markers: [
          { location: INCHEON, size: 0.072, id: 'incheon' },
          { location: TOKYO, size: 0.034, id: 'tokyo' },
          { location: SINGAPORE, size: 0.034, id: 'singapore' },
        ],
        arcs: [
          { from: INCHEON, to: TOKYO, id: 'incheon-tokyo' },
          { from: INCHEON, to: SINGAPORE, id: 'incheon-singapore' },
        ],
      })
      stage.classList.add('is-cobe-ready')
      fallback?.setAttribute('aria-hidden', 'true')
      resize()
    } catch {
      globe = undefined
      showFallback()
    }

    const render = (timelineTime = 1160) => {
      if (!globe || !canvas || document.hidden) return
      if (!dragging) {
        const localProgress = Math.max(0, Math.min(1, (timelineTime - 1160) / 220))
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
      reduce: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { desktop, reduce } = context.conditions as { desktop: boolean; reduce: boolean }
      if (!desktop) return

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
      gsap.set(activityCards, { autoAlpha: 0.72, scaleX: 0.7544, scaleY: 0.64775, y: 8 })
      gsap.set(activityImages, { scaleY: 1.16465 })
      gsap.set(activityCards[0], { autoAlpha: 1, scaleX: 1, scaleY: 1, y: 0 })
      gsap.set(activityImages[0], { scaleY: 1 })
      gsap.set(activityTitles, { autoAlpha: 0, y: 12 })
      gsap.set(activityTitles[0], { autoAlpha: 1, y: 0 })
      gsap.set([awardsTitle, researchTitle, networkTitle, networkOrigin, joinTitle], {
        autoAlpha: 0,
        y: 26,
      })
      gsap.set([networkStage, networkHub, networkCta], { autoAlpha: 0 })
      gsap.set(networkStage, { scale: 0.93, xPercent: -50, yPercent: -45 })
      gsap.set(networkCta, { xPercent: -50 })
      gsap.set(domesticLabels, { autoAlpha: 0, y: 10 })
      gsap.set(farLabels, { autoAlpha: 0, y: 10 })
      gsap.set([joinFields, joinInterests, joinSubmit, joinFooter], { autoAlpha: 0 })

      const railX = (index: number) => () => {
        const card = activityCards[0]
        if (!card || !activitiesRail) return 0
        const cardWidth = card.getBoundingClientRect().width
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
      timeline.to(activitiesRail, { x: railX(1), duration: 60 }, 495)
      timeline.to(activityCards[0], { autoAlpha: 0.72, scaleX: 0.7544, scaleY: 0.64775, y: 8, duration: 60 }, 495)
      timeline.to(activityImages[0], { scaleY: 1.16465, duration: 60 }, 495)
      timeline.to(activityCards[1], { autoAlpha: 1, scaleX: 1, scaleY: 1, y: 0, duration: 60 }, 495)
      timeline.to(activityImages[1], { scaleY: 1, duration: 60 }, 495)
      timeline.to(activityTitles[0], { autoAlpha: 0, y: -12, duration: 24 }, 495)
      timeline.to(activityTitles[1], { autoAlpha: 1, y: 0, duration: 32 }, 519)
      timeline.to(activitiesRail, { x: railX(2), duration: 90 }, 555)
      timeline.to(activityCards[1], { autoAlpha: 0.72, scaleX: 0.7544, scaleY: 0.64775, y: 8, duration: 90 }, 555)
      timeline.to(activityImages[1], { scaleY: 1.16465, duration: 90 }, 555)
      timeline.to(activityCards[2], { autoAlpha: 1, scaleX: 1, scaleY: 1, y: 0, duration: 90 }, 555)
      timeline.to(activityImages[2], { scaleY: 1, duration: 90 }, 555)
      timeline.to(activityTitles[1], { autoAlpha: 0, y: -12, duration: 28 }, 555)
      timeline.to(activityTitles[2], { autoAlpha: 1, y: 0, duration: 40 }, 583)
      timeline.to(activitiesCta, { autoAlpha: 1, y: 0, scale: 1, duration: 45, ease: 'power2.out' }, 600)
      timeline.to(activitiesRail, { x: railX(3), duration: 75 }, 645)
      timeline.to(activityCards[2], { autoAlpha: 0.72, scaleX: 0.7544, scaleY: 0.64775, y: 8, duration: 75 }, 645)
      timeline.to(activityImages[2], { scaleY: 1.16465, duration: 75 }, 645)
      timeline.to(activityCards[3], { autoAlpha: 1, scaleX: 1, scaleY: 1, y: 0, duration: 75 }, 645)
      timeline.to(activityImages[3], { scaleY: 1, duration: 75 }, 645)
      timeline.to(activityTitles[2], { autoAlpha: 0, y: -12, duration: 30 }, 645)
      timeline.to(activityTitles[3], { autoAlpha: 1, y: 0, duration: 40 }, 675)
      timeline.to(activities, { autoAlpha: 0, scale: 0.985, duration: 30 }, 720)
      timeline.to(awards, { autoAlpha: 1, duration: 30 }, 720)
      timeline.to(header, { autoAlpha: 0, y: -8, duration: 30 }, 720)

      // 05 Awards / 750–940vh — evidence rows build in two measured groups.
      timeline.to(awardsTitle, { autoAlpha: 1, y: 0, duration: 38, ease: 'power2.out' }, 750)
      timeline.to(awardRows.slice(0, 4), {
        autoAlpha: 1,
        y: 0,
        duration: 44,
        stagger: 7,
        ease: 'power2.out',
      }, 780)
      timeline.to(awardRows.slice(4), {
        autoAlpha: 1,
        y: 0,
        duration: 40,
        stagger: 8,
        ease: 'power2.out',
      }, 836)
      timeline.to(awardsCount, { autoAlpha: 1, y: 0, duration: 28, ease: 'power2.out' }, 855)
      timeline.to([awardsTitle, ...awardRows, awardsCount], {
        autoAlpha: 0,
        y: -22,
        duration: 40,
      }, 900)
      timeline.to(awards, { autoAlpha: 0, duration: 40 }, 900)
      timeline.to(research, { autoAlpha: 1, duration: 40 }, 900)
      timeline.to(header, { autoAlpha: 1, y: 0, duration: 40 }, 900)

      // 06 Research / 940–1160vh — three editorial rows resolve one by one.
      timeline.to(researchTitle, { autoAlpha: 1, y: 0, duration: 44, ease: 'power2.out' }, 940)
      timeline.to(researchRows[0], { autoAlpha: 1, y: 0, duration: 44, ease: 'power2.out' }, 940)
      timeline.to(researchRows[1], { autoAlpha: 1, y: 0, duration: 48, ease: 'power2.out' }, 991)
      timeline.to(researchRows[2], { autoAlpha: 1, y: 0, duration: 48, ease: 'power2.out' }, 1046)
      timeline.to(research, { autoAlpha: 0, yPercent: -7, duration: 40 }, 1120)
      timeline.to(network, { autoAlpha: 1, duration: 40 }, 1120)
      timeline.to(networkStage, { autoAlpha: 1, scale: 1, yPercent: -50, duration: 40, ease: 'power2.out' }, 1120)
      timeline.to([networkTitle, networkOrigin], { autoAlpha: 1, y: 0, duration: 40, ease: 'power2.out' }, 1120)

      // 07 Network / 1160–1380vh — Korea first, distant nodes second.
      timeline.to(networkHub, { autoAlpha: 1, y: 0, duration: 44, ease: 'power2.out' }, 1160)
      timeline.to(domesticLabels, {
        autoAlpha: 1,
        y: 0,
        duration: 45,
        stagger: 5,
        ease: 'power2.out',
      }, 1204)
      timeline.to(farLabels, {
        autoAlpha: 1,
        y: 0,
        duration: 55,
        stagger: 12,
        ease: 'power2.out',
      }, 1259)
      timeline.to(networkCta, { autoAlpha: 1, duration: 40, ease: 'power2.out' }, 1278)
      timeline.to([...domesticLabels, ...farLabels, networkCta], { autoAlpha: 0, y: -10, duration: 40 }, 1340)
      timeline.to(network, { autoAlpha: 0, scale: 0.985, duration: 40 }, 1340)
      timeline.to(join, { autoAlpha: 1, duration: 40 }, 1340)

      // 08 Join / 1380–1540vh — invitation, form fields, interests, final rest.
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
        stagger: 9,
        ease: 'power2.out',
      }, 1460)
      timeline.to(joinFooter, { autoAlpha: 1, duration: 40 }, 1500)

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
