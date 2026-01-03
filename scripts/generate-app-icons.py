#!/usr/bin/env python3
"""
Generate PWA app icons matching the design:
- White rounded square container
- Blue gradient credit card with EMV chip
- Green checkmark circle
- Sparkles
"""

from PIL import Image, ImageDraw, ImageFont
import os
import math

def draw_rounded_rectangle(draw, bbox, radius, fill=None, outline=None, width=1):
    """Draw a rounded rectangle"""
    x1, y1, x2, y2 = bbox
    # Draw main rectangle
    draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill, outline=outline, width=width)
    draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill, outline=outline, width=width)
    # Draw corners
    draw.pieslice([x1, y1, x1 + 2*radius, y1 + 2*radius], 180, 270, fill=fill, outline=outline, width=width)
    draw.pieslice([x2 - 2*radius, y1, x2, y1 + 2*radius], 270, 360, fill=fill, outline=outline, width=width)
    draw.pieslice([x1, y2 - 2*radius, x1 + 2*radius, y2], 90, 180, fill=fill, outline=outline, width=width)
    draw.pieslice([x2 - 2*radius, y2 - 2*radius, x2, y2], 0, 90, fill=fill, outline=outline, width=width)

def create_gradient_blue(size):
    """Create a blue gradient"""
    img = Image.new('RGB', size, (100, 150, 255))  # Light blue
    pixels = img.load()
    width, height = size
    for y in range(height):
        for x in range(width):
            # Gradient from light blue (top-left) to dark blue (bottom-right)
            r = int(100 + (50 - 100) * (x + y) / (width + height))
            g = int(150 + (100 - 150) * (x + y) / (width + height))
            b = int(255 + (200 - 255) * (x + y) / (width + height))
            pixels[x, y] = (max(0, min(255, r)), max(0, min(255, g)), max(0, min(255, b)))
    return img

def draw_sparkle(draw, center, size, color=(255, 255, 255)):
    """Draw a 4-pointed sparkle/star"""
    x, y = center
    points = []
    for i in range(8):
        angle = i * math.pi / 4
        if i % 2 == 0:
            r = size  # Outer points
        else:
            r = size * 0.4  # Inner points
        px = x + r * math.cos(angle)
        py = y + r * math.sin(angle)
        points.append((px, py))
    draw.polygon(points, fill=color)

