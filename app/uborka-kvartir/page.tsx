import ServiceCategoryHub, { categoryMetadata } from "@/components/service-page/ServiceCategoryHub";

export const revalidate = 600;

export function generateMetadata() {
  return categoryMetadata("uborka-kvartir");
}

export default function Page() {
  return <ServiceCategoryHub slug="uborka-kvartir" />;
}
