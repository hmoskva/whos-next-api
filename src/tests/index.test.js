describe('env', () => {
  test('Environment should be TEST', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

});

