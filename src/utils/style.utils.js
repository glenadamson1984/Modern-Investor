const maxWidthMedia = (maxWidth) => `@media (max-width: ${maxWidth}px)`;
const minWidthMedia = (minWidth) => `@media (min-width: ${minWidth}px)`;

export const media = {
  forMobile: maxWidthMedia(1199),
  forDesktop: minWidthMedia(1200),

  forPhoneOnly: maxWidthMedia(599),
  forTabletPortraitAndUp: maxWidthMedia(1199),
  forTabletLandscapeAndUp: minWidthMedia(900),
  forDesktopAndUp: minWidthMedia(1200),
  forDesktopWideScreen: minWidthMedia(1600),
  forBigDesktopAndUp: minWidthMedia(1920),
};

export const colours = {
  white: "#fff",
  offWhite: "#f5f5f5",
  whiteBorder: "#e8e8e8",
  red: "#E51F28",
  pink: "#ff408b",
  green: "#7bcda4",
  darkGreen: "#1a4d3a",
  black: "#232323",
  darkGrey: "#262626",
  lightGrey: "#f8f8f8",
  grey: "#6B6B6B",
  darkWhite: "#BFBFBF",
};
