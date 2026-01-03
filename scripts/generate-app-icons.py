#!/usr/bin/env python3
"""
Generate PWA app icons matching the premium design:
- Icy white rounded-square tile with soft shadow
- Glossy blue credit card tilted slightly left
- Gold EMV chip and minimal white dashes
- Bold green circular badge with white checkmark (lower-right)
- Small white/blue sparkles
- Soft 3D depth, smooth gradients, top-left lighting
- Clean iOS-quality, high clarity
"""

from PIL import Image, ImageDraw, ImageFilter
import os
import math

def create_smooth_gradient(size, start_color, end_color, direction='diagonal'):
    """Create a smooth gradient"""
    width, height = size
    img = Image.new('RGB', size)
    pixels = img.load()
    
    for y in range(height):
        for x in range(width):
            if direction == 'diagonal':
                # Diagonal gradient from top-left to bottom-right
                t = (x + y) / (width + height)
            elif direction == 'vertical':
                t = y / height
            else:  # horizontal
                t = x / width
            
            r = int(start_color[0] + (end_color[0] - start_color[0]) * t)
            g = int(start_color[1] + (end_color[1] - start_color[1]) * t)
            b = int(start_color[2] + (end_color[2] - start_color[2]) * t)
            pixels[x, y] = (max(0, min(255, r)), max(0, min(255, g)), max(0, min(255, b)))
    
    return img

def draw_rounded_rectangle_advanced(draw, bbox, radius, fill=None, outline=None):
    """Draw a rounded rectangle with better anti-aliasing"""
    x1, y1, x2, y2 = bbox
    
    # Main rectangles
    draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill, outline=outline)
    draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill, outline=outline)
    
    # Rounded corners
    draw.pieslice([x1, y1, x1 + 2*radius, y1 + 2*radius], 180, 270, fill=fill, outline=outline)
    draw.pieslice([x2 - 2*radius, y1, x2, y1 + 2*radius], 270, 360, fill=fill, outline=outline)
    draw.pieslice([x1, y2 - 2*radius, x1 + 2*radius, y2], 90, 180, fill=fill, outline=outline)
    draw.pieslice([x2 - 2*radius, y2 - 2*radius, x2, y2], 0, 90, fill=fill, outline=outline)

def draw_sparkle(draw, center, size, color=(255, 255, 255), alpha=200):
    """Draw a 4-pointed sparkle with blue tint"""
    x, y = center
    points = []
    for i in range(8):
        angle = i * math.pi / 4
        if i % 2 == 0:
            r = size  # Outer points
        else:
            r = size * 0.35  # Inner points
        px = x + r * math.cos(angle)
        py = y + r * math.sin(angle)
        points.append((px, py))
    
    # Create sparkle with transparency
    sparkle_img = Image.new('RGBA', (int(size * 3), int(size * 3)), (0, 0, 0, 0))
    sparkle_draw = ImageDraw.Draw(sparkle_img)
    center_sparkle = (int(size * 1.5), int(size * 1.5))
    sparkle_points = []
    for i in range(8):
        angle = i * math.pi / 4
        if i % 2 == 0:
            r = size
        else:
            r = size * 0.35
        px = center_sparkle[0] + r * math.cos(angle)
        py = center_sparkle[1] + r * math.sin(angle)
        sparkle_points.append((px, py))
    sparkle_draw.polygon(sparkle_points, fill=(color[0], color[1], min(255, color[2] + 50), alpha))
    
    return sparkle_img, (int(x - size * 1.5), int(y - size * 1.5))

