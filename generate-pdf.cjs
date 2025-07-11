const fs = require('fs');
const { marked } = require('marked');
const htmlPdf = require('html-pdf-node');

// Read the markdown file
const markdownContent = fs.readFileSync('TECHNICAL_BREAKDOWN.md', 'utf8');

// Convert markdown to HTML
const htmlContent = marked(markdownContent);

// Create a complete HTML document with styling
const fullHtmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>TechGPT Technical Breakdown</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
        }
        
        h1 {
            color: #2563eb;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 10px;
            margin-top: 30px;
        }
        
        h2 {
            color: #1e40af;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        
        h3 {
            color: #3730a3;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        
        h4 {
            color: #4338ca;
            margin-top: 15px;
            margin-bottom: 8px;
        }
        
        code {
            background-color: #f1f5f9;
            padding: 2px 4px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
        }
        
        pre {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 15px;
            overflow-x: auto;
            margin: 15px 0;
        }
        
        pre code {
            background-color: transparent;
            padding: 0;
        }
        
        blockquote {
            border-left: 4px solid #2563eb;
            padding-left: 20px;
            margin-left: 0;
            font-style: italic;
            color: #64748b;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        th, td {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
        }
        
        th {
            background-color: #f8fafc;
            font-weight: 600;
        }
        
        ul, ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        li {
            margin: 5px 0;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
        }
        
        .header h1 {
            border-bottom: none;
            margin: 0;
            font-size: 2.5em;
            color: #1e40af;
        }
        
        .header p {
            color: #64748b;
            font-size: 1.1em;
            margin: 10px 0;
        }
        
        .toc {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .toc h2 {
            margin-top: 0;
            color: #1e40af;
        }
        
        .toc ul {
            list-style-type: none;
            padding-left: 0;
        }
        
        .toc li {
            margin: 8px 0;
        }
        
        .toc a {
            color: #2563eb;
            text-decoration: none;
        }
        
        .toc a:hover {
            text-decoration: underline;
        }
        
        .section-number {
            color: #64748b;
            font-weight: normal;
        }
        
        .feature-highlight {
            background-color: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin: 15px 0;
            border-radius: 0 6px 6px 0;
        }
        
        .tech-stack {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .deployment-info {
            background-color: #fef3c7;
            border: 1px solid #fde047;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
        }
        
        @media print {
            body {
                font-size: 12pt;
                line-height: 1.4;
            }
            
            h1 {
                font-size: 20pt;
            }
            
            h2 {
                font-size: 16pt;
            }
            
            h3 {
                font-size: 14pt;
            }
            
            h4 {
                font-size: 12pt;
            }
            
            .page-break {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>TechGPT Application</h1>
        <p><strong>Comprehensive Technical Breakdown</strong></p>
        <p>Generated on ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}</p>
    </div>
    
    ${htmlContent}
    
    <div class="page-break"></div>
    <div style="text-align: center; margin-top: 50px; color: #64748b;">
        <p><em>This document was automatically generated from the TechGPT technical documentation.</em></p>
        <p><strong>TechGPT</strong> - AI-Powered Technical Support Platform</p>
    </div>
</body>
</html>
`;

// Configure PDF options
const options = {
    format: 'A4',
    margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
    },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; margin: 0 auto; color: #64748b;">TechGPT Technical Breakdown</div>',
    footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; margin: 0 auto; color: #64748b;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    preferCSSPageSize: true
};

// Generate PDF
const file = { content: fullHtmlContent };

async function generatePDF() {
    try {
        console.log('Generating PDF...');
        const pdfBuffer = await htmlPdf.generatePdf(file, options);
        
        // Save the PDF
        fs.writeFileSync('TechGPT_Technical_Breakdown.pdf', pdfBuffer);
        console.log('PDF generated successfully: TechGPT_Technical_Breakdown.pdf');
        
        // Get file size
        const stats = fs.statSync('TechGPT_Technical_Breakdown.pdf');
        const fileSizeInBytes = stats.size;
        const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
        
        console.log(`PDF file size: ${fileSizeInMB} MB`);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

generatePDF();