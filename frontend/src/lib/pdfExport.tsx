import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
} from '@react-pdf/renderer';
import { GeneratedPaper } from '../types';

// Register fonts
Font.register({
  family: 'Merriweather',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-fCZM.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l52xwNZWMf6.woff2', fontWeight: 700 },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
    color: '#1C1917',
  },
  borderOuter: {
    position: 'absolute',
    top: 30,
    bottom: 30,
    left: 30,
    right: 30,
    borderWidth: 1,
    borderColor: '#334155',
  },
  borderInner: {
    position: 'absolute',
    top: 35,
    bottom: 35,
    left: 35,
    right: 35,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerCenter: {
    textAlign: 'center',
    marginBottom: 10,
  },
  academyName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  examTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
  },
  doubleRule: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#334155',
    height: 3,
    marginVertical: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
  },
  studentInfoBox: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 11,
    lineHeight: 2,
  },
  instructionsHeader: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    marginTop: 10,
    marginBottom: 5,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 3,
    fontSize: 10,
  },
  instructionBullet: {
    width: 15,
  },
  thickRule: {
    borderTopWidth: 2,
    borderColor: '#334155',
    marginVertical: 15,
  },
  sectionHeader: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    textTransform: 'uppercase',
    marginTop: 15,
    marginBottom: 5,
  },
  sectionInstruction: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 10,
    color: '#78716C',
    marginBottom: 8,
  },
  thinRule: {
    borderTopWidth: 1,
    borderColor: '#334155',
    marginBottom: 15,
  },
  questionRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  questionNumber: {
    width: 25,
    fontFamily: 'Helvetica-Bold',
  },
  questionContent: {
    flex: 1,
  },
  questionTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionText: {
    flex: 1,
    paddingRight: 10,
  },
  marks: {
    fontFamily: 'Helvetica-Bold',
    width: 30,
    textAlign: 'right',
  },
  optionsList: {
    marginTop: 5,
    marginLeft: 15,
  },
  optionText: {
    marginBottom: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 10,
    color: '#78716C',
  },
});

export const ExamPaperPDF: React.FC<{ paper: GeneratedPaper }> = ({ paper }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.borderOuter} />
      <View style={styles.borderInner} />

      <View style={styles.headerCenter}>
        <Text style={styles.academyName}>VEDAAI ACADEMY</Text>
        <Text style={styles.examTitle}>{paper.title || 'EXAMINATION QUESTION PAPER'}</Text>
      </View>

      <View style={styles.doubleRule} />

      <View style={styles.metaRow}>
        <Text>Subject: {paper.subject}</Text>
        <Text>Grade: {paper.gradeLevel}</Text>
        <Text>Total Marks: {paper.totalMarks}</Text>
        <Text>Duration: {paper.duration}</Text>
      </View>

      <View style={styles.doubleRule} />

      <View style={styles.studentInfoBox}>
        <Text>Name: _____________________________________________</Text>
        <Text>Roll No: ______________________   Section: _______________</Text>
      </View>

      <Text style={styles.instructionsHeader}>General Instructions:</Text>
      {paper.instructions && paper.instructions.map((inst, i) => (
        <View key={i} style={styles.instructionItem}>
          <Text style={styles.instructionBullet}>•</Text>
          <Text>{inst}</Text>
        </View>
      ))}

      <View style={styles.thickRule} />

      {paper.sections.map((section, sIdx) => (
        <View key={sIdx} wrap={false}>
          <Text style={styles.sectionHeader}>{section.sectionLabel} — {section.sectionTitle}</Text>
          <Text style={styles.sectionInstruction}>[{section.instruction} · {section.totalMarks} Marks]</Text>
          <View style={styles.thinRule} />

          {section.questions.map((q, qIdx) => (
            <View key={qIdx} style={styles.questionRow} wrap={false}>
              <Text style={styles.questionNumber}>{q.questionNumber < 10 ? `0${q.questionNumber}` : q.questionNumber}.</Text>
              <View style={styles.questionContent}>
                <View style={styles.questionTextRow}>
                  <Text style={styles.questionText}>{q.questionText}</Text>
                  <Text style={styles.marks}>[{q.marks}M]</Text>
                </View>
                {q.type === 'mcq' && q.options && q.options.length > 0 && (
                  <View style={styles.optionsList}>
                    {q.options.map((opt, oIdx) => (
                      <Text key={oIdx} style={styles.optionText}>{opt}</Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      ))}

      <Text style={styles.footer} fixed>— End of Paper —</Text>
    </Page>
  </Document>
);

export const downloadPdf = async (paper: GeneratedPaper, filename: string) => {
  const blob = await pdf(<ExamPaperPDF paper={paper} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
