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
// Draws a trajectory spiralling out from an unstable fixed point at the
// origin onto a stable limit cycle -- the Hopf bifurcation at the heart
// of the Stuart-Landau model this research is built on.
(function () {
  const cx = 320, cy = 320;
  const limitRadius = 160;
  const turns = 4.2;
  const steps = 260;
  const k = 3.2; // convergence rate

  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const theta = t * turns * 2 * Math.PI;
    const r = limitRadius * (1 - Math.exp(-k * t));
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    d += (i === 0 ? "M" : "L") + x.toFixed(2) + "," + y.toFixed(2) + " ";
  }

  const path = document.getElementById("spiral-path");
  const dot = document.getElementById("trace-dot");
  if (!path || !dot) return;

  path.setAttribute("d", d.trim());

  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    path.style.strokeDashoffset = 0;
    dot.setAttribute("cx", cx + limitRadius);
    dot.setAttribute("cy", cy);
    return;
  }

  // Draw the spiral in once on load.
  const drawDuration = 2200;
  const drawStart = performance.now();

  function drawSpiral(now) {
    const elapsed = now - drawStart;
    const t = Math.min(1, elapsed / drawDuration);
    const eased = 1 - Math.pow(1 - t, 3);
    path.style.strokeDashoffset = length * (1 - eased);
    if (t < 1) {
      requestAnimationFrame(drawSpiral);
    } else {
      requestAnimationFrame(orbit);
    }
  }

  // After the spiral resolves, let the dot loop forever around the
  // limit cycle -- the sustained oscillation past the bifurcation.
  const orbitStart = { time: null };
  const orbitPeriod = 7000;

  function orbit(now) {
    if (orbitStart.time === null) orbitStart.time = now;
    const elapsed = now - orbitStart.time;
    const theta = (elapsed / orbitPeriod) * 2 * Math.PI + turns * 2 * Math.PI;
    const wobble = 1 + 0.015 * Math.sin(elapsed / 900);
    const x = cx + limitRadius * wobble * Math.cos(theta);
    const y = cy + limitRadius * wobble * Math.sin(theta);
    dot.setAttribute("cx", x.toFixed(2));
    dot.setAttribute("cy", y.toFixed(2));
    requestAnimationFrame(orbit);
  }

  requestAnimationFrame(drawSpiral);
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
