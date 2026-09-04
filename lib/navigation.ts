export function safeLocalPath(value: string | null | undefined, fallback = '/account') {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : fallback;
}

export function getPublicAppOrigin(fallbackOrigin: string) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return configured ? configured.replace(/\/$/, '') : fallbackOrigin.replace(/\/$/, '');
}
