/**
 * BONUS (script used to extract the URL in Step 1):
 *
 * (() => {
 *   const it = document.createNodeIterator(document, NodeFilter.SHOW_ELEMENT);
 *   const nodes = [];
 *   for (let n = it.nextNode(); n; n = it.nextNode()) nodes.push(n);
 *   const chars = [];
 *   for (let i = 0; i < nodes.length; i++) {
 *     const s = nodes[i];
 *     if (s.tagName === 'SECTION' && /^92/.test(s.getAttribute('data-id') || '')) {
 *       let aIdx = -1, dIdx = -1, bIdx = -1;
 *       for (let j = i + 1; j < nodes.length; j++) {
 *         const a = nodes[j];
 *         if (a.tagName === 'ARTICLE' && /45$/.test(a.getAttribute('data-class') || '')) { aIdx = j; break; }
 *       }
 *       if (aIdx === -1) continue;
 *       for (let k = aIdx + 1; k < nodes.length; k++) {
 *         const d = nodes[k];
 *         if (d.tagName === 'DIV' && /78/.test(d.getAttribute('data-tag') || '')) { dIdx = k; break; }
 *       }
 *       if (dIdx === -1) continue;
 *       for (let m = dIdx + 1; m < nodes.length; m++) {
 *         const b = nodes[m];
 *         if (b.tagName === 'B' && b.classList.contains('ref') && b.hasAttribute('value')) {
 *           chars.push(b.getAttribute('value'));
 *           i = m;
 *           break;
 *         }
 *       }
 *     }
 *   }
 *   const url = chars.join('');
 *   console.log('FLAG URL:', url);
 *   if (url) window.open(url, '_blank');
 *   return url;
 * })();
 */

import { useEffect, useRef, useState } from "react";

const FLAG_URL =
  "https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/616d69"; // e.g. "https://.../flag"

export default function App() {
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState("");
  const [typed, setTyped] = useState("");
  const hasAnimatedRef = useRef(false);

  // Step 4: Load the flag using browser fetch without using external libs
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(FLAG_URL, { cache: "no-store" });
        const txt = await res.text();
        if (!cancelled) {
          setFlag(txt.trim());
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setFlag("[fetch failed]");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Step 5: Typewriter (0.5s per char), runs once after load
  useEffect(() => {
    if (loading || !flag || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(flag.slice(0, i));
      if (i >= flag.length) clearInterval(id);
    }, 500);

    return () => clearInterval(id);
  }, [loading, flag]);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {typed.split("").map((ch, idx) => (
        <li key={idx}>{ch}</li>
      ))}
    </ul>
  );
}
