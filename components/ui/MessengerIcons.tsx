import Image from "next/image";

type IconProps = { className?: string };

export function TelegramIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <Image
      src="/images/logos/Telegram_logo.svg.webp"
      alt="Telegram"
      width={32}
      height={32}
      className={`${className} object-contain`}
    />
  );
}

export function ViberIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <Image
      src="/images/logos/viber-tile.svg"
      alt="Viber"
      width={32}
      height={32}
      className={`${className} object-contain`}
    />
  );
}

export function WhatsAppIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <Image
      src="/images/logos/whatsapp.svg"
      alt="WhatsApp"
      width={32}
      height={32}
      className={`${className} object-contain`}
    />
  );
}
