// platform-limits/src/validate.ts
// Lightweight TypeScript validator for social platform limits.
// Usage: import { validatePost } from '../platform-limits/dist/validate' (or import source and build locally)

import limitsJson from '../limits.json';

export type Media = {
  size_mb?: number;
  format?: string;
  duration_sec?: number;
};

export type Post = {
  text?: string;
  images?: Media[];
  videos?: Media[];
};

type PlatformLimits = {
  [k: string]: any;
};

const limits: PlatformLimits = (limitsJson as any).platforms || {};

function countHashtags(text = ''): number {
  // Basic hashtag detection: words starting with #
  return (text.match(/(^|\s)#[\p{L}\p{N}_]+/gu) || []).length;
}

function countMentions(text = ''): number {
  // Basic mention detection: words starting with @
  return (text.match(/(^|\s)@[\p{L}\p{N}_.-]+/gu) || []).length;
}

export function validatePost(platformKey: string, post: Post) {
  const platform = limits[platformKey];
  if (!platform) throw new Error(`Unknown platform: ${platformKey}`);

  const violations: string[] = [];
  const text = post.text || '';

  if (typeof platform.max_text_chars === 'number' && text.length > platform.max_text_chars) {
    violations.push(`text length ${text.length} > max ${platform.max_text_chars}`);
  }

  const hashtags = countHashtags(text);
  if (typeof platform.max_hashtags === 'number' && hashtags > platform.max_hashtags) {
    violations.push(`hashtags ${hashtags} > max ${platform.max_hashtags}`);
  }

  const mentions = countMentions(text);
  if (typeof platform.max_mentions === 'number' && mentions > platform.max_mentions) {
    violations.push(`mentions ${mentions} > max ${platform.max_mentions}`);
  }

  const images = post.images || [];
  const videos = post.videos || [];

  if (typeof platform.max_images === 'number' && images.length > platform.max_images) {
    violations.push(`images count ${images.length} > max ${platform.max_images}`);
  }

  if (typeof platform.max_videos === 'number' && videos.length > platform.max_videos) {
    violations.push(`videos count ${videos.length} > max ${platform.max_videos}`);
  }

  images.forEach((img, i) => {
    if (typeof platform.max_image_size_mb === 'number' && typeof img.size_mb === 'number' && img.size_mb > platform.max_image_size_mb) {
      violations.push(`image[${i}] size ${img.size_mb}MB > max ${platform.max_image_size_mb}MB`);
    }
    if (img.format && platform.allowed_image_formats && !platform.allowed_image_formats.includes(img.format.toLowerCase())) {
      violations.push(`image[${i}] format ${img.format} not allowed`);
    }
  });

  videos.forEach((vid, i) => {
    if (typeof platform.max_video_size_mb === 'number' && typeof vid.size_mb === 'number' && vid.size_mb > platform.max_video_size_mb) {
      violations.push(`video[${i}] size ${vid.size_mb}MB > max ${platform.max_video_size_mb}MB`);
    }
    if (typeof platform.max_video_duration_sec === 'number' && typeof vid.duration_sec === 'number' && vid.duration_sec > platform.max_video_duration_sec) {
      violations.push(`video[${i}] duration ${vid.duration_sec}s > max ${platform.max_video_duration_sec}s`);
    }
    if (vid.format && platform.allowed_video_formats && !platform.allowed_video_formats.includes(vid.format.toLowerCase())) {
      violations.push(`video[${i}] format ${vid.format} not allowed`);
    }
  });

  return {
    valid: violations.length === 0,
    violations
  };
}

export default validatePost;