export function excludePassword(user: any) {
  if (!user) return null;
  const { password, ...userData } = user.toObject();
  return userData;
}
