import jsPDF from "jspdf";

// ── Constants ────────────────────────────────────────────────
const ORANGE      = [249, 115, 22];
const DARK        = [17, 24, 39];
const GRAY        = [107, 114, 128];
const LIGHT_GRAY  = [245, 245, 245];
const WHITE       = [255, 255, 255];
const LIGHT_ORANGE= [255, 237, 213];
const ANSWER_BG   = [239, 246, 255];
const ANSWER_TEXT = [30, 64, 175];

const PAGE_W   = 210;
const PAGE_H   = 297;
const MARGIN   = 16;
const C_WIDTH  = PAGE_W - MARGIN * 2;     // 178mm content width
const Q_X      = MARGIN + 8;              // question text x (after accent bar)
const A_X      = MARGIN + 8;             // answer text x
const Q_WIDTH  = C_WIDTH - 10;            // question wrap width
const A_WIDTH  = C_WIDTH - 12;            // answer wrap width
const LH_Q     = 5.5;                     // question line height
const LH_A     = 5.0;                     // answer line height
const FOOTER_Y = PAGE_H - 10;

// ── Helpers ──────────────────────────────────────────────────
const bg = (doc) => {
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
};

const footer = (doc, page, total) => {
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, FOOTER_Y - 2, PAGE_W - MARGIN, FOOTER_Y - 2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  doc.text("Interview Prep AI", MARGIN, FOOTER_Y + 1);
  doc.text(`Page ${page} of ${total}`, PAGE_W - MARGIN, FOOTER_Y + 1, { align: "right" });
};

const measureCard = (doc, questionText, answerText) => {
  doc.setFontSize(10);
  const qLines = doc.splitTextToSize(questionText, Q_WIDTH);
  doc.setFontSize(9);
  const aLines = doc.splitTextToSize(answerText, A_WIDTH);

  const qBlockH = qLines.length * LH_Q + 4;   // question block
  const aLabelH = 10;                           // "ANSWER" label row
  const aBlockH = aLines.length * LH_A + 4;    // answer block
  const padding  = 12;                          // top + bottom padding

  return {
    cardH: qBlockH + aLabelH + aBlockH + padding,
    qLines,
    aLines,
  };
};

const pageBreak = (doc, y, needed) => {
  if (y + needed > FOOTER_Y - 6) {
    doc.addPage();
    bg(doc);
    return { y: MARGIN + 6, newPage: true };
  }
  return { y, newPage: false };
};

