var App = App || {};

$(document).ready(function() {
  for (var module in App) {
    if ('init' in App[module]) {
      App[module].init();
    }
  }
});
