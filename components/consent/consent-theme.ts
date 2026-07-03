// Waldküche theme for the c15t consent banner + dialog — maps our green/brown
// palette onto c15t's design tokens. Passed to ConsentManagerProvider's
// `options.theme`. Light + dark variants mirror app/globals.css.
export const consentTheme = {
  colors: {
    primary: "#34503a", // forest
    primaryHover: "#2a4230",
    surface: "#fffdf7", // card
    surfaceHover: "#efe7d8", // oat
    border: "#e4dac8",
    borderHover: "#d8ccb5",
    text: "#2a2118", // ink
    textMuted: "#6e6151",
    textOnPrimary: "#faf6ee", // cream
    switchTrackActive: "#34503a",
  },
  dark: {
    primary: "#7fb07a",
    primaryHover: "#8fbd8a",
    surface: "#1e2618",
    surfaceHover: "#26301f",
    border: "#33422a",
    borderHover: "#3d4f31",
    text: "#f5efe3",
    textMuted: "#b8b2a4",
    textOnPrimary: "#12160e",
    switchTrackActive: "#7fb07a",
  },
  typography: {
    // Inherit the app's body font (Inter) loaded via next/font on <html>.
    fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif",
  },
  radius: { md: "0.625rem", lg: "0.75rem" },
  consentActions: {
    accept: { variant: "primary", mode: "filled" } as const,
    reject: { variant: "neutral", mode: "stroke" } as const,
    customize: { variant: "neutral", mode: "ghost" } as const,
  },
};
