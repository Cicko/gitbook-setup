# Memoria del TFG de Rudolf Cicko

Todo este trabajo será realizado en el sistema operativo __Ubuntu__.


## Primeros pasos

### NodeJS

En caso de no tenerlo instalado, seguir las instrucciones en la página oficial de [nodejs](https://docs.npmjs.com/getting-started/installing-node)

Para comprobar que tenemos node correctamente instalado basta con ejecutar en la terminal:

```bash
 node -v
```

Nos debería devolver la versión que tenemos actualmente de node.


### Express

También deberemos instalar express: [express](http://expressjs.com/)

Para comprobar su instalación, de igual modo ejecutamos:

```bash
express -V
```

Nos debería devolver la versión que tenemos actualmente instalada de express.


### Git

También necesitamos [git]($ sudo apt-get install git-all)

De igual manera que los anteriores comprobamos su correcta instalación mostrando la versión instalada:

```bash
$ git --version
```

### Gitbook

Ahora que tenemos instalado lo anterior, procederemos a instalar el paquete npm de [gitbook](https://www.npmjs.com/package/gitbook)

```bash
npm install gitbook
```

### Gitbook plugin

Los [plugins](https://plugins.gitbook.com/) de gitbook nos permiten aprovechar las ideas que han tenido los distintos desarrolladores para facilitarnos la vida. Vamos a instalar un plugins de [ejercicios](https://plugins.gitbook.com/plugin/exercises). Para instalarlo creamos un fichero [book.json](book.json) y añadimos:

```
{
    "plugins": ["exercises"]
}
```
Ahora simplemente ejecutamos ```gitbook install``` y podemos probar ahora el siguiente cuestionario ejecutando ```gitbook serve``` y visitando el  localhost en nuestro navegador:

{% exercise %}
Define a variable `x` equal to 9.
{% initial %}
var x =
{% solution %}
var x = 9;
{% validation %}
assert(x == 9);
{% context %}
// This is context code available everywhere
// The user will be able to call magicFunc in his code
function solucion() {
    return 9;
}
{% endexercise %}

{% exercise %}
Define a variable `y` equal to 'ruda'.
{% initial %}
var y =
{% solution %}
var y = 'ruda';
{% validation %}
assert(y == 'ruda');
{% context %}
// This is context code available everywhere
// The user will be able to call magicFunc in his code
function solucion() {
    return 'ruda';
}
{% endexercise %}

## Testing with gulp deploy-gitbook
