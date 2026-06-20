import { NextResponse } from "next/server";

// API routes are not used in static export (GitHub Pages).
// This route only works in server (standalone) mode.

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}
