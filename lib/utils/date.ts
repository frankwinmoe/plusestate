// Simple date locale for Myanmar
export const myLocale = {
  formatDistance: (token: string, count: number) => {
    const translations: Record<string, string> = {
      lessThanXSeconds: `${count} စက္ကန့်`,
      xSeconds: `${count} စက္ကန့်`,
      halfAMinute: "မိနစ်ဝက်",
      lessThanXMinutes: `${count} မိနစ်`,
      xMinutes: `${count} မိနစ်`,
      aboutXHours: `${count} နာရီ`,
      xHours: `${count} နာရီ`,
      xDays: `${count} ရက်`,
      aboutXWeeks: `${count} ပတ်`,
      xWeeks: `${count} ပတ်`,
      aboutXMonths: `${count} လ`,
      xMonths: `${count} လ`,
      aboutXYears: `${count} နှစ်`,
      xYears: `${count} နှစ်`,
      overXYears: `${count} နှစ်ကျော်`,
      almostXYears: `${count} နှစ်နီးပါး`,
    };
    return translations[token] || token;
  },
} as any;

