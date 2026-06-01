// components/FAQ.jsx
function FAQ() {
  const [open, setOpen] = React.useState(0);
  const [items, setItems] = React.useState(null); // null = loading

  React.useEffect(() => {
    (async () => {
      if (!window.sb) { setItems(window.FAQS); return; }
      try {
        const { data } = await window.sb
          .from('faqs')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: false });
        // If DB has any rows, use them; otherwise fall back to local data
        setItems(data && data.length > 0
          ? data.map((d) => ({ q: d.question, a: d.answer }))
          : window.FAQS);
      } catch {
        setItems(window.FAQS);
      }
    })();
  }, []);

  const list = items || [];

  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="faq-list">
          {list.map((item, i) => (
            <div key={i} className={`faq-item ${open === i ? 'open' : ''}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <div className="faq-q">
                <span>{item.q}</span>
                <span className="faq-toggle">+</span>
              </div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.FAQ = FAQ;
