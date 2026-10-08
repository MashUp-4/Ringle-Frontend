import * as figmaAssets from './iconAssets'

const icons: Record<
  string,
  { src: string; width: number; height: number; mask?: boolean }
> = {
  home: {
    src: figmaAssets.home,
    width: 32,
    height: 32,
    mask: true,
  },
  lesson: {
    src: figmaAssets.lesson,
    width: 32,
    height: 32,
    mask: true,
  },
  calendar: {
    src: figmaAssets.event,
    width: 32,
    height: 32,
    mask: true,
  },
  user: {
    src: figmaAssets.myRingle,
    width: 32,
    height: 32,
    mask: true,
  },
  chat: {
    src: figmaAssets.aiSpeaking,
    width: 32,
    height: 32,
  },
  chart: {
    src: figmaAssets.achievement,
    width: 32,
    height: 32,
    mask: true,
  },
  help: {
    src: figmaAssets.faq,
    width: 32,
    height: 32,
  },
  guide: {
    src: figmaAssets.ringleGuide,
    width: 32,
    height: 32,
  },
  search: {
    src: figmaAssets.search,
    width: 32,
    height: 32,
  },
  question: {
    src: figmaAssets.questionMark,
    width: 20,
    height: 20,
  },
  trial: {
    src: figmaAssets.trialBooking,
    width: 28,
    height: 28,
  },
  twinkle: {
    src: figmaAssets.twinkle,
    width: 48,
    height: 48,
  },
  'home-coupon': {
    src: figmaAssets.homeCoupon,
    width: 32,
    height: 24,
  },
  'home-curriculum': {
    src: figmaAssets.homeCurriculum,
    width: 32,
    height: 32,
  },
  'home-ringle-guide': {
    src: figmaAssets.homeRingleGuide,
    width: 32,
    height: 32,
  },
  'home-ot-application': {
    src: figmaAssets.homeOtApplication,
    width: 32,
    height: 32,
  },
  'shortcut-purchase': {
    src: figmaAssets.shortcutPurchase,
    width: 48,
    height: 48,
  },
  'shortcut-tutor': {
    src: figmaAssets.shortcutTutor,
    width: 48,
    height: 48,
  },
  'shortcut-material': {
    src: figmaAssets.shortcutMaterial,
    width: 48,
    height: 48,
  },
  'shortcut-lesson-review': {
    src: figmaAssets.shortcutLessonReview,
    width: 48,
    height: 48,
  },
  'shortcut-ai-analysis': {
    src: figmaAssets.shortcutAiAnalysis,
    width: 48,
    height: 48,
  },
}

export function Icon({ name }: { name: string }) {
  if (name === 'arrow') {
    return (
      <span className="icon-slot icon-arrow" aria-hidden="true">
        <span className="icon-chevron" />
      </span>
    )
  }

  const icon = icons[name]
  if (!icon) return null

  return (
    <span className={`icon-slot icon-${name}`} aria-hidden="true">
      {icon.mask ? (
        <span
          className="icon-art icon-mask"
          style={{
            width: icon.width,
            height: icon.height,
            maskImage: `url("${icon.src}")`,
            WebkitMaskImage: `url("${icon.src}")`,
          }}
        />
      ) : (
        <img
          className="icon-art"
          src={icon.src}
          alt=""
          width={icon.width}
          height={icon.height}
        />
      )}
    </span>
  )
}
