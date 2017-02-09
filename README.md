# provably-fair

Tools for creating and verifying provably fair games.

[![Build Status](https://img.shields.io/travis/kripod/provably-fair/master.svg)](https://travis-ci.org/kripod/provably-fair)
[![Test Coverage](https://img.shields.io/codecov/c/github/kripod/provably-fair/master.svg)](https://codecov.io/gh/kripod/provably-fair)

## Getting started

This project is managed as a monorepo under the [provably-fair npm scope][], with each of the packages versioned independently.
Generic purpose functionality can be achieved by using the [core package][].

[provably-fair npm scope]: https://npmjs.com/~provably-fair
[core package]: packages/core

## Packages

### Generic

Generic packages can be adopted as is, or used as a base for special use cases.

- [`core`](packages/core)

### Specialized

Specialized packages are strongly opinionated implementations of their generic counterparts, providing frictionless integration for vendors.

- [`primedice`](packages/primedice)
