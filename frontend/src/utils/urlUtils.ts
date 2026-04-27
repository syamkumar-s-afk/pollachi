export function getSafeHttpUrl(value: string | null | undefined): string {
  const url = value?.trim();
  if (!url) {
    return '';
  }

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
      ? parsedUrl.toString()
      : '';
  } catch {
    return '';
  }
}
