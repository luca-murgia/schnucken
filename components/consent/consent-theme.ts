// Schnucken Rosé theme for the c15t consent banner + dialog — maps our
// rose/espresso palette onto c15t's design tokens. Passed to
// ConsentManagerProvider's `options.theme`. Mirrors app/globals.css.
export const consentTheme = {
  colors: {
    primary: "#3e2e26", // espresso
    primaryHover: "#503b31",
    surface: "#fffcfa", // card
    surfaceHover: "#f0ded8", // blush
    border: "#e7d5ce",
    borderHover: "#d8c2b9",
    text: "#3e2e26", // ink
    textMuted: "#6e574d",
    textOnPrimary: "#fbf4f0", // cream
    switchTrackActive: "#3e2e26",
  },
  dark: {
    primary: "#dbaea6", // rose
    primaryHover: "#e3bcb4",
    surface: "#2e221c",
    surfaceHover: "#3a2a22",
    border: "#46352c",
    borderHover: "#52402f",
    text: "#f3e6e0",
    textMuted: "#c3a99f",
    textOnPrimary: "#231a15",
    switchTrackActive: "#dbaea6",
  },
  typography: {
    fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif",
  },
  radius: { md: "0.625rem", lg: "0.75rem" },
  consentActions: {
    accept: { variant: "primary", mode: "filled" } as const,
    reject: { variant: "neutral", mode: "stroke" } as const,
    customize: { variant: "neutral", mode: "ghost" } as const,
  },
};
