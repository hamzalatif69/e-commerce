// Minimalist tech-education brand logo generator for NovaLearn
// Generates PNG icons at 32x32, 192x192, and 512x512

function drawIcon(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Dark background
  ctx.fillStyle = '#0B0F1A';
  ctx.fillRect(0, 0, size, size);

  // Accent gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#7C3AED');
  gradient.addColorStop(1, '#22D3EE');

  // Rounded square background
  const padding = size * 0.08;
  const cornerRadius = size * 0.18;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(padding, padding, size - padding * 2, size - padding * 2, cornerRadius);
  ctx.fill();

  // Logo symbol: stylized 'N' with gradient
  ctx.fillStyle = gradient;
  ctx.strokeStyle = gradient;
  ctx.lineWidth = size * 0.05;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const scale = size * 0.6;
  const offsetX = size * 0.5;
  const offsetY = size * 0.5;

  // Draw stylized N
  ctx.beginPath();
  ctx.moveTo(offsetX - scale * 0.35, offsetY - scale * 0.4);
  ctx.lineTo(offsetX - scale * 0.35, offsetY + scale * 0.4);
  ctx.lineTo(offsetX + scale * 0.35, offsetY - scale * 0.4);
  ctx.lineTo(offsetX + scale * 0.35, offsetY + scale * 0.4);
  ctx.stroke();

  // Add a small dot/circle to represent learning
  ctx.beginPath();
  ctx.arc(offsetX + scale * 0.15, offsetY - scale * 0.15, size * 0.04, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

function downloadIcon(size) {
  const canvas = drawIcon(size);
  canvas.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `icon-${size}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
}

// Generate all three sizes
[32, 192, 512].forEach(size => {
  downloadIcon(size);
});

console.log('NovaLearn icons generated: 32x32, 192x192, 512x512');
