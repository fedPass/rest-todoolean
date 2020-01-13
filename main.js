$(document).ready(function(){

    //predispondo le variabili per i template
    var template_html = $('#todo-template').html();
    var template_function = Handlebars.compile(template_html);

    stampa_todos();

    //inserisco nuovo todo
    $('#new-todo-button').click(function(){
        //leggo il testo inserito
        var typed_todo = $('#new-text-todo'). val().trim();
        if (typed_todo.length == 0) {
            alert('Inserisci un testo')
        } else {
            console.log(typed_todo);
        }
    });

    function stampa_todos(){
        //resetto la Lista
        $('#todo_list').empty();
        //chiamata ajax per recuperare lista
        $.ajax({
            'url':'http://157.230.17.132:3017/todos',
            'method': 'GET',
            'success': function(data){
                var todos = data;
                for (var i = 0; i < todos.length; i++) {
                    var todo_current = todos[i];
                    var testo_todo = todo_current.text;
                    var id_todo = todo_current.id;
                    //stampo staticamente
                    // $('#todo_list').append('<li>' + testo_todo + '</li>');
                    //usando template
                    var context = {
                        'todo_id': id_todo,
                        'todo_text': testo_todo
                    }
                    var html_finale = template_function(context);
                    $('#todo_list').append(html_finale);
                }
            },
            'error': function(){
                alert('Errore');
            }
        });
    }
});
