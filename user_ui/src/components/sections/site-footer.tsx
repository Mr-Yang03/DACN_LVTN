export function SiteFooter() {
  return (
    <footer className="border-t py-6 bg-muted/40 p-5">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Hệ thống giám sát giao thông đô thị © {new Date().getFullYear()}. All rights reserved.
        </p>
        <p className="text-center text-sm text-muted-foreground md:text-left">Version 1.0.0</p>
      </div>
    </footer>
  )
}

