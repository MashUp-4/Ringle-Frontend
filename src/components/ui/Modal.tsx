import { useEffect, useRef, type ReactNode } from 'react'
interface ModalProps {
  children: ReactNode
  onClose: () => void
  labelledBy: string
}
export function Modal({ children, onClose, labelledBy }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    const previous = document.activeElement
    dialog?.showModal()
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = oldOverflow
      if (previous instanceof HTMLElement && previous.isConnected)
        previous.focus()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={labelledBy}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
          ),
        ).filter((node) => node.getClientRects().length > 0)
        if (!controls.length) {
          event.preventDefault()
          return
        }
        const index = controls.indexOf(document.activeElement as HTMLElement)
        const next = event.shiftKey
          ? index <= 0
            ? controls.length - 1
            : index - 1
          : (index + 1) % controls.length
        event.preventDefault()
        controls[next].focus()
      }}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return
        const rect = e.currentTarget.getBoundingClientRect()
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        )
          onClose()
      }}
    >
      <button className="close" autoFocus aria-label="닫기" onClick={onClose}>
        ×
      </button>
      {children}
    </dialog>
  )
}
