const fs = require('fs');

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
    return markdown
        // Headers - order matters, do longest patterns first
        .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
        .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Code blocks
        .replace(/```json\n([\s\S]*?)```/g, '<pre class="json"><code>$1</code></pre>')
        .replace(/```bash\n([\s\S]*?)```/g, '<pre class="bash"><code>$1</code></pre>')
        .replace(/```toml\n([\s\S]*?)```/g, '<pre class="toml"><code>$1</code></pre>')
        .replace(/```nix\n([\s\S]*?)```/g, '<pre class="nix"><code>$1</code></pre>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        
        // Lists - handle nested lists
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/^  - (.*$)/gm, '<li class="nested">$1</li>')
        .replace(/^(\d+)\. (.*$)/gm, '<li class="numbered">$1. $2</li>')
        
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        
        // Horizontal rules
        .replace(/^---$/gm, '<hr>')
        
        // Convert line breaks to proper HTML
        .split('\n\n')
        .map(paragraph => {
            if (paragraph.trim() === '') return '';
            if (paragraph.match(/^<[h|l|p|d|u]/)) return paragraph;
            return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
        })
        .join('\n\n')
        
        // Wrap consecutive list items
        .replace(/(<li[^>]*>.*?<\/li>\s*)+/gs, '<ul>$&</ul>')
        
        // Clean up nested paragraphs in lists
        .replace(/<li[^>]*><p>(.*?)<\/p><\/li>/g, '<li>$1</li>')
        .replace(/<p>(<[h|l|d|u])/g, '$1')
        .replace(/(<\/[h|l|d|u][^>]*>)<\/p>/g, '$1');
}

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
            * {
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 900px;
                margin: 0 auto;
                padding: 30px;
                background-color: #fff;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 25px;
            }
            
            .header h1 {
                margin: 0;
                font-size: 2.8em;
                color: #1e40af;
                font-weight: 700;
            }
            
            .header .subtitle {
                color: #64748b;
                font-size: 1.3em;
                margin: 15px 0;
                font-weight: 500;
            }
            
            .header .date {
                color: #6b7280;
                font-size: 1.1em;
                margin: 10px 0;
            }
            
            h1 {
                color: #1e40af;
                border-bottom: 2px solid #3b82f6;
                padding-bottom: 10px;
                margin: 40px 0 20px 0;
                font-size: 2.2em;
                font-weight: 600;
            }
            
            h2 {
                color: #1e40af;
                margin: 35px 0 18px 0;
                font-size: 1.8em;
                font-weight: 600;
            }
            
            h3 {
                color: #3730a3;
                margin: 30px 0 15px 0;
                font-size: 1.5em;
                font-weight: 600;
            }
            
            h4 {
                color: #4338ca;
                margin: 25px 0 12px 0;
                font-size: 1.3em;
                font-weight: 600;
            }
            
            h5 {
                color: #5b21b6;
                margin: 20px 0 10px 0;
                font-size: 1.1em;
                font-weight: 600;
            }
            
            p {
                margin: 15px 0;
                text-align: justify;
            }
            
            strong {
                color: #1f2937;
                font-weight: 600;
            }
            
            em {
                color: #4b5563;
                font-style: italic;
            }
            
            code {
                background-color: #f1f5f9;
                padding: 3px 6px;
                border-radius: 4px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 0.9em;
                color: #dc2626;
                border: 1px solid #e2e8f0;
            }
            
            pre {
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 20px;
                overflow-x: auto;
                margin: 20px 0;
                border-left: 4px solid #3b82f6;
            }
            
            pre code {
                background-color: transparent;
                padding: 0;
                color: #1f2937;
                border: none;
                font-size: 0.9em;
            }
            
            pre.json {
                border-left-color: #10b981;
            }
            
            pre.bash {
                border-left-color: #8b5cf6;
            }
            
            pre.toml {
                border-left-color: #f59e0b;
            }
            
            pre.nix {
                border-left-color: #ef4444;
            }
            
            ul, ol {
                margin: 15px 0;
                padding-left: 25px;
            }
            
            li {
                margin: 8px 0;
                line-height: 1.6;
            }
            
            li.nested {
                margin-left: 20px;
                color: #4b5563;
            }
            
            li.numbered {
                font-weight: 500;
            }
            
            hr {
                border: none;
                border-top: 2px solid #e2e8f0;
                margin: 40px 0;
            }
            
            a {
                color: #2563eb;
                text-decoration: none;
            }
            
            a:hover {
                text-decoration: underline;
            }
            
            .toc {
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 25px;
                margin: 30px 0;
            }
            
            .feature-highlight {
                background-color: #eff6ff;
                border: 1px solid #bfdbfe;
                border-left: 4px solid #3b82f6;
                padding: 20px;
                margin: 20px 0;
                border-radius: 0 8px 8px 0;
            }
            
            .tech-stack {
                background-color: #f0fdf4;
                border: 1px solid #bbf7d0;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            
            .deployment-info {
                background-color: #fef3c7;
                border: 1px solid #fde047;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            
            .footer {
                text-align: center;
                margin-top: 60px;
                padding-top: 30px;
                border-top: 2px solid #e2e8f0;
                color: #64748b;
            }
            
            .footer p {
                margin: 10px 0;
            }
            
            .footer .title {
                font-weight: 600;
                color: #1f2937;
                font-size: 1.1em;
            }
            
            @media print {
                body {
                    font-size: 11pt;
                    line-height: 1.4;
                    padding: 20px;
                }
                
                .header h1 {
                    font-size: 24pt;
                }
                
                h1 {
                    font-size: 20pt;
                    page-break-after: avoid;
                }
                
                h2 {
                    font-size: 16pt;
                    page-break-after: avoid;
                }
                
                h3 {
                    font-size: 14pt;
                    page-break-after: avoid;
                }
                
                h4 {
                    font-size: 12pt;
                    page-break-after: avoid;
                }
                
                pre {
                    page-break-inside: avoid;
                    font-size: 9pt;
                }
                
                .feature-highlight,
                .tech-stack,
                .deployment-info {
                    page-break-inside: avoid;
                }
                
                @page {
                    margin: 2cm;
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>TechGPT Application</h1>
            <div class="subtitle">Comprehensive Technical Breakdown</div>
            <div class="date">Generated on ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</div>
        </div>
        
        ${htmlContent}
        
        <div class="footer">
            <p><em>This document was automatically generated from the TechGPT technical documentation.</em></p>
            <p class="title">TechGPT - AI-Powered Technical Support Platform</p>
        </div>
    </body>
    </html>
    `;
    
    console.log('Saving HTML file...');
    fs.writeFileSync('TechGPT_Technical_Breakdown.html', fullHtmlContent);
    
    // Get file size
    const stats = fs.statSync('TechGPT_Technical_Breakdown.html');
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    
    console.log(`HTML file generated successfully: TechGPT_Technical_Breakdown.html`);
    console.log(`File size: ${fileSizeInKB} KB`);
    console.log('');
    console.log('To convert to PDF:');
    console.log('1. Open TechGPT_Technical_Breakdown.html in your browser');
    console.log('2. Press Ctrl+P (or Cmd+P on Mac)');
    console.log('3. Select "Save as PDF" as the destination');
    console.log('4. Choose "More settings" and select "Print background graphics"');
    console.log('5. Click "Save"');
    
} catch (error) {
    console.error('Error generating HTML file:', error);
}