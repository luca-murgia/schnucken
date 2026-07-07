import { prisma } from "@/lib/prisma";

// Serves a downloadable menu file (stored inline as a base64 data URL in the
// DB) as real bytes with the right Content-Type + filename. Public — menus are
// public — but only exposes rows that exist. Runs on the Node runtime (Prisma).

/** Strip anything that could break the Content-Disposition header. */
function safeFilename(name: string): string {
  const cleaned = name.replace(/[\r\n"\\]/g, "").trim();
  return cleaned || "menu";
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let row: { file: string; fileType: string; fileName: string } | null = null;
  try {
    row = await prisma.menuDownload.findUnique({
      where: { id },
      select: { file: true, fileType: true, fileName: true },
    });
  } catch {
    return new Response("Error", { status: 500 });
  }
  if (!row) return new Response("Not found", { status: 404 });

  // The stored value is `data:<mime>;base64,<payload>`.
  const comma = row.file.indexOf(",");
  if (comma === -1 || !row.file.startsWith("data:")) {
    return new Response("Invalid file", { status: 500 });
  }
  const bytes = Buffer.from(row.file.slice(comma + 1), "base64");

  return new Response(bytes, {
    headers: {
      "Content-Type": row.fileType || "application/octet-stream",
      // `inline` lets PDFs/images open in the browser (with a download option);
      // the filename is used when the visitor chooses to save.
      "Content-Disposition": `inline; filename="${safeFilename(row.fileName)}"`,
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=300",
    },
  });
}
