import { ReactionType } from "@/shared/lib/api";

import {
  angry,
  handshake,
  rofl,
  joy,
  like,
  dislike,
  heart,
  sad,
} from "@as/emoji-assets";

const backgroundEmojiAssets = [angry, handshake, rofl, joy, like, dislike, heart, sad];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildShareCardMarkup({
  quote,
  user,
  topReactions,
  shareWidth,
  shareHeight,
}: {
  quote: {
    id: string;
    text: string;
    createdAt: string;
    reactionsSummary?: {
      totalCount: number;
      counts?: Array<{ type: ReactionType; count: number }>;
    };
    commentsSummary?: {
      totalCount: number;
    };
  };
  user?: {
    username: string;
  } | null;
  topReactions: Array<{ type: ReactionType; emojiPath: string; count: number }>;
  shareWidth: number;
  shareHeight: number;
}): string {
  const quoteText = quote.text?.trim() || "Shared quote";
  const estimatedLines = Math.max(1, Math.ceil(quoteText.length / 48));
  const cardWidth = quoteText.length > 150 ? 900 : 820;
  const cardHeight = Math.max(210, 105 + estimatedLines * 36 + (topReactions.length ? 28 : 0));
  const backgroundAsset = backgroundEmojiAssets[Math.floor(Math.random() * backgroundEmojiAssets.length)];
  const emojiNodes = Array.from({ length: 24 }, (_, index) => {
    const x = (index * 121) % (shareWidth + 180) - 90;
    const y = ((index * 97) % (shareHeight + 180)) - 90;
    const size = 22 + Math.random() * 46;
    const rotation = Math.random() * 40 - 20;
    const opacity = 0.18 + Math.random() * 0.32;

    return `<image href="${backgroundAsset}" x="${x}" y="${y}" width="${size}" height="${size}" transform="rotate(${rotation} ${x + size / 2} ${y + size / 2})" opacity="${opacity}" preserveAspectRatio="xMidYMid meet" />`;
  }).join("");

  return `
    <div style="position:relative;width:${shareWidth}px;height:${shareHeight}px;background:#020d1a;overflow:hidden;display:flex;align-items:center;justify-content:center;box-sizing:border-box;">
      <svg width="${shareWidth}" height="${shareHeight}" viewBox="0 0 ${shareWidth} ${shareHeight}" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;">
        <g>
          ${emojiNodes}
        </g>
      </svg>

      <div style="position:relative;width:${cardWidth}px;min-height:${cardHeight}px;background:#09090b;border:1px solid rgba(255,255,255,0.08);border-radius:22px;padding:22px 24px 6px;box-shadow:0 30px 90px rgba(0,0,0,0.5);">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#facc15,#f59e0b);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(250,204,21,0.2);">
              <span style="font-size:13px;line-height:1;color:#09090b;font-weight:900;display:inline-block;">${(user?.username ?? "U").slice(0,1).toUpperCase()}</span>
            </div>
            <div>
              <div style="font-size:16px;font-weight:700;color:#f4f4f5;line-height:1.2;">${escapeHtml(user?.username ?? "Unknown")}</div>
              <div style="margin-top:4px;font-size:10px;color:#a1a1aa;letter-spacing:0.12em;text-transform:uppercase;">${new Date(quote.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9px;background:rgba(255,255,255,0.03);color:#d4d4d8;font-size:20px;">⋯</div>
        </div>

        <div style="position:relative;margin-top:18px;padding-left:14px;">
          <div style="position:absolute;left:0;top:-8px;font-size:34px;line-height:1;color:#52525b;">“</div>
          <div style="font-size:24px;line-height:1.5;color:#e4e4e7;font-weight:400;letter-spacing:-0.02em;max-width:${cardWidth - 80}px;word-break:break-word;">${escapeHtml(quoteText)}</div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:18px;margin-top:18px;border-top:1px solid rgba(255,255,255,0.08);padding-bottom:0;">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;min-height:36px;">
            ${topReactions.length ? topReactions.map((reaction) => `
              <div style="display:inline-flex;align-items:center;gap:7px;padding:8px 12px;border-radius:999px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);">
                <img src="${reaction.emojiPath}" alt="" style="width:18px;height:18px;display:block;" />
                <span style="font-size:13px;font-weight:700;color:#f4f4f5;">${reaction.count}</span>
              </div>
            `).join("") : ""}
          </div>

          <div style="display:flex;align-items:center;gap:12px;">
            <div style="display:flex;align-items:center;gap:7px;color:#a1a1aa;font-size:13px;font-weight:700;">
              <span style="font-size:16px;line-height:1;">💬</span>
              <span>${quote.commentsSummary?.totalCount || 0}</span>
            </div>
            <div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:9px;background:rgba(255,255,255,0.04);color:#d4d4d8;font-size:15px;">↗</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
