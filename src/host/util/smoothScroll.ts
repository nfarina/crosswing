import anime from "animejs";

export function smoothScroll(container: HTMLElement, offset: number) {
  // Setting overflow to hidden will instantly kill any momentum that
  // might continue to adjust scroll position even after we set it to 0.
  container.style.overflow = "hidden";

  anime({
    targets: container,
    scrollTop: offset,
    easing: "easeOutExpo",
    duration: 750,
  });

  setTimeout(() => (container.style.overflow = ""), 0);
}
