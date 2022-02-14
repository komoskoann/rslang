export interface IStatistics {
  learnedWords: number,
  optional: {
    gameStatistics: {
      sprint: IGameStatistics,
      audioChallenge: IGameStatistics,
    }
  }
}

export interface IGameStatistics {
  newWords: number,
  learnedWords: number,
  correctAnswers: number,
  wrongAnswers: number,
  longestSeries: number,
}
