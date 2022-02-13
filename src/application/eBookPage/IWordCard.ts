export interface IWordCard {
  readonly id: string;
  audio: string;
  audioExample: string;
  audioMeaning: string;
  group: number;
  image: string;
  page: number;
  textExample: string;
  userWord?: { difficulty: string, optional?: { isDifficult: boolean, word: string } }
  textExampleTranslate: string;
  textMeaning: string;
  textMeaningTranslate: string;
  transcription: string;
  word: string;
  wordTranslate: string;
  _id?: string;
}


  //let uimodel = {... apimodel, id: apimodel._id}

export interface IAggregatedWords {
  [x: string]: any;
  id: string;
  audio: string;
  audioExample: string;
  audioMeaning: string;
  group: number;
  image: string;
  page: number;
  textExample: string;
  textExampleTranslate: string;
  textMeaning: string;
  textMeaningTranslate: string;
  transcription: string;
  word: string;
  wordTranslate: string;
  wordId : string,
  difficulty : string,
  optional : {},
  fromJSON() : void;
}
