import { expect } from 'chai';

import { Listener } from '../../../packages/core/types';

describe('Listener', () => {
  let listener: Listener;

  beforeEach(() => {
    listener = new Listener();
  });

  it('should check initial #closed', () => {
    expect(listener.closed).equals(false);
  });

  it('should perform #close() and check #closed', () => {
    listener.close();

    expect(listener.closed).equals(true);
  });

  it('should test #closes.then() logic', () => {
    listener.closes.then(() => {
      expect(listener.closed).equals(true);
    });

    expect(listener.closed).equals(false);
    listener.close();
  });
});
