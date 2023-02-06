import { ReversePipe } from "./reverse.pipe"


describe('ReversePipe', () => {
  it('pipe should reverse the string', () => {
    let reversePipe = new ReversePipe();

    expect(reversePipe.transform('hello')).toEqual('olleh')
  })
})
