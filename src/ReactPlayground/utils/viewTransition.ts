export const onToggleTheme = (e: React.MouseEvent, callback: VoidFunction) => {
  if (!("startViewTransition" in document)) {
    callback();
  }
  const transiton = document.startViewTransition(callback);
  const x = e.clientX;
  const y = e.clientY;
  const targetRadius = Math.hypot(
    Math.max(window.innerWidth, window.innerWidth - x),
    Math.max(window.innerHeight, window.innerHeight - y)
  );
  transiton.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0% at ${x}px ${y}px)`,
          `circle(${targetRadius}px at ${x}px ${y}px)`
        ]
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)"
      }
    );
  });
};
