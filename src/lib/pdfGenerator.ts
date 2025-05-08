'use client'; // This module will be used client-side

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPdf = async (elementId: string, fileName: string = 'resume'): Promise<void> => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with id '${elementId}' not found for PDF export.`);
    alert(`Error: Could not find resume content to export. Element ID: ${elementId}`);
    return;
  }

  try {
    // Temporarily adjust styling for better PDF rendering if needed
    // For example, ensure no scrollbars are captured on the element itself
    const originalOverflow = input.style.overflow;
    input.style.overflow = 'visible';

    const canvas = await html2canvas(input, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // If using external images
      logging: process.env.NODE_ENV === 'development', // Enable logging in dev
      width: input.scrollWidth, // Use scrollWidth for full content width
      height: input.scrollHeight, // Use scrollHeight for full content height
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight,
    });
    
    input.style.overflow = originalOverflow; // Restore original style

    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4', // Standard A4 size
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = imgProps.width;
    const imgHeight = imgProps.height;

    // Calculate aspect ratio to fit the image onto the A4 page
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const newImgWidth = imgWidth * ratio;
    const newImgHeight = imgHeight * ratio;

    // Calculate offsets to center the image (optional)
    // const xOffset = (pdfWidth - newImgWidth) / 2;
    // const yOffset = (pdfHeight - newImgHeight) / 2;
    // For resumes, usually top-left aligned is better
    const xOffset = 0; 
    const yOffset = 0;

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, newImgWidth, newImgHeight);
    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('An error occurred while generating the PDF. Please try again.');
  }
};