def create_app_icon(size):
    """Create the app icon matching the design"""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate dimensions
    margin = int(size * 0.08)  # 8% margin
    container_size = size - 2 * margin
    radius = int(size * 0.15)  # Rounded corners
    
    # 1. Draw white container with shadow/glow effect
    container_bbox = [margin, margin, size - margin, size - margin]
    
    # Shadow/glow effect (light blue)
    shadow_offset = int(size * 0.02)
    shadow_bbox = [
        container_bbox[0] + shadow_offset,
        container_bbox[1] + shadow_offset,
        container_bbox[2] + shadow_offset,
        container_bbox[3] + shadow_offset
    ]
    draw_rounded_rectangle(draw, shadow_bbox, radius, fill=(230, 240, 255, 180))
    
    # White container
    draw_rounded_rectangle(draw, container_bbox, radius, fill=(255, 255, 255, 255))
    
    # 2. Draw blue credit card (tilted)
    card_width = int(container_size * 0.75)
    card_height = int(card_width * 0.63)  # Standard card ratio
    card_x = margin + int((container_size - card_width) * 0.5)
    card_y = margin + int((container_size - card_height) * 0.4)
    
    # Create rotated card
    card_img = Image.new('RGBA', (card_width, card_height), (0, 0, 0, 0))
    card_draw = ImageDraw.Draw(card_img)
    
    # Blue gradient background
    gradient = create_gradient_blue((card_width, card_height))
    card_img.paste(gradient, (0, 0))
    
    # EMV chip (yellow-gold, top-left)
    chip_size = int(card_width * 0.12)
    chip_x = int(card_width * 0.08)
    chip_y = int(card_height * 0.12)
    chip_rect = [chip_x, chip_y, chip_x + chip_size, chip_y + chip_size * 0.7]
    card_draw.rounded_rectangle(chip_rect, radius=int(chip_size * 0.1), fill=(255, 215, 0))
    # Chip details
    card_draw.rectangle([chip_x + chip_size*0.15, chip_y + chip_size*0.2, 
                         chip_x + chip_size*0.85, chip_y + chip_size*0.5], 
                        fill=(200, 150, 0))
    
    # Magnetic stripe (top of card)
    stripe_y = int(card_height * 0.05)
    stripe_height = int(card_height * 0.08)
    card_draw.rectangle([0, stripe_y, card_width, stripe_y + stripe_height], fill=(30, 30, 50))
    
    # Card number dashes (white)
    dash_width = int(card_width * 0.15)
    dash_height = int(card_height * 0.03)
    dash_y = chip_y + chip_size + int(card_height * 0.08)
    for i in range(2):
        dash_x = chip_x + i * (dash_width + int(card_width * 0.05))
        card_draw.rectangle([dash_x, dash_y, dash_x + dash_width, dash_y + dash_height], fill=(255, 255, 255, 200))
    
    # Glossy reflection on card
    reflection = Image.new('RGBA', (card_width, card_height), (0, 0, 0, 0))
    ref_draw = ImageDraw.Draw(reflection)
    ref_draw.ellipse([0, 0, card_width * 0.6, card_height * 0.6], fill=(255, 255, 255, 60))
    card_img = Image.alpha_composite(card_img, reflection)
    
    # Rotate card slightly
    card_img = card_img.rotate(-8, expand=False, fillcolor=(0, 0, 0, 0))
    
    # Paste card onto main image
    img.paste(card_img, (card_x, card_y), card_img)
    
    # 3. Draw green checkmark circle (bottom-right of card)
    check_size = int(size * 0.18)
    check_x = card_x + int(card_width * 0.75)
    check_y = card_y + int(card_height * 0.7)
    
    # Green circle with gradient effect
    check_circle = Image.new('RGBA', (check_size, check_size), (0, 0, 0, 0))
    check_draw = ImageDraw.Draw(check_circle)
    check_draw.ellipse([0, 0, check_size, check_size], fill=(76, 175, 80))  # Green
    # Highlight
    check_draw.ellipse([check_size*0.15, check_size*0.15, check_size*0.6, check_size*0.6], fill=(129, 199, 132))
    
    # White checkmark
    checkmark_size = int(check_size * 0.5)
    checkmark_thickness = max(3, int(check_size * 0.08))
    center_x, center_y = check_size // 2, check_size // 2
    # Draw checkmark
    points = [
        (center_x - checkmark_size*0.3, center_y),
        (center_x - checkmark_size*0.1, center_y + checkmark_size*0.25),
        (center_x + checkmark_size*0.3, center_y - checkmark_size*0.15),
    ]
    check_draw.line([points[0], points[1]], fill=(255, 255, 255), width=checkmark_thickness)
    check_draw.line([points[1], points[2]], fill=(255, 255, 255), width=checkmark_thickness)
    
    # Paste checkmark circle
    img.paste(check_circle, (check_x, check_y), check_circle)
    
    # 4. Draw sparkles
    sparkle_size = max(4, int(size * 0.04))
    sparkles = [
        (margin + int(container_size * 0.2), margin + int(container_size * 0.15)),  # Top-left
        (margin + int(container_size * 0.85), margin + int(container_size * 0.2)),  # Top-right
        (margin + int(container_size * 0.15), margin + int(container_size * 0.85)),  # Bottom-left
    ]
    for sparkle_pos in sparkles:
        draw_sparkle(draw, sparkle_pos, sparkle_size, (255, 255, 255, 200))
    
    return img

def main():
    """Generate all required icon sizes"""
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    icons_dir = os.path.join(os.path.dirname(__file__), '../public/icons')
    
    # Ensure directory exists
    os.makedirs(icons_dir, exist_ok=True)
    
    print("🎨 Generating app icons with credit card design...")
    print("")
    
    for size in sizes:
        print(f"Creating icon-{size}x{size}.png...")
        icon = create_app_icon(size)
        filename = os.path.join(icons_dir, f'icon-{size}x{size}.png')
        icon.save(filename, 'PNG', optimize=True)
        print(f"  ✅ Saved {filename}")
    
    print("")
    print("✨ All icons generated successfully!")
    print("📱 Icons feature:")
    print("   - White rounded square container")
    print("   - Blue gradient credit card with EMV chip")
    print("   - Green checkmark circle")
    print("   - Sparkle effects")

if __name__ == '__main__':
    main()

