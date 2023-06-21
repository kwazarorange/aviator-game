/**
 * is_active_bet - whether bet was made. redundant because we will not post empty bets
 * bet - amount of money put into bet
 * coefficient - winning coefficient
 * winning_amount - amount won
 */
export type Bet = {
  id: string;
  user_id: string;
  time: Date;
  is_active_bet: boolean;
  bet: number;
  coefficient: number;
  winning_amount: number;
};
