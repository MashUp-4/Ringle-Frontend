import './LoadingState.css'

export function LoadingState({
  label,
  compact = false,
}: {
  label: string
  compact?: boolean
}) {
  return (
    <div
      className={`api-loading ${compact ? 'api-loading-compact' : ''}`}
      role="status"
    >
      <div className="api-loading-placeholder" aria-hidden="true">
        {!compact && <span className="api-loading-photo" />}
        <div className="api-loading-lines">
          <span />
          <span />
          <span />
        </div>
      </div>
      <p>{label}</p>
    </div>
  )
}
