import { editorial1 } from "../../../public/assets";
import Image from "next/image";

export default function Sandbox() {
  return (
    <div className="sandbox">
      {/* <TrialCarousel items={demoItems} /> */}
      <Image
        src={editorial1}
        alt="editorial"
        fill // Makes image fill parent container
        style={{ objectFit: "cover" }} // Ensures proper cropping
        sizes="100vw" // Tells browser this image is full viewport width
        priority // Prevents lazy loading for hero images
        quality={85} // Balance between quality and file size
      />
    </div>
  );
}
