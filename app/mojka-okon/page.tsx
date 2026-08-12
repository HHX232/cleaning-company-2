import ServiceCategoryHub, { categoryMetadata } from "@/components/service-page/ServiceCategoryHub";

export const revalidate = 600;

export function generateMetadata() {
  return categoryMetadata("mojka-okon");
}

export default function Page() {
  return <ServiceCategoryHub slug="mojka-okon" />;
}
