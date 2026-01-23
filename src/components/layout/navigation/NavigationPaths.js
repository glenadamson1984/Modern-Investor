export const NavigationItems = [
  "Home",
  "Performance",
  "Story",
  "Fund Management",
  "Coaching",
  "Articles",
  "Contact",
];

export const NavigationItemsMobile = [
  "Home",
  "Performance",
  "Story",
  "Fund Management",
  "Coaching",
  "Articles",
  "Contact",
];

export const ConvertPathNameToURL = (name) => {
  const mapping = {
    "Fund Management": "fund-management",
    "Home": "",
  };
  return mapping[name] || name.toLowerCase().replace(/\s/g, "-");
};

export const RemoveSlashFromURl = (name) => {
  return name.replace(/\//g, "").charAt(0).toUpperCase() + name.slice(2);
};
