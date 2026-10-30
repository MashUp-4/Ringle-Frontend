import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Icon } from '../ui/Icon'
import { chatbot } from '../ui/iconAssets'

export function FloatingActions({
  onNotice,
}: {
  onNotice: (message: string) => void
}) {
  const [reservationOpen, setReservationOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        className="trial"
        aria-haspopup="dialog"
        onClick={() => setReservationOpen(true)}
      >
        <Icon name="trial" />
        체험 수업 예약
      </button>
      <button
        type="button"
        className="floating-chat"
        aria-label="문의하기"
        onClick={() => onNotice('문의: help@ringleplus.com')}
      >
        <img src={chatbot} alt="" width={81.4001} height={81.4003} />
      </button>
      {reservationOpen && (
        <Modal
          labelledBy="trial-reservation-title"
          onClose={() => setReservationOpen(false)}
        >
          <h2 id="trial-reservation-title">체험 수업 예약 안내</h2>
          <p>
            체험 수업 예약 기능은 준비 중이에요. 추후 튜터와 날짜·시간을
            선택하는 예약 화면으로 연결될 예정입니다.
          </p>
          <button
            type="button"
            className="primary"
            onClick={() => setReservationOpen(false)}
          >
            확인
          </button>
        </Modal>
      )}
    </>
  )
}
