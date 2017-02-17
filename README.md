

### Welcome to the gitbook-setup package

To install the package you have to return
```bash
> npm install -g gitbook-setup
```

You have it to install it globally (-g option) if you want to execute the program directly on the console.
If you want to create a book you just have to execute:

```bash
> gitbook-setup -n [BOOK NAME] -t [TYPE]
```

where
- BOOK NAME: is the name of your book
- TYPE: is the type of book where it can be:
  - api
  - book
  - faq
  - Your own book specification. so in this field you have to indicate the book folder root name.

An example of a command to create an api book named *"documentacion de C++14"* will be:

```bash
> gitbook-setup -n "Documentacion de C++14" -t api
```
