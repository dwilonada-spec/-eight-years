const root = document.documentElement;
const openButton = document.querySelector(".open-button");
const letter = document.querySelector("#letter");
const revealItems = document.querySelectorAll(".reveal");

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
