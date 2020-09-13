# @activescott/diag

[![npm version](https://badge.fury.io/js/%40activescott%2Fdiag-winston.svg)](https://www.npmjs.com/package/@activescott/diag)
[![Build Status](https://github.com/activescott/diag-winston/workflows/main/badge.svg)](https://github.com/activescott/diag/actions)

Yet another logging package. The only thing this package really is doing is defining a consistent API for diagnostic logging.

## Usage

This package implements the interface defined in the [activescott/diag package](https://github.com/activescott/diag).

Recommended way to use is to put a single file in your project like `services.ts` and export `createLogger` from there:

    export { createLogger } from "@activescott/diag-winston"

This way you can import a single createLogger function throughout your project and easily replace it later with a different implementation if you so choose.

## Local Testing

You can also test your shareable config on your computer before publishing by linking your module globally. Type:

    npm run -s test

Then, in your project that wants to use your shareable config, type:

    yarn link @activescott/diag-winston
