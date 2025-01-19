declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.ttf' {
    const value: string;
    export default value;
  }