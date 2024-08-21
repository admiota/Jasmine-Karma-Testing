import { ReduceTextPipe } from "./reduce-text.pipe";


describe('Reduce text Pipe', () => {
  let pipe: ReduceTextPipe;

  beforeEach(() => {
    pipe = new ReduceTextPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('use transform() properly', () => {
    const textToSend = 'este es mi texto';
    const limitChars = 2;
    const textResult = pipe.transform(textToSend, limitChars);
    expect(textResult.length).toBe(2);
  });
});
