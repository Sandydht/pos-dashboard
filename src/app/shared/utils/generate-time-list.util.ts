export const generateTimeList = (interval: number = 30): string[] => {
  const times: string[] = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      times.push(`${h}:${m}`);
    }
  }

  return times;
};
