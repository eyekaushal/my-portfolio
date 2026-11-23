/** Text whose letters roll up to an identical copy on hover (parent needs .wave-target). */
export function WaveText({ children }: { children: string }) {
  return (
    <span className="wave-text">
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="wave-words">
        {children.split(/(\s+)/).map((word, w) =>
          /^\s+$/.test(word) ? (
            <span key={w}>{word}</span>
          ) : (
            <span key={w} className="wave-window">
              {Array.from(word).map((ch, i) => (
                <span key={i} className="wave-glyph" data-char={ch} style={{ transitionDelay: `${i * 18}ms` }}>
                  {ch}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
