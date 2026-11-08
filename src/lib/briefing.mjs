import { formatPace } from './progress.mjs';
const km = value => value.toFixed(2);
// Smallest whole 0.01 km increment that strictly beats the unrounded record.
export function kilometresToBeat(record, current) {
  if (record == null) return null;
  if (current - record > 1e-8) return 0;
  return (Math.floor(Math.max(0, record - current) * 100 + 1e-8) + 1) / 100;
}
export function buildWeeklyBriefing(summary) {
  const { current, previous, bestWeek, fastestWeek, week, comparison } = summary;
  const targetExtra = previous.hasData ? kilometresToBeat(previous.distance, current.distance) : null;
  const recordExtra = bestWeek ? kilometresToBeat(bestWeek.distance, current.distance) : null;
  let target;
  if (!previous.hasData) target = `There are no recorded runs for week ${week} last year, so there is no year-on-year target for this week.`;
  else if (targetExtra === 0) target = `You’ve already beaten last year’s week ${week}: ${km(current.distance)} km so far versus ${km(previous.distance)} km in ${comparison}. You’re ${km(current.distance - previous.distance)} km ahead of that full-week total.`;
  else target = `Your main target is to improve on last year’s week ${week}: ${km(previous.distance)} km at ${formatPace(previous.pace)}/km in ${comparison}. You’ve logged ${km(current.distance)} km so far; another ${km(targetExtra)} km will take you beyond last year’s distance.`;
  let challenge;
  if (!bestWeek) challenge = `There are no earlier measured runs for this week number. Your runs this week will establish your first recorded benchmark.`;
  else if (recordExtra === 0) challenge = `This is already your highest-distance recorded week ${week} across all years. You’ve passed the previous best of ${km(bestWeek.distance)} km, set in ${bestWeek.year}, by ${km(current.distance - bestWeek.distance)} km. Every extra run builds on your new record.`;
  else {
    const lead = bestWeek.year === comparison ? 'Last year is also your strongest recorded version of this week.' : `Looking further back, in ${bestWeek.year} you ran ${km(bestWeek.distance)} km in week ${week}, averaging ${formatPace(bestWeek.pace)}/km.`;
    challenge = `${lead} To make this your highest-distance week ${week} of any recorded year, you need another ${km(recordExtra)} km. That would bring this week to at least ${km(current.distance + recordExtra)} km and set a new distance best for this period.`;
  }
  let pace = '';
  if (current.pace != null && previous.pace != null) {
    const seconds = Math.round(Math.abs(current.pace - previous.pace));
    pace = seconds === 0 ? `Your current average pace of ${formatPace(current.pace)}/km matches last year’s to the nearest second.` : `Your current average pace is ${formatPace(current.pace)}/km — ${formatPace(seconds)}/km ${current.pace < previous.pace ? 'faster' : 'slower'} than last year’s equivalent week. Distance and pace are separate goals.`;
  }
  if (fastestWeek && bestWeek && fastestWeek.year !== bestWeek.year) pace += `${pace ? ' ' : ''} Your fastest recorded equivalent week was ${fastestWeek.year}: ${formatPace(fastestWeek.pace)}/km over ${km(fastestWeek.distance)} km.`;
  return { target, challenge, pace, targetExtra, recordExtra };
}
