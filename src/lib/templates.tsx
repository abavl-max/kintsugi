import React from 'react';
import { User, Music } from 'lucide-react';
// Helper to draw rounded rectangles, as canvas API lacks a native one.
function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
const drawProfileCard = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const cardPadding = width * 0.1;
  const cardWidth = width - cardPadding * 2;
  const cardHeight = height * 0.6;
  const cardX = cardPadding;
  const cardY = (height - cardHeight) / 2;
  const borderRadius = 20;
  // Card background
  ctx.fillStyle = '#1E1E1E'; // Dark grey
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 2;
  drawRoundRect(ctx, cardX, cardY, cardWidth, cardHeight, borderRadius);
  ctx.fill();
  ctx.stroke();
  // Avatar
  const avatarRadius = cardWidth * 0.15;
  const avatarX = cardX + cardWidth / 2;
  const avatarY = cardY + cardHeight * 0.3;
  ctx.fillStyle = '#333333';
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
  ctx.fill();
  // Text
  ctx.fillStyle = '#F5F5F5';
  ctx.textAlign = 'center';
  ctx.font = `bold ${cardWidth * 0.08}px Inter, sans-serif`;
  ctx.fillText('Luna', avatarX, avatarY + avatarRadius + 30);
  ctx.font = `normal ${cardWidth * 0.05}px Inter, sans-serif`;
  ctx.fillStyle = '#888888';
  ctx.fillText('UI/UX Designer', avatarX, avatarY + avatarRadius + 60);
};
const drawMusicPlayer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cardPadding = width * 0.1;
    const cardWidth = width - cardPadding * 2;
    const cardHeight = height * 0.4;
    const cardX = cardPadding;
    const cardY = (height - cardHeight) / 2;
    const borderRadius = 20;
    // Card background
    ctx.fillStyle = '#1A1A1A';
    ctx.strokeStyle = '#2A2A2A';
    ctx.lineWidth = 2;
    drawRoundRect(ctx, cardX, cardY, cardWidth, cardHeight, borderRadius);
    ctx.fill();
    ctx.stroke();
    // Album art placeholder
    const artSize = cardHeight * 0.4;
    const artX = cardX + cardPadding / 2;
    const artY = cardY + cardPadding / 2;
    ctx.fillStyle = '#00FFFF'; // Cyan accent
    drawRoundRect(ctx, artX, artY, artSize, artSize, 8);
    ctx.fill();
    // Text
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.font = `bold ${cardWidth * 0.06}px Inter, sans-serif`;
    ctx.fillText('Glitch in the Matrix', artX + artSize + 20, artY + artSize / 2 - 5);
    ctx.font = `normal ${cardWidth * 0.04}px Inter, sans-serif`;
    ctx.fillStyle = '#AAAAAA';
    ctx.fillText('Synthwave Dreams', artX + artSize + 20, artY + artSize / 2 + 20);
    // Progress bar
    const progressY = cardY + cardHeight - 60;
    ctx.fillStyle = '#444444';
    drawRoundRect(ctx, artX, progressY, cardWidth - cardPadding, 6, 3);
    ctx.fill();
    ctx.fillStyle = '#00FFFF';
    drawRoundRect(ctx, artX, progressY, (cardWidth - cardPadding) * 0.7, 6, 3);
    ctx.fill();
};
export const templates = {
  'profile-card': {
    name: 'Profile Card',
    draw: drawProfileCard,
    preview: <User className="w-8 h-8 text-muted-foreground" />,
  },
  'music-player': {
    name: 'Music Player',
    draw: drawMusicPlayer,
    preview: <Music className="w-8 h-8 text-muted-foreground" />,
  },
};
export type TemplateId = keyof typeof templates;