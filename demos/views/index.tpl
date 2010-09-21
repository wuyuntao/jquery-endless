<%inherit file="base.tpl"/>

<%def name="title()">jQuery Endless Plugin Demos</%def>

<%def name="header()">
  <h1>jQuery Endless Plugin Demos</h1>

  <div id="controls">
    <input id="start" type="button" name="start" value="Start!" />
    <input id="stop" type="button" name="stop" value="Stop!" />
  </div>
</%def>

<%def name="content()">
  <style type="text/css">
    #endless article {
      display: block;
      border-bottom: 1px solid gray;
    }

    #endless .as-next-highlight {
      background: #FFF9C2;
    }

    #endless .as-prev-highlight {
      background: #FFD0C2;
    }
  </style>

  <section id="endless">
    % for status in statuses:
      <article id="${status["id"]}">
        ${status["user"]} says: ${status["text"]} at ${status["created_at"]}
      </article>
    % endfor
  </section>

  <script type="text/javascript">
    $(function() {
      $('#endless').endless({
        prevURL: '/prev',
        nextURL: '/next',
        interval: 5000,

        dataType: 'json',
        dataHandler: function(data) {
          var statuses = [];
          $.each(data.statuses, function(i, s) {
            statuses.push('<article id="' + s.id + '" style="display:none">' + s.user + ' says: ' + s.text + ' at ' + s.created_at + '</article>');
          });
          return $(statuses.join(' '));
        }
      });

      $('#start').click(function() {
        $('#endless').endless('start');
      });

      $('#stop').click(function() {
        $('#endless').endless('stop');
      });
    });
  </script>
</%def>
