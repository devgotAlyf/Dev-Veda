import PDFDocument from 'pdfkit';
import { ResultDocument } from '../models/Result';

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

function drawDoubleBorder(doc: PDFKit.PDFDocument): void {
  doc
    .rect(30, 30, PAGE_WIDTH - 60, PAGE_HEIGHT - 60)
    .lineWidth(1.5)
    .stroke('#333333');

  doc
    .rect(35, 35, PAGE_WIDTH - 70, PAGE_HEIGHT - 70)
    .lineWidth(0.5)
    .stroke('#666666');
}

function drawDoubleRule(doc: PDFKit.PDFDocument, y: number): void {
  doc
    .moveTo(MARGIN, y)
    .lineTo(PAGE_WIDTH - MARGIN, y)
    .lineWidth(0.8)
    .stroke('#333333');

  doc
    .moveTo(MARGIN, y + 3)
    .lineTo(PAGE_WIDTH - MARGIN, y + 3)
    .lineWidth(0.8)
    .stroke('#333333');
}

function drawThickRule(doc: PDFKit.PDFDocument, y: number): void {
  doc
    .moveTo(MARGIN, y)
    .lineTo(PAGE_WIDTH - MARGIN, y)
    .lineWidth(2)
    .stroke('#222222');
}

function drawThinRule(doc: PDFKit.PDFDocument, y: number): void {
  doc
    .moveTo(MARGIN, y)
    .lineTo(PAGE_WIDTH - MARGIN, y)
    .lineWidth(0.5)
    .stroke('#999999');
}

function checkPageBreak(doc: PDFKit.PDFDocument, neededHeight: number): void {
  if (doc.y + neededHeight > PAGE_HEIGHT - 80) {
    doc.addPage();
    drawDoubleBorder(doc);
    doc.y = 50;
  }
}

export function generatePdf(result: ResultDocument): PDFKit.PDFDocument {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    bufferPages: true,
    info: {
      Title: result.title,
      Author: 'VedaAI Academy',
      Subject: result.subject,
      Creator: 'VedaAI Assessment Generator',
    },
  });

  drawDoubleBorder(doc);

  // Header: VEDAAI ACADEMY
  doc
    .font('Helvetica-Bold')
    .fontSize(18)
    .fillColor('#1a1a2e')
    .text('VEDAAI ACADEMY', MARGIN, 50, {
      align: 'center',
      width: CONTENT_WIDTH,
    });

  doc.moveDown(0.3);

  // Exam title
  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .fillColor('#16213e')
    .text(result.title, MARGIN, doc.y, {
      align: 'center',
      width: CONTENT_WIDTH,
    });

  doc.moveDown(0.5);

  // Double rule after header
  drawDoubleRule(doc, doc.y);
  doc.y += 12;

  // Metadata row
  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor('#333333');

  const metaItems = [
    `Subject: ${result.subject}`,
    `Grade: ${result.gradeLevel}`,
    `Total Marks: ${result.totalMarks}`,
    `Duration: ${result.duration}`,
    `Date: ${today}`,
  ];

  doc.text(metaItems.join('   |   '), MARGIN, doc.y, {
    align: 'center',
    width: CONTENT_WIDTH,
  });

  doc.moveDown(0.5);

  // Double rule after metadata
  drawDoubleRule(doc, doc.y);
  doc.y += 12;

  // Student info box
  doc
    .font('Helvetica')
    .fontSize(10)
    .fillColor('#333333')
    .text(
      'Name: _______________   Roll No: ___________   Section: ___________',
      MARGIN,
      doc.y,
      { align: 'center', width: CONTENT_WIDTH }
    );

  doc.moveDown(0.8);

  // General Instructions
  if (result.instructions && result.instructions.length > 0) {
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor('#1a1a2e')
      .text('General Instructions:', MARGIN, doc.y);

    doc.moveDown(0.3);

    doc.font('Helvetica').fontSize(9).fillColor('#444444');
    for (const instruction of result.instructions) {
      checkPageBreak(doc, 15);
      doc.text(`  •  ${instruction}`, MARGIN + 10, doc.y, {
        width: CONTENT_WIDTH - 20,
      });
      doc.moveDown(0.2);
    }

    doc.moveDown(0.4);
  }

  // Thick rule before sections
  drawThickRule(doc, doc.y);
  doc.y += 15;

  // Sections
  for (const section of result.sections) {
    checkPageBreak(doc, 60);

    // Section header
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor('#1a1a2e')
      .text(
        `${section.sectionLabel} — ${section.sectionTitle}`,
        MARGIN,
        doc.y,
        { width: CONTENT_WIDTH }
      );

    doc.moveDown(0.2);

    // Section instruction
    doc
      .font('Helvetica-Oblique')
      .fontSize(9)
      .fillColor('#555555')
      .text(
        `[${section.instruction} · ${section.totalMarks} Marks]`,
        MARGIN,
        doc.y,
        { width: CONTENT_WIDTH }
      );

    doc.moveDown(0.4);
    drawThinRule(doc, doc.y);
    doc.y += 8;

    // Questions
    for (const question of section.questions) {
      const estimatedHeight =
        question.type === 'mcq' ? 90 : question.type === 'long' ? 60 : 40;
      checkPageBreak(doc, estimatedHeight);

      const questionY = doc.y;

      // Question text
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#222222')
        .text(
          `${question.questionNumber}. ${question.questionText}`,
          MARGIN,
          doc.y,
          { width: CONTENT_WIDTH - 50 }
        );

      // Marks right-aligned
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#1a1a2e')
        .text(`[${question.marks}M]`, PAGE_WIDTH - MARGIN - 40, questionY, {
          width: 40,
          align: 'right',
        });

      doc.moveDown(0.3);

      // MCQ options
      if (
        question.type === 'mcq' &&
        question.options &&
        question.options.length > 0
      ) {
        doc.font('Helvetica').fontSize(9).fillColor('#444444');
        for (const option of question.options) {
          checkPageBreak(doc, 14);
          doc.text(`   ${option}`, MARGIN + 15, doc.y, {
            width: CONTENT_WIDTH - 30,
          });
          doc.moveDown(0.15);
        }
      }

      // Difficulty tag
      doc
        .font('Helvetica')
        .fontSize(7)
        .fillColor('#aaaaaa')
        .text(`[${question.difficulty}]`, PAGE_WIDTH - MARGIN - 50, doc.y, {
          width: 50,
          align: 'right',
        });

      doc.moveDown(0.6);
    }

    doc.moveDown(0.5);
    drawThinRule(doc, doc.y);
    doc.y += 10;
  }

  // Footer: End of Paper
  checkPageBreak(doc, 40);
  doc.moveDown(1);
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('#1a1a2e')
    .text('— End of Paper —', MARGIN, doc.y, {
      align: 'center',
      width: CONTENT_WIDTH,
    });

  // Page numbers
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);

    if (i > 0) {
      drawDoubleBorder(doc);
    }

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor('#999999')
      .text(
        `Page ${i + 1} of ${pageCount}`,
        PAGE_WIDTH - MARGIN - 80,
        PAGE_HEIGHT - 40,
        { width: 80, align: 'right' }
      );
  }

  doc.end();
  return doc;
}
