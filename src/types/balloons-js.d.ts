declare module 'balloons-js' {
  export function balloons(): void;
  export function textBalloons(options: Array<{
    text: string;
    fontSize?: number;
    color?: string;
  }>): void;
}
