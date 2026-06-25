import './ToolShell.scss';

export default function ToolShell({
  title,
  subtitle,
  actions,
  children,
  className = '',
}) {
  return (
    <section className={`tool-shell ${className}`.trim()}>
      <header className="tool-shell__header">
        <div>
          <h2 className="tool-shell__title">{title}</h2>
          {subtitle && <p className="tool-shell__subtitle">{subtitle}</p>}
        </div>

        {actions && <div className="tool-shell__actions">{actions}</div>}
      </header>

      <div className="tool-shell__body">{children}</div>
    </section>
  );
}