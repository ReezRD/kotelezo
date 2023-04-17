# vue3ApplicationStart

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

# bootstrap kiegészítés
Modulok:
```cmd
npm i bootstrap
npm i @popperjs/core
npm i bootstrap-icons
```

main.js-be:
```js
//bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"
```

# scrollspy
```
    <div class="col-8">
        <div data-bs-spy="scroll" data-bs-target="#simple-list-example" data-bs-offset="0" data-bs-smooth-scroll="true"
          class="scrollspy-example" tabindex="0">
          <h4 id="simple-list-item-1">Item 1</h4>
          <p>...</p>
          <h4 id="simple-list-item-2">Item 2</h4>
          <p>...</p>
          <h4 id="simple-list-item-3">Item 3</h4>
          <p>...</p>
          <h4 id="simple-list-item-4">Item 4</h4>
          <p>...</p>
          <h4 id="simple-list-item-5">Item 5</h4>
          <p>...</p>
        </div>
      </div>
```

# pagination
```
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item">
              <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item">
              <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
```