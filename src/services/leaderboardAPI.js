// Production talks to the API directly; in dev Vite proxies /api to it (see vite.config.js).
export const API_BASE =
  import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? '' : 'http://mini.romangarms.com:8321');

async function getJSON(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  return res.json();
}

export function listCourses() {
  return getJSON('/api/leaderboard/courses');
}

export function getCourseLeaderboard(courseId) {
  return getJSON(`/api/leaderboard/courses/${courseId}`);
}
