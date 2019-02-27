export const GRID_SIZE = 8;

//TODO use symbols here?
export const ILLEGAL = -1;
export const EMPTY = 0;

const WHITE_FRONT_ROW = 1;
const WHITE_BACK_ROW = 0;
const WHITE_PAWN_DIRECTION = 1;
const WHITE_PAWN_PROMOTION_Y = 7;
const BLACK_FRONT_ROW = 6;
const BLACK_BACK_ROW = 7;
const BLACK_PAWN_DIRECTION = -1;
const BLACK_PAWN_PROMOTION_Y = 0;

export const WHITE = {
  name: "white",
  frontRow: WHITE_FRONT_ROW,
  backRow: WHITE_BACK_ROW,
  pawnDirection: WHITE_PAWN_DIRECTION,
  pawnPromotionY: WHITE_PAWN_PROMOTION_Y,
  evaluationModifier: 1
};

export const BLACK = {
  name: "black",
  frontRow: BLACK_FRONT_ROW,
  backRow: BLACK_BACK_ROW,
  pawnDirection: BLACK_PAWN_DIRECTION,
  pawnPromotionY: BLACK_PAWN_PROMOTION_Y,
  evaluationModifier: -1
};
