import BigNumber from 'bignumber.js';

export default class RationalNumber {
  private numerator: BigNumber;

  private denominator: BigNumber;

  constructor(numerator: BigNumber.Value, denominator: BigNumber.Value) {
    this.numerator = new BigNumber(numerator);
    this.denominator = new BigNumber(denominator);
  }

  static fromBigInteger(amount: BigNumber.Value) {
    console.log({ amount });

    const decimals = new BigNumber(10).pow(18);
    const rational = new RationalNumber(amount, decimals);
    return rational.toDecimalString();
  }

  static fromFungibleBigInteger(
    amountAsBigInteger: BigNumber.Value,
    numDecimals = 18,
  ) {
    console.log({
      amountAsBigInteger,
      numDecimals,
    });
    const decimals = new BigNumber(10).pow(numDecimals);
    const rational = new RationalNumber(amountAsBigInteger, decimals);
    return rational.toDecimalString();
  }

  static fromDynamicTokenAmount(
    tokenIdentifier: string,
    amountAsBigInteger: BigNumber.Value,
    numDecimals?: number | undefined,
  ) {
    const result =
      tokenIdentifier !== 'EGLD'
        ? RationalNumber.fromFungibleBigInteger(amountAsBigInteger, numDecimals)
        : RationalNumber.fromBigInteger(amountAsBigInteger);

    return result;
  }

  toDecimalString(): string {
    return this.numerator
      .dividedBy(this.denominator)
      .toFixed(this.denominator.decimalPlaces() ?? 18);
  }
}