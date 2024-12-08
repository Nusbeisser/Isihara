export interface Result {
  time: number;
  red: channelResult;
  green: channelResult;
  blue: channelResult;
}

interface channelResult {
  avg: number;
  max: number;
}
