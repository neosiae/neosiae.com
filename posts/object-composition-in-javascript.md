---
title: Object composition in JavaScript
description: Learn object composition pattern in JavaScript
date: 2021-05-15
---

When we work with classes and objects we are traditionally told to use inheritance to share common functionality and to avoid code duplication.
While this approach works fine, there are some problems that come with it. I don't want to go into problems with inheritance in this post, but to 
introduce you a different approach of thinking and code reuse when you work with objects.

When we work with classes and inheritance we think in terms of what things are. Object composition is different, because we think in terms of what 
things can do. It gives us flexibility to create our objects and reuse code very easily.

To accomplish object composition in JavaScript we simply create functions that return objects with desired methods, then we merge 
all methods we want to have in our final object.

Lets say we want to create dog and cat objects. We will first start with the implementation of the methods we want to have.

```javascript
const withEat = () => ({
  eat() {
    console.log('Eating...')
  }
})

const withWalk = () => ({
  walk() {
    console.log('Walking...')
  }
})

const withBark = () => ({
  bark() {
    console.log('Barking...')
  }
})

const withMeow = () => ({
  meow() {
    console.log('Meowing...')
  }
})

const withName = () => ({
  sayName() {
    console.log(`My name is ${this.name}`)
  }
})
```

After we implemented all desired methods it is time to merge them and create our final objects.

```javascript
const createDog = ({ name }) =>
  Object.assign(
    { name },
    withEat(),
    withWalk(),
    withBark(),
    withName()
  )

const createCat = ({ name }) =>
  Object.assign(
    { name },
    withEat(),
    withWalk(),
    withMeow(),
    withName()
  )
```

You can see how we merged methods with `Object.assign` and reused code between objects. Now we can create dogs and cats and use their methods.

```javascript 
const max = createDog({ name: 'Max' })
const kitty = createCat({ name: 'Kitty' })

max.bark() // Barking...
max.eat() // Eating...
max.sayName() // My name is Max

kitty.meow() // Meowing...
kitty.walk() // Walking...
kitty.sayName() // My name is Kitty
```

What I like to do is to modifiy our functions with methods to take an object as an argument and merge it with the object we return so I can use `pipe` utility 
function to compose objects. `pipe` gives us more readable code in my opinion.

```javascript
const withEat = o => ({
  eat() {
    console.log('Eating...')
  },
  ...o
})

const withWalk = o => ({
  walk() {
    console.log('Walking...')
  },
  ...o
})

const withBark = o => ({
  bark() {
    console.log('Barking...')
  },
  ...o
})

const withMeow = o => ({
  meow() {
    console.log('Meowing...')
  },
  ...o
})

const withName = o => ({
  sayName() {
    console.log(`My name is ${this.name}`)
  },
  ...o
})
```

The most basic implementation of pipe function looks like this:

```javascript
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x)
```

`pipe` takes indefinite number of functions as an argument, then it returns a new function which takes a starting value as an argument. With use 
of `reduce` method it starts to iterate over provided functions from left to right. If we have three functions, it calls the first function with 
the starting value as an argument, then it calls the second function with the output of the first function, then the third function with the output 
of the second function. The output of one function becomes the input of another function.

Now we can use `pipe` to compose our objects.

```javascript
const createDog = ({ name }) => pipe(
  withEat,
  withWalk,
  withBark,
  withName
)({ name })

const createCat = ({ name }) => pipe(
  withEat,
  withWalk,
  withMeow,
  withName
)({ name })

const max = createDog({ name: 'Max' })
const kitty = createCat({ name: 'Kitty' })

max.bark() // Barking...
max.eat() // Eating...
max.sayName() // My name is Max

kitty.meow() // Meowing...
kitty.walk() // Walking...
kitty.sayName() // My name is Kitty
```

## Conclusion

Object composition gives as a flexible pattern to create objects and share code between them. If you need to introduce a new functionality it
is a straightforward process.

To accomplish object composition in JavaScript we can create functions that return objects with the desired methods and simply use `Object.assign` to 
merge them, or we can take a different approach with `pipe` utility function as we saw earlier in the post.