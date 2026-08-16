// Stand-in photos for the "Наша команда" block, shown by position when the
// admin hasn't uploaded a real photo for that specialist yet (the DB/S3
// photo always wins — see components/landing/Specialists.tsx and
// components/service-page/ServiceCategoryPage.tsx). Cycles if there are
// more team members than default photos.
export const teamPhotoDefaults = ["/images/man1.webp", "/images/man3.webp", "/images/man4.webp", "/images/man5.webp"];

export function teamPhotoDefaultFor(index: number): string {
  return teamPhotoDefaults[index % teamPhotoDefaults.length];
}
