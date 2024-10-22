const DATE_UNITS: { [key: string]: number } = {
  // en segundos
  year: 31536000,
  month: 2629800,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
};

const languageCode = "es"; // Español
const rtf = new Intl.RelativeTimeFormat(languageCode, { numeric: "auto" });

export const getRelativeTime = (timestamp: number): string => {
  const from = new Date(timestamp).getTime();
  const now = new Date().getTime();

  const elapsed = (from - now) / 1000;

  for (const unit in DATE_UNITS) {
    if (Math.abs(elapsed) > DATE_UNITS[unit]) {
      return rtf.format(
        Math.floor(elapsed / DATE_UNITS[unit]),
        unit as Intl.RelativeTimeFormatUnit
      );
    }
  }
  return rtf.format(0, "second");
};
