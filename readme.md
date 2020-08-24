# Fiorite

Fiorite is a development framework for building web applications using TypeScript/JavaScript.

- ⚠️ Status: **In development**

## Requirements

- ES2019
- TypeScript 2.8

## TODO

- [x] Finalize injection proto: scopes, clarify terms (service/provider/injector etc)
- [x] Add response to HttpContext, add RequestCallback instead of linear result.
- [x] Investigate websockets implementation (socket.io, ws)
- [x] Fill out response header enum, add facade accessor for known headers.
- [ ] Implement Url interface.
- [ ] Consider whether it's a good idea to provide adapters for express/restify etc.
- [ ] Implement router as a middleware. Make it configurable (reuse other).
- [ ] Think about angular ssr solution.
- [ ] Inspect improvements (make collection readable).
 
 
- [ ] Add reflect manager to store reflected metadata.
- [ ] Implement `@singletone`, `@scoped`, `@transient`, `@inject`, `@injectAll` decorators.
- [ ] Add tests for `di` component.  
