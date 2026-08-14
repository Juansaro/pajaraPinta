"""One-off image optimization: logo, WebP, thumbs, OG. Not a build step."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
MIG = ROOT / "images_migration"


def save_webp(im: Image.Image, dest: Path, quality=78):
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.convert("RGB").save(dest, "WEBP", quality=quality, method=6)


def save_jpeg(im: Image.Image, dest: Path, quality=80):
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.convert("RGB").save(dest, "JPEG", quality=quality, optimize=True)


def thumb(im: Image.Image, max_side: int) -> Image.Image:
    t = im.copy()
    t.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    return t


def main():
    # Nav logo ~96px (2x for 48px display)
    logo_src = MIG / "branding" / "logo_principal.png"
    logo = Image.open(logo_src).convert("RGBA")
    logo.thumbnail((96, 96), Image.Resampling.LANCZOS)
    logo.save(MIG / "branding" / "logo_nav.png", optimize=True)
    logo.convert("RGB").save(MIG / "branding" / "logo_nav.webp", "WEBP", quality=85, method=6)
    print("logo_nav", (MIG / "branding" / "logo_nav.png").stat().st_size)

    # OG 1200x630 from hero ceramica
    hero = Image.open(MIG / "principal" / "img_principal_ceramica.jpeg").convert("RGB")
    og_w, og_h = 1200, 630
    scale = max(og_w / hero.width, og_h / hero.height)
    resized = hero.resize((int(hero.width * scale), int(hero.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - og_w) // 2
    top = (resized.height - og_h) // 2
    og = resized.crop((left, top, left + og_w, top + og_h))
    og_path = MIG / "principal" / "og.jpg"
    save_jpeg(og, og_path, quality=82)
    print("og", og_path.stat().st_size)

    # WebP siblings for every jpeg; thumbs for product photos
    for jpeg in MIG.rglob("*.jpeg"):
        if "thumbs" in jpeg.parts:
            continue
        im = Image.open(jpeg).convert("RGB")
        webp = jpeg.with_suffix(".webp")
        save_webp(im, webp, quality=76)
        print("webp", webp.relative_to(ROOT), webp.stat().st_size)

        if "imagenes_hijas" in jpeg.parts:
            tdir = jpeg.parent / "thumbs"
            t = thumb(im, 600)
            save_webp(t, tdir / f"{jpeg.stem}.webp", quality=74)
            save_jpeg(t, tdir / f"{jpeg.stem}.jpeg", quality=78)

        if jpeg.parent.name == "principal" or jpeg.name.startswith("img_padre_"):
            tdir = jpeg.parent / "thumbs"
            t = thumb(im, 900)
            save_webp(t, tdir / f"{jpeg.stem}.webp", quality=74)

    print("done")


if __name__ == "__main__":
    main()
