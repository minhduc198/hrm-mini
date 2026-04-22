export function formatDuration(minutes: number) {
  if (minutes >= 60) {
    return { value: (minutes / 60).toFixed(1), unit: "h", label: "Giờ" };
  }
  return { value: minutes, unit: "m", label: "Phút" };
}
