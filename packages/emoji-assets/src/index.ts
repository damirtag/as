import angry from '../assets/angry.svg';
import dislike from '../assets/dislike.svg';
import handshake from '../assets/handshake.svg';
import heart from '../assets/heart.svg';
import joy from '../assets/joy.svg';
import like from '../assets/like.svg';
import rofl from '../assets/rofl.svg';
import sad from '../assets/sad.svg';

export {
  angry,
  dislike,
  handshake,
  heart,
  joy,
  like,
  rofl,
  sad,
};

export const emojiAssets = {
  angry,
  dislike,
  handshake,
  heart,
  joy,
  like,
  rofl,
  sad,
} as const;

export type EmojiAssetName = keyof typeof emojiAssets;

export default emojiAssets;