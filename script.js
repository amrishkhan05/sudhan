const header = document.querySelector(".site-header");
const nav = document.querySelector("#site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const themeToggle = document.querySelector(".theme-toggle");
const progressBar = document.querySelector(".scroll-progress span");
const backToTop = document.querySelector(".back-to-top");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const savedTheme = localStorage.getItem("portfolio-theme");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function applyTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  themeToggle.setAttribute("aria-pressed", String(nextTheme === "light"));
  themeToggle.setAttribute(
    "aria-label",
    nextTheme === "light" ? "Switch to dark mode" : "Switch to light mode"
  );
  localStorage.setItem("portfolio-theme", nextTheme);
}

function syncHeader() {
  header.dataset.elevated = String(window.scrollY > 18);
}

function syncScrollControls() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
  progressBar.style.setProperty("--scroll-progress", `${progress}%`);
  backToTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.8);
}

function setActiveNav() {
  const current = sections.reduce((active, section) => {
    const top = section.getBoundingClientRect().top;
    return top < 140 ? section.id : active;
  }, sections[0]?.id);

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
  });
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMenu();
  }
});

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  applyTheme(current === "light" ? "dark" : "light");
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: reduceMotion.matches ? "auto" : "smooth",
  });
});

window.addEventListener("scroll", () => {
  syncHeader();
  setActiveNav();
  syncScrollControls();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    closeMenu();
  }
  syncScrollControls();
});

applyTheme(savedTheme);
syncHeader();
setActiveNav();
syncScrollControls();
