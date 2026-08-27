const root = document.documentElement;
const openButton = document.querySelector(".open-button");
const musicButton = document.querySelector(".music-button");
const letter = document.querySelector("#letter");
const revealItems = document.querySelectorAll(".reveal");
let audioContext;
let masterGain;
let musicTimer;
let isMusicPlaying = false;

const chordProgression = [
  [220, 277.18, 329.63],
  [196, 246.94, 329.63],
  [174.61, 220, 293.66],
  [196, 261.63, 329.63],
];

function playTone(frequency, startTime, duration, level) {
  const oscillator = audioContext.createOscillator();
  const toneGain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);
  oscillator.detune.setValueAtTime(Math.random() * 4 - 2, startTime);

  toneGain.gain.setValueAtTime(0, startTime);
  toneGain.gain.linearRampToValueAtTime(level, startTime + 0.8);
  toneGain.gain.linearRampToValueAtTime(level * 0.72, startTime + duration - 1.3);
  toneGain.gain.linearRampToValueAtTime(0, startTime + duration);

  oscillator.connect(toneGain).connect(masterGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.1);
}

function queueMusicPhrase() {
  if (!audioContext || !isMusicPlaying) return;

  const now = audioContext.currentTime + 0.05;
  chordProgression.forEach((chord, index) => {
    const start = now + index * 4.8;
    chord.forEach((frequency, noteIndex) => {
      playTone(frequency, start + noteIndex * 0.22, 4.9, 0.035);
    });
    playTone(chord[0] / 2, start, 5.2, 0.025);
  });

  musicTimer = window.setTimeout(queueMusicPhrase, 18600);
}

async function startMusic() {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) return;

  if (!audioContext) {
    audioContext = new Context();
    masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    masterGain.connect(audioContext.destination);
  }

  await audioContext.resume();
  isMusicPlaying = true;
  musicButton.setAttribute("aria-pressed", "true");
  musicButton.textContent = "musik menyala";
  masterGain.gain.cancelScheduledValues(audioContext.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(0.55, audioContext.currentTime + 1.6);
  queueMusicPhrase();
}

function stopMusic() {
  if (!audioContext || !masterGain) return;

  isMusicPlaying = false;
  musicButton.setAttribute("aria-pressed", "false");
  musicButton.textContent = "musik pelan";
  window.clearTimeout(musicTimer);
  masterGain.gain.cancelScheduledValues(audioContext.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.9);
}

function revealLetter() {
  root.classList.add("letter-open");
  openButton.setAttribute("aria-expanded", "true");
  openButton.disabled = true;
  openButton.textContent = "surat terbuka";

  window.setTimeout(() => {
    letter.focus({ preventScroll: true });
    letter.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 180);
}

if (openButton && letter) {
  openButton.addEventListener("click", revealLetter);
}

if (musicButton) {
  musicButton.addEventListener("click", () => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.16,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
