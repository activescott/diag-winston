// Extend the NodeJS namespace process.browser
declare namespace NodeJS {
  export interface Process {
    readonly browser?: boolean
  }
}
