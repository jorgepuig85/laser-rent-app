export function Footer() {
  return (
    <footer className="border-t py-8 md:py-12 bg-muted/20">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} LaserRent Pro. Equipo de profesionales para profesionales.
        </p>
        <div className="flex gap-4 items-center">
        </div>
      </div>
    </footer>
  );
}
