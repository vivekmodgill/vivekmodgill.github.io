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
// The dot traces a full Hopf cycle: it spirals out from the fixed point
// onto a stable limit cycle (growth), sustains that oscillation for a
// while, then spirals back down to the fixed point as coupling drives
// the amplitude to zero (amplitude death), rests there, and repeats.
(function () {
  const cx = 320, cy = 320;
  const limitRadius = 160;
  const steps = 200;

  const turnsGrowth = 3.5;
  const turnsSustain = 2;
  const turnsDeath = 2.5;
  const kGrowth = 3.2;   // how quickly the limit cycle is approached
  const kDeath = 3.0;    // how quickly the amplitude collapses

  function buildPath(thetaStart, thetaEnd, radiusAt) {
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const s = i / steps;
      const theta = thetaStart + s * (thetaEnd - thetaStart);
      const r = radiusAt(s);
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      d += (i === 0 ? "M" : "L") + x.toFixed(2) + "," + y.toFixed(2) + " ";
    }
    return d.trim();
  }

  const thetaGrowthEnd = turnsGrowth * 2 * Math.PI;
  const thetaSustainEnd = thetaGrowthEnd + turnsSustain * 2 * Math.PI;
  const thetaDeathEnd = thetaSustainEnd + turnsDeath * 2 * Math.PI;

  const growthPath = document.getElementById("spiral-path");
  const deathPath = document.getElementById("spiral-path-death");
  const dot = document.getElementById("trace-dot");
  if (!growthPath || !deathPath || !dot) return;

  growthPath.setAttribute("d", buildPath(0, thetaGrowthEnd, s => limitRadius * (1 - Math.exp(-kGrowth * s))));
  deathPath.setAttribute("d", buildPath(thetaSustainEnd, thetaDeathEnd, s => limitRadius * Math.exp(-kDeath * s)));

  const growthLength = growthPath.getTotalLength();
  const deathLength = deathPath.getTotalLength();
  growthPath.style.strokeDasharray = growthLength;
  deathPath.style.strokeDasharray = deathLength;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    growthPath.style.strokeDashoffset = 0;
    deathPath.style.strokeDashoffset = deathLength;
    dot.setAttribute("cx", cx + limitRadius);
    dot.setAttribute("cy", cy);
    return;
  }

  const durations = { growth: 2400, sustain: 4200, death: 2600, rest: 1100 };
  const total = durations.growth + durations.sustain + durations.death + durations.rest;

  let cycleStart = null;

  function frame(now) {
    if (cycleStart === null) cycleStart = now;
    const elapsed = (now - cycleStart) % total;

    if (elapsed < durations.growth) {
      const t = elapsed / durations.growth;
      const eased = 1 - Math.pow(1 - t, 3);
      const theta = eased * thetaGrowthEnd;
      const r = limitRadius * (1 - Math.exp(-kGrowth * eased));
      dot.setAttribute("cx", (cx + r * Math.cos(theta)).toFixed(2));
      dot.setAttribute("cy", (cy + r * Math.sin(theta)).toFixed(2));
      growthPath.style.strokeDashoffset = growthLength * (1 - eased);
      deathPath.style.strokeDashoffset = deathLength;

    } else if (elapsed < durations.growth + durations.sustain) {
      const s = (elapsed - durations.growth) / durations.sustain;
      const theta = thetaGrowthEnd + s * turnsSustain * 2 * Math.PI;
      const wobble = 1 + 0.015 * Math.sin(elapsed / 900);
      dot.setAttribute("cx", (cx + limitRadius * wobble * Math.cos(theta)).toFixed(2));
      dot.setAttribute("cy", (cy + limitRadius * wobble * Math.sin(theta)).toFixed(2));
      growthPath.style.strokeDashoffset = 0;
      deathPath.style.strokeDashoffset = deathLength;

    } else if (elapsed < durations.growth + durations.sustain + durations.death) {
      const u = (elapsed - durations.growth - durations.sustain) / durations.death;
      const theta = thetaSustainEnd + u * turnsDeath * 2 * Math.PI;
      const r = limitRadius * Math.exp(-kDeath * u);
      dot.setAttribute("cx", (cx + r * Math.cos(theta)).toFixed(2));
      dot.setAttribute("cy", (cy + r * Math.sin(theta)).toFixed(2));
      growthPath.style.strokeDashoffset = 0;
      deathPath.style.strokeDashoffset = deathLength * (1 - u);

    } else {
      // Amplitude death has run its course -- the fixed point is at rest.
      dot.setAttribute("cx", cx);
      dot.setAttribute("cy", cy);
      growthPath.style.strokeDashoffset = 0;
      deathPath.style.strokeDashoffset = 0;
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
