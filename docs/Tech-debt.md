# Technical Debt

**Axios library**. Currently forced to be 1.1.3 instead of >=1.2.0 because of `error TS2304: Cannot find name 'ProgressEvent'`. Waiting for a fix from Axios.

**Rules for extra scripts**. Setup Eslint rules for script directory (less strict than TS)
  https://eslint.org/docs/latest/use/configure/configuration-files .
  Is it needed? Maybe it is better to not do: faster scripting, less time on fixing the syntax. 