export const GAME_IDS = ['1', '2'] as const
export type GameId = (typeof GAME_IDS)[number]

export function otherGameId(id: string): GameId {
  return id === '1' ? '2' : '1'
}
