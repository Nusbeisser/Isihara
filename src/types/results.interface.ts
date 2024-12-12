// export interface TestData {
//   results: Result[];
//   date: string;
// }

export interface Result {
  time: number;
  red: channelResult;
  green: channelResult;
  blue: channelResult;
  spacePressed: boolean;
}

interface channelResult {
  avg: number;
  max: number;
}
