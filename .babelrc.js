module.exports = {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: { version: 3 },
        shippedProposals: true,
        bugfixes: true,
      },
    ],
  ],
}
