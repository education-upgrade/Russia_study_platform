export function getPlatformOwnerUserId() {
  return process.env.PLATFORM_OWNER_USER_ID?.trim() || null;
}

export function isPlatformOwner(userId: string | null | undefined) {
  const ownerId = getPlatformOwnerUserId();
  return Boolean(ownerId && userId && ownerId === userId);
}
