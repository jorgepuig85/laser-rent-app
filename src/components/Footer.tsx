import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t py-8 md:py-12 bg-muted/20">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Image
            src="/logo-laser-rent.svg"
            alt="Laser Rent Logo"
            width={120}
            height={32}
            className="h-8 w-auto opacity-80"
          />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Laser Rent. Equipo de profesionales para profesionales.
          </p>
        </div>
        <div className="flex gap-4 items-center">
        </div>
      </div>
    </footer>
  );
}
