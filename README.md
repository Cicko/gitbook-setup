

### Welcome to the gitbook-setup package

To install the package you have to return
```bash
> npm install -g gitbook-setup
```

You have it to install it globally (-g option) if you want to execute the program directly on the console. To see
how to execute the command you have just to run:

```bash
> gitbook-setup [help]
```

## Possible commands
- Create
- Install
- Deploy


## Book creation

You have now three options for creating a book:
 - Passing book configuration through arguments.
 - Giving a file with the whole configuration.
 - In interactive form. The program will ask you for all information.

 The creation of a book by interactive form is the most user-friendly. The argument form of creation is useful when you want to create a lot of books for example and fast for students. The file method of creation could be useful when you want to send through the network the book information to create it in other place for example I could send a file configuration to China and there they can create the book.


 To create a book you have to execute

 ```bash
 > gitbook-setup create [interactive (default) | args | file -f <filename> ]
 ```

### By Arguments
If you want to create a book by arguments you have these fields:
- -n bookname (required)
- -t book (default) | api | faq | own:moduleName  
- -d heroku | gh-pages | moduleName
- -a author/s
- -i description

__Example 1 - Simplest book__

```bash
> gitbook-setup create args -n Sample
```
Will output:
![Sample 1](./src/img/sample1.jpg)

__Example 2 - Simplest book with my own template__

```bash
> gitbook-setup create args -n Sample -t own:myTemplate
```
Will output:
![Sample 1](./src/img/sample2.jpg)


__Example 3 - Book deployed to Heroku__

```bash
> gitbook-setup create args -n Sample -d heroku
```
Will output:
![Sample 1](./src/img/sample3.jpg)

__Example 4 - Book deployed to Heroku and gh-pages__

```bash
> gitbook-setup create args -n Sample -d heroku,gh-pages
```
Will output:
![Sample 1](./src/img/sample4.jpg)

__Example 5 - Book titled 'Our Piano History' with the template 'Classical Sheets', deployed to heroku, gh-pages and my server 'BestMusic', written by Frederic Chopin and Sergei Rachmaninoff and with some description about the book__

```bash
> gitbook-setup create args -n 'Our Piano History' -t own:'Classical Sheets' -d heroku,gh-pages,BestMusic -a 'Frederic Chopin','Sergei Rachmaninoff' -i 'Amazing story about our piano lifes'
```
Will output:
![Sample 1](./src/img/sample5.jpg)


### By file

If you saw the output of the previous examples you have to create a file with the identical content. For example you want a book title myBook that allows deployment to heroku you have to create a file like that:

![File 1](./src/img/file1.jpg)

This file will create the same book:


![File 2](./src/img/file2.jpg)

Because by defaut the type is book.


The field name is a requirement. All other fields are optional.

### Interactive

The program will just ask you for all fields and you will fill them.
