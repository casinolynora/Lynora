import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateSubmission, isSpamSubmission } from "@/lib/b2b/validation";
import { createSubmission, notifyOperatorSubmission } from "@/lib/b2b/admin";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rateLimit = await checkRateLimit(`b2b:${ip}`, 5, 60);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const validation = validateSubmission(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.errors },
      { status: 400 },
    );
  }

  if (isSpamSubmission(validation.data!)) {
    return NextResponse.json(
      { error: "Submission rejected" },
      { status: 422 },
    );
  }

  try {
    const data = validation.data!;
    const submission = createSubmission({
      casinoId: null,
      brandName: data.brandName,
      officialWebsite: data.officialWebsite,
      operatorName: data.operatorName,
      contactName: data.contactName,
      businessEmail: data.businessEmail,
      targetGeos: data.targetGeos,
      requestedPlan: data.requestedPlan,
      message: data.message,
      affiliateManagerContact: data.affiliateManagerContact,
      affiliateProgramUrl: data.affiliateProgramUrl,
      licenseInfo: data.licenseInfo,
      yearLaunched: data.yearLaunched,
      supportedLanguages: data.supportedLanguages,
      paymentMethods: data.paymentMethods,
      productCategories: data.productCategories,
      existingProfileUrl: data.existingProfileUrl,
    });

    notifyOperatorSubmission(submission);

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
    });
  } catch {
    console.error("B2B submit API error");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