// ── Main Export ──────────────────────────────────────────────
export const exportSessionToPDF = (sessionData) => {
  const doc       = new jsPDF({ unit: "mm", format: "a4" });
  const questions = sessionData?.questions || [];
  const pinned    = questions.filter((q) => q.isPinned);
  const regular   = questions.filter((q) => !q.isPinned);
  const ordered   = [...pinned, ...regular];

  // ════════════════════════════════════════════════════════════
  // PAGE 1 — Cover
  // ════════════════════════════════════════════════════════════
  bg(doc);

  // Orange header band
  doc.setFillColor(...ORANGE);
  doc.rect(0, 0, PAGE_W, 72, "F");

  // Logo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...LIGHT_ORANGE);
  doc.text("INTERVIEW PREP AI", MARGIN, 18);

  // Main title
  doc.setFontSize(28);
  doc.setTextColor(...WHITE);
  doc.text("Study Guide", MARGIN, 38);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(255, 220, 180);
  doc.text("AI-Powered Interview Preparation", MARGIN, 50);

  // Date
  doc.setFontSize(8);
  doc.setTextColor(255, 200, 150);
  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}`,
    MARGIN, 64
  );

  // ── Session Info Card ────────────────────────────────────────
  let y = 82;
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(MARGIN, y, C_WIDTH, 54, 4, 4, "F");
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.6);
  doc.roundedRect(MARGIN, y, C_WIDTH, 54, 4, 4, "S");

  // Left orange accent
  doc.setFillColor(...ORANGE);
  doc.roundedRect(MARGIN, y, 4, 54, 2, 2, "F");

  // Role title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...DARK);
  const roleLines = doc.splitTextToSize(sessionData?.role || "Interview Session", C_WIDTH - 20);
  doc.text(roleLines, MARGIN + 10, y + 12);

  // Divider inside card
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(MARGIN + 10, y + 20, PAGE_W - MARGIN - 6, y + 20);

  // Info grid — 3 columns
  const cols = [
    { label: "TOPICS",     value: sessionData?.topicsToFocus || "—" },
    { label: "EXPERIENCE", value: `${sessionData?.experience || "—"} Year(s)` },
    { label: "QUESTIONS",  value: String(questions.length) },
  ];

  cols.forEach((col, i) => {
    const cx = MARGIN + 10 + i * 58;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...ORANGE);
    doc.text(col.label, cx, y + 28);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    const val = doc.splitTextToSize(col.value, 52);
    doc.text(val[0], cx, y + 35);
  });

  // Description
  if (sessionData?.description) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(...GRAY);
    const dLines = doc.splitTextToSize(sessionData.description, C_WIDTH - 18);
    doc.text(dLines.slice(0, 2), MARGIN + 10, y + 46);
  }

  // ── Stats Row ────────────────────────────────────────────────
  y = 146;
  const stats = [
    { icon: "📝", label: "Total Q&A",   value: questions.length },
    { icon: "📌", label: "Pinned",       value: pinned.length },
    { icon: "🎯", label: "Topics",       value: (sessionData?.topicsToFocus || "").split(",").filter(Boolean).length },
  ];

  const statW = (C_WIDTH - 8) / 3;
  stats.forEach((stat, i) => {
    const sx = MARGIN + i * (statW + 4);
    doc.setFillColor(...LIGHT_ORANGE);
    doc.roundedRect(sx, y, statW, 26, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...ORANGE);
    doc.text(String(stat.value), sx + statW / 2, y + 14, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.text(stat.label, sx + statW / 2, y + 22, { align: "center" });
  });

  // ── Footer note ──────────────────────────────────────────────
  y = 184;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...GRAY);
  doc.text("This document contains all questions and answers from your prep session.", PAGE_W / 2, y + 8, { align: "center" });
  doc.text("Pinned questions appear first. Use this guide to study offline.", PAGE_W / 2, y + 15, { align: "center" });

  // ════════════════════════════════════════════════════════════
  // PAGE 2+ — Questions
  // ════════════════════════════════════════════════════════════
  doc.addPage();
  bg(doc);
  y = MARGIN;

  // Section header bar
  doc.setFillColor(...ORANGE);
  doc.roundedRect(MARGIN, y, C_WIDTH, 11, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...WHITE);
  doc.text("Questions & Answers", PAGE_W / 2, y + 7.5, { align: "center" });
  y += 16;

  ordered.forEach((q, index) => {
    const questionText = q.question || "";
    const answerText   = (q.answer   || "").replace(/\*\*/g, "").replace(/`/g, "");

    const { cardH, qLines, aLines } = measureCard(doc, questionText, answerText);

    // Page break if needed
    const pb = pageBreak(doc, y, cardH + 4);
    y = pb.y;
    if (pb.newPage) {
      // Repeat section header on new page
      doc.setFillColor(...ORANGE);
      doc.roundedRect(MARGIN, MARGIN, C_WIDTH, 11, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...WHITE);
      doc.text("Questions & Answers (continued)", PAGE_W / 2, MARGIN + 7.5, { align: "center" });
      y = MARGIN + 16;
    }

    // ── Card background ──────────────────────────────────────
    doc.setFillColor(...WHITE);
    doc.roundedRect(MARGIN, y, C_WIDTH, cardH, 3, 3, "F");
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(MARGIN, y, C_WIDTH, cardH, 3, 3, "S");

    // Left accent bar
    doc.setFillColor(...(q.isPinned ? ORANGE : [209, 213, 219]));
    doc.rect(MARGIN, y, 3, cardH, "F");

    // ── Question number badge ────────────────────────────────
    doc.setFillColor(...ORANGE);
    doc.circle(MARGIN + 11, y + 7, 4.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...WHITE);
    doc.text(String(index + 1), MARGIN + 11, y + 9, { align: "center" });

    // Pinned badge
    if (q.isPinned) {
      doc.setFillColor(...LIGHT_ORANGE);
      doc.roundedRect(PAGE_W - MARGIN - 20, y + 3, 18, 6, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(...ORANGE);
      doc.text("★  Pinned", PAGE_W - MARGIN - 11, y + 7.5, { align: "center" });
    }

    // ── Question text ────────────────────────────────────────
    let ty = y + 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    const qStartX = MARGIN + 19;
    const qWrap   = C_WIDTH - 22;
    const qWrapped = doc.splitTextToSize(questionText, qWrap);
    qWrapped.forEach((line) => {
      doc.text(line, qStartX, ty + LH_Q);
      ty += LH_Q;
    });
    ty += 3;

    // ── Divider ──────────────────────────────────────────────
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(MARGIN + 5, ty, PAGE_W - MARGIN - 5, ty);
    ty += 5;

    // ── Answer label pill ────────────────────────────────────
    doc.setFillColor(...ANSWER_BG);
    doc.roundedRect(MARGIN + 5, ty - 3, 20, 6, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...ANSWER_TEXT);
    doc.text("ANSWER", MARGIN + 15, ty + 1.5, { align: "center" });
    ty += 6;

    // ── Answer text ──────────────────────────────────────────
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    const aWrapped = doc.splitTextToSize(answerText, C_WIDTH - 14);
    aWrapped.forEach((line) => {
      doc.text(line, MARGIN + 7, ty + LH_A);
      ty += LH_A;
    });

    y = y + cardH + 4;
  });

  // ── Add footers to all pages ─────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    footer(doc, p, total);
  }

  const fileName = `${(sessionData?.role || "session").replace(/\s+/g, "_")}_prep_guide.pdf`;
  doc.save(fileName);
};
