// Production talks to the API directly; in dev Vite proxies /api to it (see vite.config.js).
export const API_BASE =
  import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? '' : 'https://autox.romangarms.com');

async function getJSON(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  return res.json();
}

export function listCourses(region) {
  return getJSON(`/api/leaderboard/courses${region ? `?region=${region}` : ''}`);
}

export function getCourseLeaderboard(courseId) {
  return getJSON(`/api/leaderboard/courses/${courseId}`);
}

export async function loadBoards(region) {
  const courses = await listCourses(region);
  return Promise.all(courses.map((c) => getCourseLeaderboard(c.id)));
}

export function listAcceleration() {
  return getJSON('/api/acceleration');
}
