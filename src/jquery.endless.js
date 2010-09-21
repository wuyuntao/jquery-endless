/**
 * jQuery Endless Plugin
 *
 */
(function($) {

$.fn.endless = function(method, options) {
  if (!this.length) return this;

  return this.each(function() {
    var win = $(window),
        container = $(this);
        statuses = $(options.statusesSelector, container)

    if (method == 'stop') {
      stop();
    } else if (method == 'start') {
      start();
    } else {
      options = $.extend({
        // URLs
        prevURL: null,
        nextURL: null,

        // AJAX options
        dataType: 'html',
        dataName: 'id',
        dataHandler: function(data) { return $(data); },

        // Variables
        interval: 10000,

        // CSS classes
        containerClass: 'as-endless',
        statusClass: 'as-status',
        nextHighlightClass: 'as-next-highlight',
        prevHighlightClass: 'as-prev-highlight',

        // Selectors
        statusesSelector: 'article',

        // Data keys
        first: 'as-first',
        last: 'as-last',
        timer: 'as-timer',
        prevRequest: 'as-prev-request',
        nextRequest: 'as-next-request',

        // Events
        namespace: 'endless',
      }, method || {}, options || {});

      container.addClass(options.containerClass)
          .data('options', options)
          .data(options.first, statuses.last().attr(options.dataName))
          .data(options.last, statuses.first().attr(options.dataName));
      statuses.addClass(options.statusClass);

      start();
    }

    function scrollBottom() {
      var last = statuses.last();
      return win.scrollTop() + win.height() >= last.offset().top + last.outerHeight();
    }

    function start() {
      // Start interval
      if (container.data(options.timer))
        clearInterval(container.data(options.timer));

      win.bind('scroll.' + options.namespace, function(e) {
        if (scrollBottom()) {
          var prevRequest = options.prevRequest + '-' + container.data(options.first);
          if (!container.data(prevRequest)) {
            var params = {};
            params[options.dataName] = container.data(options.first);
            container.data(prevRequest, $.ajax({
              url: options.prevURL,
              dataType: options.dataType,
              data: params,
              success: function(data) {
                data = options.dataHandler(data).addClass(options.statusClass).appendTo(container).fadeIn();
                statuses = $(options.statusesSelector, container).removeClass(options.prevHighlightClass);
                data.addClass(options.prevHighlightClass);
                container.data(options.first, statuses.last().attr(options.dataName));
              },
              error: function(xhr, text, e) {
              }
            }));
          }
        }
      });

      container.data(options.timer, setInterval(function() {
        if (container.data(options.nextRequest))
          container.data(options.nextRequest).abort();

        var params = {};
        params[options.dataName] = container.data(options.last);
        container.data(options.nextRequest, $.ajax({
          url: options.nextURL,
          dataType: options.dataType,
          data: params,
          success: function(data) {
            if (data) {
              data = options.dataHandler(data).addClass(options.statusClass).prependTo(container).fadeIn();
              statuses = $(options.statusesSelector, container).removeClass(options.nextHighlightClass);
              data.addClass(options.nextHighlightClass);
              container.data(options.last, statuses.first().attr(options.dataName));
              container.data(options.nextRequest, null);
            }
          },
          error: function(xhr, text, e) {
            container.data(options.nextRequest, null);
          }
        }));
      }, options.interval));
    }

    function stop() {
      win.unbind('scroll.' + container.data(options.namespace));

      if (container.data(options.timer)) {
        clearInterval(container.data(options.timer));
        container.data(options.timer, null);
      }
    }
  });
};

})(jQuery);
