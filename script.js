// ---------- Publications data (from CV) ----------
const publications = [
  {
    year: "2026",
    title: "How stimulation waveform shape affects collective oscillations in the brain networks",
    authors: "Sharma, V., Tiesinga, P. H. E., & Cabral, J.",
    venue: "bioRxiv",
    doi: "10.64898/2026.06.16.732561"
  },
  {
    year: "2026",
    title: "Electrophysiological Signature of Stroke Recovery: Investigating EEG biomarkers for prognostic insights",
    authors: "Khalili-Ardali, M., Sharma, V., Mandahar, T. S., Santos, F. P. D., Tiesinga, P., & Ramsey, N.",
    venue: "bioRxiv",
    doi: "10.64898/2026.06.01.728505"
  },
  {
    year: "2025",
    title: "Dynamical models reveal distance to criticality in ageing brain dynamics",
    authors: "Sharma, V., Drost, B. J. N. M., & Tiesinga, P. H. E.",
    venue: "bioRxiv",
    doi: "10.1101/2025.09.26.678711"
  },
  {
    year: "2025",
    title: "From computational models to clinical practice: Whole brain modelling in stroke research",
    authors: "Drost, B. J. N. M., Sharma, V., & Tiesinga, P.",
    venue: "Open Research Europe, 5, 280",
    doi: "10.12688/openreseurope.21294.1"
  },
  {
    year: "2024",
    title: "BrainX3 3.0: Advancing Neuroinformatics and Artificial Brains for Living Machines",
    authors: "Yang, M., Drost, B. J. N. M., Aviñó, D., Felici, B., Santos, F. P., Vilarrubias, R. B., Sharma, V., & Verschure, P. F. M. J.",
    venue: "Biomimetic and Biohybrid Systems",
    doi: "10.1007/978-3-031-72597-5_1"
  },
  {
    year: "2023",
    title: "Redefining stroke rehabilitation: Mobilizing the embodied goal-oriented brain",
    authors: "Verschure, P. F. M. J., Santos, F. P., & Sharma, V.",
    venue: "Current Opinion in Neurobiology, 83, 102807",
    doi: "10.1016/j.conb.2023.102807"
  },
  {
    year: "2023",
    title: "Patient-specific modeling for guided rehabilitation of stroke patients: the BrainX3 use-case",
    authors: "Sharma, V., Santos, F. P., & Verschure, P. F. M. J.",
    venue: "Frontiers in Neurology, 14",
    doi: "10.3389/fneur.2023.1279875"
  },
  {
    year: "2023",
    title: "BrainX3: A Neuroinformatic Tool for Interactive Exploration of Multimodal Brain Datasets",
    authors: "Sharma, V., Vilarrubias, R. B., & Verschure, P. F. M. J.",
    venue: "Biomimetic and Biohybrid Systems",
    doi: "10.1007/978-3-031-39504-8_11"
  },
  {
    year: "2022",
    title: "Biophysical mechanism underlying compensatory preservation of neural synchrony over the adult lifespan",
    authors: "Pathak, A., Sharma, V., Roy, D., & Banerjee, A.",
    venue: "Communications Biology, 5(1)",
    doi: "10.1038/s42003-022-03489-4"
  }
];

const pubList = document.getElementById("pub-list");
if (pubList) {
  publications.forEach(pub => {
    const li = document.createElement("li");
    li.className = "pub-item";
    li.innerHTML = `
      <span class="pub-year">${pub.year}</span>
      <div>
        <p class="pub-title">${pub.title}</p>
        <p class="pub-authors">${pub.authors}</p>
        <p class="pub-venue">${pub.venue}</p>
        <a class="pub-doi" href="https://doi.org/${pub.doi}" target="_blank" rel="noopener">doi:${pub.doi}</a>
      </div>
    `;
    pubList.appendChild(li);
  });
}

// ---------- Phase-portrait hero animation ----------
// The dot follows the amplitude-death trajectory: it spirals inward
// along the teal path, collapses to the fixed point, pauses, then restarts.
(function () {
  const cx = 320, cy = 320;
  const startRadius = 230;
  const steps = 420;
  const turnsDeath = 5.2;
  const kDeath = 2.8;

  const deathPath = document.getElementById("spiral-path");
  const dot = document.getElementById("trace-dot");

  if (!deathPath || !dot) return;

  function buildDeathPath() {
    let d = "";

    for (let i = 0; i <= steps; i++) {
      const s = i / steps;
      const theta = s * turnsDeath * 2 * Math.PI;
      const r = startRadius * Math.exp(-kDeath * s);

      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);

      d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)} `;
    }

    return d.trim();
  }

  deathPath.setAttribute("d", buildDeathPath());

  const pathLength = deathPath.getTotalLength();
  deathPath.style.strokeDasharray = pathLength;
  deathPath.style.strokeDashoffset = pathLength;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    deathPath.style.strokeDashoffset = 0;
    dot.setAttribute("cx", cx);
    dot.setAttribute("cy", cy);
    return;
  }

  const duration = 5200;
  const pause = 900;
  const total = duration + pause;
  const fade = 220; // ms -- softens the jump when the cycle restarts
  let cycleStart = null;
  let lastNow = null;

  function frame(now) {
    // A browser can throttle or fully pause requestAnimationFrame while the
    // tab is hidden/backgrounded. Without this guard, resuming would jump to
    // an arbitrary point in the cycle -- sometimes landing mid-fade, making
    // the line and dot look like they vanished. Restart cleanly instead.
    if (cycleStart === null || (lastNow !== null && now - lastNow > 500)) {
      cycleStart = now;
    }
    lastNow = now;

    const elapsed = (now - cycleStart) % total;

    if (elapsed < duration) {
      const t = elapsed / duration;

      // Smooth but still visibly dynamical
      const eased = 1 - Math.pow(1 - t, 2.2);

      const point = deathPath.getPointAtLength(eased * pathLength);

      dot.setAttribute("cx", point.x.toFixed(2));
      dot.setAttribute("cy", point.y.toFixed(2));

      // Draw the path as the dot moves
      deathPath.style.strokeDashoffset = pathLength * (1 - eased);

      // Fade the dot in at the start of each cycle, masking the reset jump
      dot.style.opacity = elapsed < fade ? elapsed / fade : 1;
    } else {
      dot.setAttribute("cx", cx);
      dot.setAttribute("cy", cy);
      deathPath.style.strokeDashoffset = 0;

      const paused = elapsed - duration;
      const fadeStart = pause - fade;

      // Fade the dot back out near the end of the pause, before it teleports
      dot.style.opacity = paused > fadeStart ? 0.65 * (1 - (paused - fadeStart) / fade) : 0.65;
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();

// ---------- Nav background on scroll ----------
const nav = document.getElementById("nav");
if (nav) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      nav.style.background = "rgba(16,19,31,0.92)";
    } else {
      nav.style.background = "linear-gradient(to bottom, rgba(16,19,31,0.85), rgba(16,19,31,0))";
    }
  });
}

// ---------- Scroll reveal ----------
// Sections stay fully visible unless this observer confirms it can reveal
// them again, so a JS failure never leaves content permanently hidden.
if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("js-reveal");

  const revealTargets = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
  );

  revealTargets.forEach(target => observer.observe(target));
}
