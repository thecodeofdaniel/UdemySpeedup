// What's this?: Stuff shared throughout whole extension

/** This will activate the extension if it matches the following
 * https://www.udemy.com/course/foo/learn/lecture/bar
 * foo = name of the course
 * bar = the rest of the url where it also includes the id of the lecture
 */
export const UDEMY_VIDEO_URL_PATTERN =
  /^https:\/\/www\.udemy\.com\/course\/[^\/]+\/learn\/lecture/;

/** Removes any whitespace and removes the trailing 'x' if there is one */
export function toNumber(str: string) {
  str = str.trim().toUpperCase();

  if (str.endsWith('X')) {
    str = str.slice(0, -1);
  }

  if (str === '' || str === null || isNaN(Number(str))) {
    return null;
  }

  return +str;
}

/** Rounds up a float value to four decimal places */
export function roundUp(value: number) {
  return parseFloat(value.toFixed(4));
}

/** Gets the course name for that lecture */
export function extractCourseName(url: string | undefined) {
  if (url === undefined) return null;

  const baseUrl = 'https://www.udemy.com/course/';

  if (url.startsWith(baseUrl)) {
    const coursePath = url.slice(baseUrl.length); // Remove the base URL
    const courseName = coursePath.split('/')[0]; // Extract the first part (course name)
    return courseName;
  }

  return null;
}
