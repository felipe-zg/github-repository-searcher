export class UnexpectedError extends Error {
  constructor() {
    super('予期しないエラーが発生しました。しばらくしてからもう一度お試しください。')
    this.name = 'UnexpectedError'
  }
}