export const buildCalendarUrl = (name: string, deadline: string): string => {
  const date = new Date(deadline)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const start = fmt(date)
  const end = fmt(new Date(date.getTime() + 3600000))
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `[SheSignal] Apply by: ${name}`
  )}&dates=${start}/${end}&details=${encodeURIComponent('Deadline reminder from SheSignal')}`
}

export const buildReminderUrl = (name: string, deadline: string): string => {
  const date = new Date(new Date(deadline).getTime() - 86400000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const start = fmt(date)
  const end = fmt(new Date(date.getTime() + 3600000))
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `[SheSignal] TOMORROW: ${name} deadline!`
  )}&dates=${start}/${end}&details=${encodeURIComponent('Tomorrow is the deadline! Don\'t miss it.')}`
}
