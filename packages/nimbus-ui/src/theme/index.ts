export const themeAttribute = 'data-nimbus-theme';

export type NimbusTheme = 'light' | 'dark';

export function setNimbusTheme(theme: NimbusTheme, target?: HTMLElement) {
  const themeTarget = target || (typeof document === 'undefined' ? undefined : document.documentElement);
  if (!themeTarget) return;

  if (theme === 'light') {
    themeTarget.removeAttribute(themeAttribute);
    return;
  }

  themeTarget.setAttribute(themeAttribute, theme);
}
