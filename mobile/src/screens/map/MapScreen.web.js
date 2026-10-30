// No web, a tela compartilhada resolve automaticamente o MapCanvas.web.js.
// O caminho explícito com extensão evita que o Metro resolva este próprio
// arquivo (MapScreen.web.js) novamente ao importar "./MapScreen".
export { default } from './MapScreen.js';
