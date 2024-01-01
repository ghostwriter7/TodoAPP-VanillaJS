# Firestore

***

## References

***

1. `doc('users/Hubert')`
2. `collection('users')`

## Mutations

***

1. `setDoc(docRef, payload)` - destructive, overwrites an existing document
2. `updateDoc(docRef, payload)` - updates the doc, the doc must exist
3. `setDoc(docRef, payload, { merge: true })` - works like `updateDoc` but handles cases where the doc does not exist
4. `deleteDoc(docRef)`
5. `addDoc(collectionRef, payload)`

## Handling Dates

***

1. `serverTimestamp()` - placeholder, server will replace it with the real date

## Incrementing values

***

1. `increment(10)`
2. `decrement(20)` - to avoid race conditions with real time systems

## Getting real time updates

***

1. `onSnapshot(doc, (snapshot) => {...})` - no need to await mutations, firebase will notify through the callback
2. `snapshot.docChanges` - array of changes, adding / removing / modifying 

## Emulators

***

1. `npx firebase init emulators`
2. `npx firebase emulators:start`
3. `connectAuthEmulator(auth, url, { disableWarnings: true })`
4. `connectFirestoreEmulator(firestore, host, port)`

## Queries

***

### Simple queries - on a single field

1. `query(collection, where, where, where, orderBy, limit)`
2. `where('price', '>', '200')`
3. `limit(100)`
4. on maps - `'user.city', '==', 'Helsinki'`, up to 20 levels deep
5. `'user.city', 'in', '['Helsinki', 'London', 'Warsaw']'`
6. operators: `in, not-in, ==, !=, >=, <=, >, <`
7. `orderBy('cost', 'desc')`
8. `where('date', '<', new Date('23/12/2023'))` - works with native JS objects!
9. `where('category', 'array-contains', 'food')` - array-contains for querying arrays
10. `array-contains-any`

### Composite queries - on multiple fields

You need to create an index in production. No errors in emulators though.

## Cursors

***

1. `orderBy` is mandatory for cursors
2. `startAt(value)`
3. `endAt(...)`
4. `limitToLast(number)`
5. `endBefore(docRef)`

## CollectionGroup

***

1. `collectionGroup(firestore, 'expenses')`
2. will look into DB and search for all collections named `expenses` and a query against them
3. solution to querying all the `users` in order to query all the `expenses` sub-collections across them 


## Atomicity

***

### Batch Operations

1. `writeBatch(firestore)`
2. `batch.set() / update() / delete()...`
3. `batch.commit()`
4. limit of 500 documents per batch

### Transactions

1. no locking! you could lock the DB, if a client goes offline
2. `runTransaction(firestore, (transaction) => {...}`
3. retrieve initial value of a doc, mutate it and run a transaction's update, if in the meanwhile it got changed, server won't accept it but re-run your transaction


# Auth

***

## API

1. `createUserWithEmailAndPassword(auth, email, pass)`
2. `signOut(auth)`
3. `onAuthStateChanged(auth, (user) => {...})`

## 3rd Party Providers

1. `signInWithRedirect(auth, new GoogleAuthProvider())`

## Linking Accounts

1. `linkWithRedirect(auth.currentUser, new GoogleAuthProvider())` - can't run any code after it, as it goes to the auth provider
2. `getRedirectResult(auth)` - returns the result of the above operation

## Security Rules

***

1. `match /users/{uid} { }` -> at document level! use wildcards  
2. `match /{variable=**} { }` -> recursive wildcard, to every single path in the database
3. `allow` permission`: if` some condition
4. `read`, `write`, `create`, `delete`, `get`, `list`
5. `request.auth.uid == uid` -> condition to allow only authenticated users to read & write to their own sub-collections
6. `resource.data.uid == request.auth.uid` -> if the user's ID is at the resource (doc) level only
7. `request.resource.data.keys().hasAll(['someKey', 'anotherKey'])`
