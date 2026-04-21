import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ familyId: string }> },
) {
  const { familyId } = await params;
  const url = new URL(req.url);
  const now = new Date();
  const month = parseInt(url.searchParams.get("month") ?? String(now.getMonth() + 1));
  const year = parseInt(url.searchParams.get("year") ?? String(now.getFullYear()));

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { data: membership } = await supabase
    .from("memberships")
    .select("family_id")
    .eq("family_id", familyId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) return new NextResponse("Not found", { status: 404 });

  const { data: edition, error: edErr } = await supabase
    .rpc("get_or_create_edition", { fid: familyId, y: year, m: month })
    .maybeSingle<{ public_slug: string }>();
  if (edErr || !edition?.public_slug) {
    return new NextResponse("Failed to resolve edition", { status: 500 });
  }

  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const gazetteUrl = `${proto}://${host}/g/${edition.public_slug}`;

  const isVercel = !!process.env.VERCEL;
  let browser;
  try {
    if (isVercel) {
      const chromium = (await import("@sparticuz/chromium")).default;
      const puppeteer = await import("puppeteer-core");
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      const puppeteer = await import("puppeteer-core");
      browser = await puppeteer.launch({
        headless: true,
        executablePath:
          process.env.CHROME_PATH ||
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      });
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 2 });
    await page.goto(gazetteUrl, { waitUntil: "networkidle0", timeout: 45000 });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    const monthLabel = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
    ][month - 1];

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="gaceta-${monthLabel}-${year}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return new NextResponse(`PDF failed: ${msg}`, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
