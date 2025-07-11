const fs = require('fs');
const puppeteer = require('puppeteer');

// Simple markdown to HTML converter (basic implementation)
function markdownToHtml(markdown) {
    return markdown
        // Headers
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
        .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
        
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        
        // Lists
        .replace(/^\- (.*$)/gm, '<li>$1</li>')
        .replace(/^(\d+)\. (.*$)/gm, '<li>$1. $2</li>')
        
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        
        // Wrap in paragraphs
        .replace(/^(?!<[h|l|p|d])/gm, '<p>')
        .replace(/(?<!>)$/gm, '</p>')
        
        // Clean up
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<[h|l|d])/g, '$1')
        .replace(/(<\/[h|l|d][^>]*>)<\/p>/g, '$1');
}

async function generatePDF() {
    try {
        console.log('Reading markdown file...');
        const markdownContent = fs.readFileSync('TECHNICAL_BREAKDOWN.md', 'utf8');
        
        console.log('Converting markdown to HTML...');
        const htmlContent = markdownToHtml(markdownContent);
        
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
                    font-size: 2.2em;
                }
                
                h2 {
                    color: #1e40af;
                    margin-top: 25px;
                    margin-bottom: 15px;
                    font-size: 1.8em;
                }
                
                h3 {
                    color: #3730a3;
                    margin-top: 20px;
                    margin-bottom: 10px;
                    font-size: 1.4em;
                }
                
                h4 {
                    color: #4338ca;
                    margin-top: 15px;
                    margin-bottom: 8px;
                    font-size: 1.2em;
                }
                
                h5 {
                    color: #5b21b6;
                    margin-top: 12px;
                    margin-bottom: 6px;
                    font-size: 1.1em;
                }
                
                code {
                    background-color: #f1f5f9;
                    padding: 2px 4px;
                    border-radius: 4px;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-size: 0.9em;
                    color: #dc2626;
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
                    color: #1f2937;
                }
                
                ul, ol {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                
                li {
                    margin: 5px 0;
                }
                
                p {
                    margin: 10px 0;
                }
                
                strong {
                    color: #1f2937;
                }
                
                em {
                    color: #4b5563;
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
                
                hr {
                    border: none;
                    border-top: 2px solid #e2e8f0;
                    margin: 30px 0;
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
                    
                    pre {
                        page-break-inside: avoid;
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
            
            <hr>
            <div style="text-align: center; margin-top: 50px; color: #64748b;">
                <p><em>This document was automatically generated from the TechGPT technical documentation.</em></p>
                <p><strong>TechGPT</strong> - AI-Powered Technical Support Platform</p>
            </div>
        </body>
        </html>
        `;
        
        console.log('Launching browser...');
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        console.log('Setting content...');
        await page.setContent(fullHtmlContent, { waitUntil: 'networkidle0' });
        
        console.log('Generating PDF...');
        const pdf = await page.pdf({
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
            footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; margin: 0 auto; color: #64748b;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
        });
        
        await browser.close();
        
        console.log('Saving PDF...');
        fs.writeFileSync('TechGPT_Technical_Breakdown.pdf', pdf);
        
        // Get file size
        const stats = fs.statSync('TechGPT_Technical_Breakdown.pdf');
        const fileSizeInBytes = stats.size;
        const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
        
        console.log(`PDF generated successfully: TechGPT_Technical_Breakdown.pdf`);
        console.log(`PDF file size: ${fileSizeInMB} MB`);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

generatePDF();