export class PriceHelper {
  static formatPrice(price: number): string {
    const currency = 'zł'
    const string = price.toFixed(2).toString().replace('.', ',') + ` ${currency}`
    return string
  }
}
