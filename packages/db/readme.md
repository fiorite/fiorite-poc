# Database

Package provides core interfaces to interact with database through adapter that behave as async collection.   

In case `DbCollection<E>` extends `AsyncCollection<E>`, it's possible to iterate a whole table/collection using `for await...of` statement and filter sequence as well. 

```typescript
const process = async <E>(collection: DbCollection<E>) => {
    for await (const element of collection) {
        element; // process particular element.
    } 
}
```
