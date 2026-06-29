export default function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        let theme = localStorage.getItem('theme');
        if (theme !== 'dark' && theme !== 'light') {
          theme = null;
        }
        if (!theme) {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        const root = document.documentElement;
        root.dataset.theme = theme;
        root.style.colorScheme = theme;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      } catch (e) {}
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
