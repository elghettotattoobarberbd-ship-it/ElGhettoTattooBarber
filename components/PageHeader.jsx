// components/PageHeader.jsx — Banner for inner pages (galeria, artistas, reservar, contacto)
function PageHeader({ num, eyebrow, title, accent, stroke, subtitle, breadcrumb }) {
  return (
    <section className="page-header">
      <div className="container">
        <nav className="breadcrumb">
          <a href="index.html">Home</a>
          <span className="bc-sep">/</span>
          <span className="bc-current">{breadcrumb || title}</span>
        </nav>

        <div className="page-header-row">
          <div>
            <div className="eyebrow">{num} · {eyebrow}</div>
            <h1 className="page-title">
              {title && <span>{title} </span>}
              {accent && <span className="yellow">{accent}</span>}
              {stroke && <span className="stroke"> {stroke}</span>}
            </h1>
            {subtitle && <p className="page-sub">{subtitle}</p>}
          </div>

          <div className="page-header-mark">
            <span className="page-mark-num">{num}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

window.PageHeader = PageHeader;