def create_app_icon(size):
    """Create the premium app icon"""
    # Create high-resolution image for better quality
    scale = 2  # Render at 2x for better quality
    img_size = size * scale
    img = Image.new('RGBA', (img_size, img_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate dimensions (scaled)
    margin = int(img_size * 0.08)
    container_size = img_size - 2 * margin
    radius = int(img_size * 0.15)
    
    # 1. Icy white container with soft shadow
    container_bbox = [margin, margin, img_size - margin, img_size - margin]
    
    # Soft shadow (light blue-gray, offset down-right)
    shadow_offset = int(img_size * 0.015)
    shadow_blur = int(img_size * 0.02)
    shadow_bbox = [
        container_bbox[0] + shadow_offset,
        container_bbox[1] + shadow_offset,
        container_bbox[2] + shadow_offset,
        container_bbox[3] + shadow_offset
    ]
    
    # Create shadow layer
    shadow_img = Image.new('RGBA', (img_size, img_size), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_img)
    draw_rounded_rectangle_advanced(shadow_draw, shadow_bbox, radius, fill=(220, 230, 245, 120))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(radius=shadow_blur))
    img = Image.alpha_composite(img, shadow_img)
    
    # Icy white container (slightly blue-tinted white)
    draw_rounded_rectangle_advanced(draw, container_bbox, radius, fill=(250, 252, 255))
    
    # Subtle inner highlight (top-left lighting)
    highlight_margin = int(img_size * 0.02)
    highlight_bbox = [
        container_bbox[0] + highlight_margin,
        container_bbox[1] + highlight_margin,
        container_bbox[2] - highlight_margin,
        container_bbox[3] - highlight_margin
    ]
    highlight_img = Image.new('RGBA', (img_size, img_size), (0, 0, 0, 0))
    highlight_draw = ImageDraw.Draw(highlight_img)
    draw_rounded_rectangle_advanced(highlight_draw, highlight_bbox, radius - highlight_margin, fill=(255, 255, 255, 30))
    img = Image.alpha_composite(img, highlight_img)
    
    # 2. Glossy blue credit card (tilted slightly LEFT, not right)
    card_width = int(container_size * 0.72)
    card_height = int(card_width * 0.63)
    card_x = margin + int((container_size - card_width) * 0.5)
    card_y = margin + int((container_size - card_height) * 0.38)
    
    # Create card with smooth blue gradient
    card_img = Image.new('RGBA', (card_width, card_height), (0, 0, 0, 0))
    
    # Smooth blue gradient (light blue to deep blue)
    blue_gradient = create_smooth_gradient(
        (card_width, card_height),
        (100, 150, 255),  # Light blue (top-left)
        (30, 80, 180)     # Deep blue (bottom-right)
    )
    card_img.paste(blue_gradient, (0, 0))
    
    card_draw = ImageDraw.Draw(card_img)
    
    # EMV chip (gold/yellow, top-left)
    chip_size = int(card_width * 0.13)
    chip_x = int(card_width * 0.08)
    chip_y = int(card_height * 0.12)
    chip_rect = [chip_x, chip_y, chip_x + chip_size, chip_y + int(chip_size * 0.7)]
    card_draw.rounded_rectangle(chip_rect, radius=int(chip_size * 0.12), fill=(255, 215, 0))
    # Chip inner details (darker gold)
    card_draw.rectangle([
        chip_x + int(chip_size * 0.15),
        chip_y + int(chip_size * 0.2),
        chip_x + int(chip_size * 0.85),
        chip_y + int(chip_size * 0.5)
    ], fill=(220, 170, 0))
    # Chip highlight (top-left lighting)
    card_draw.ellipse([
        chip_x + int(chip_size * 0.1),
        chip_y + int(chip_size * 0.15),
        chip_x + int(chip_size * 0.5),
        chip_y + int(chip_size * 0.4)
    ], fill=(255, 240, 180, 150))
    
    # Magnetic stripe (dark, top of card)
    stripe_y = int(card_height * 0.04)
    stripe_height = int(card_height * 0.09)
    card_draw.rectangle([0, stripe_y, card_width, stripe_y + stripe_height], fill=(20, 20, 40))
    
    # Minimal white dashes (card numbers)
    dash_width = int(card_width * 0.14)
    dash_height = int(card_height * 0.025)
    dash_y = chip_y + chip_size + int(card_height * 0.1)
    for i in range(2):
        dash_x = chip_x + i * (dash_width + int(card_width * 0.06))
        card_draw.rounded_rectangle(
            [dash_x, dash_y, dash_x + dash_width, dash_y + dash_height],
            radius=int(dash_height * 0.5),
            fill=(255, 255, 255, 220)
        )
    
    # Glossy reflection (top-left lighting effect)
    reflection = Image.new('RGBA', (card_width, card_height), (0, 0, 0, 0))
    ref_draw = ImageDraw.Draw(reflection)
    # Large soft highlight
    ref_draw.ellipse([
        0, 0,
        int(card_width * 0.65),
        int(card_height * 0.65)
    ], fill=(255, 255, 255, 50))
    # Sharp reflection line
    ref_draw.ellipse([
        int(card_width * 0.1),
        int(card_height * 0.1),
        int(card_width * 0.4),
        int(card_height * 0.3)
    ], fill=(255, 255, 255, 80))
    card_img = Image.alpha_composite(card_img, reflection)
    
    # Rotate card slightly LEFT (negative angle)
    card_img = card_img.rotate(6, expand=False, fillcolor=(0, 0, 0, 0), resample=Image.BICUBIC)
    
    # Paste card onto main image
    img.paste(card_img, (card_x, card_y), card_img)
    
    # 3. Bold green circular badge with white checkmark (lower-right, overlapping)
    check_size = int(img_size * 0.2)
    check_x = card_x + int(card_width * 0.72)
    check_y = card_y + int(card_height * 0.68)
    
    # Create green badge with gradient
    check_circle = Image.new('RGBA', (check_size, check_size), (0, 0, 0, 0))
    check_draw = ImageDraw.Draw(check_circle)
    
    # Green gradient circle
    green_gradient = create_smooth_gradient(
        (check_size, check_size),
        (76, 175, 80),   # Bright green
        (56, 142, 60)    # Darker green
    )
    
    # Create circular mask
    mask = Image.new('L', (check_size, check_size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([0, 0, check_size, check_size], fill=255)
    
    # Apply gradient to circle
    green_circle = Image.new('RGBA', (check_size, check_size), (0, 0, 0, 0))
    green_circle.paste(green_gradient, (0, 0))
    green_circle.putalpha(mask)
    
    # Add highlight (top-left lighting)
    highlight_circle = Image.new('RGBA', (check_size, check_size), (0, 0, 0, 0))
    highlight_circle_draw = ImageDraw.Draw(highlight_circle)
    highlight_circle_draw.ellipse([
        int(check_size * 0.15),
        int(check_size * 0.15),
        int(check_size * 0.65),
        int(check_size * 0.65)
    ], fill=(129, 199, 132, 180))
    green_circle = Image.alpha_composite(green_circle, highlight_circle)
    
    # Bold white checkmark
    checkmark_size = int(check_size * 0.52)
    checkmark_thickness = max(4, int(check_size * 0.1))
    center_x, center_y = check_size // 2, check_size // 2
    
    # Draw bold checkmark
    check_draw.line([
        (center_x - checkmark_size * 0.25, center_y),
        (center_x - checkmark_size * 0.05, center_y + checkmark_size * 0.22),
        (center_x + checkmark_size * 0.3, center_y - checkmark_size * 0.12)
    ], fill=(255, 255, 255), width=checkmark_thickness, joint='curve')
    
    # Combine circle and checkmark
    check_circle = Image.alpha_composite(green_circle, check_circle)
    
    # Add subtle shadow to badge
    badge_shadow = Image.new('RGBA', (check_size, check_size), (0, 0, 0, 0))
    badge_shadow_draw = ImageDraw.Draw(badge_shadow)
    badge_shadow_draw.ellipse([
        int(check_size * 0.05),
        int(check_size * 0.05),
        check_size - int(check_size * 0.05),
        check_size - int(check_size * 0.05)
    ], fill=(0, 0, 0, 60))
    badge_shadow = badge_shadow.filter(ImageFilter.GaussianBlur(radius=int(check_size * 0.05)))
    
    # Paste shadow first, then badge
    shadow_pos = (check_x + int(check_size * 0.03), check_y + int(check_size * 0.03))
    img.paste(badge_shadow, shadow_pos, badge_shadow)
    img.paste(check_circle, (check_x, check_y), check_circle)
    
    # 4. Small white/blue sparkles (top-left lighting)
    sparkle_size = max(6, int(img_size * 0.035))
    sparkles = [
        (margin + int(container_size * 0.18), margin + int(container_size * 0.12)),  # Top-left
        (margin + int(container_size * 0.82), margin + int(container_size * 0.18)),  # Top-right
        (margin + int(container_size * 0.12), margin + int(container_size * 0.82)),  # Bottom-left
    ]
    
    for sparkle_pos in sparkles:
        sparkle_img, sparkle_offset = draw_sparkle(draw, sparkle_pos, sparkle_size, (255, 255, 255), alpha=180)
        img.paste(sparkle_img, sparkle_offset, sparkle_img)
    
    # Resize down to target size with high-quality resampling
    img = img.resize((size, size), Image.LANCZOS)
    
    return img

def main():
    """Generate all required icon sizes"""
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    icons_dir = os.path.join(os.path.dirname(__file__), '../public/icons')
    
    os.makedirs(icons_dir, exist_ok=True)
    
    print("🎨 Generating premium app icons...")
    print("   Design: Icy white tile, glossy blue card, bold green badge")
    print("")
    
    for size in sizes:
        print(f"Creating icon-{size}x{size}.png...", end=' ')
        icon = create_app_icon(size)
        filename = os.path.join(icons_dir, f'icon-{size}x{size}.png')
        icon.save(filename, 'PNG', optimize=True)
        print(f"✅")
    
    print("")
    print("✨ All premium icons generated successfully!")
    print("📱 Features:")
    print("   - Icy white rounded-square tile with soft shadow")
    print("   - Glossy blue credit card (tilted left) with gold chip")
    print("   - Bold green circular badge with white checkmark")
    print("   - White/blue sparkles")
    print("   - Soft 3D depth, smooth gradients, top-left lighting")
    print("   - Clean iOS-quality rendering")

if __name__ == '__main__':
    main()
