import { getServiceBlocks } from "@/lib/serviceBlocksData";
import NavClient from "./NavClient";

export default async function Nav() {
  const serviceBlocks = await getServiceBlocks();
  return <NavClient serviceBlocks={serviceBlocks} />;
}
