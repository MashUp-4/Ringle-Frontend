import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import { chatbot } from '../ui/iconAssets'

export function FloatingActions({
  onNotice,
}: {
  onNotice: (message: string) => void
}) {
  return (
    <>
      <Link className="trial" to="/tutors">
        <Icon name="trial" />
        체험 수업 예약
      </Link>
      <button
        type="button"
        className="floating-chat"
        aria-label="문의하기"
        onClick={() => onNotice('문의: help@ringleplus.com')}
      >
        <img src={chatbot} alt="" width={81.4001} height={81.4003} />
      </button>
    </>
  )
}
