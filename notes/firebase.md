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
