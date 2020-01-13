$(document).ready(function(){

    var api_url = 'http://157.230.17.132:3017/todos';

    //predispondo le variabili per i template
    var template_html = $('#todo-template').html();
    var template_function = Handlebars.compile(template_html);

    stampa_todos();

    //quando clicco su button INSERISCI inserisco nuovo todo
    $('#new-todo-button').click(function(){
        //leggo il testo inserito
        var typed_todo = $('#new-text-todo').val().trim();
        //e resetto il campo
        $('#new-text-todo').val('');
        //se il campo è vuoto do un avviso di errore
        if (typed_todo.length == 0) {
            alert('Inserisci un testo')
        } else {
            //altrimenti inserisci nuovo todo
            crea_todo(typed_todo);
        }
    });

    //quando clicco su icona bidone DELETE todo
    $(document).on('click', '.delete-todo', function(){
        //recuperare l'id del todo selezionato
        var todo_id = $(this).parent().attr('data-todo_id');
        console.log(todo_id);
        // chiamata ajax in DELETE per cancellare id selezionato
        $.ajax({
            'url': api_url + '/' + todo_id,
            'method': 'DELETE',
            'success': function(){
                //stampo lista aggiornata
                stampa_todos();
            },
            'error': function(){
                alert('Error');
            }
        });
    });

    function crea_todo(new_todo) {
        //chiamata ajax in POST per salvare il nuovo todo
        $.ajax({
            'url': api_url,
            'method': 'POST',
            'data': {
                //gli passo la chiave da inserire
                'text': new_todo
            },
            'success': function(){
                //stampa lista ggiornata
                stampa_todos();
            },
            'error': function(){
                alert('Error');
            }
        });
    }

    function stampa_todos(){
        //resetto la Lista
        $('#todo_list').empty();
        //chiamata ajax per recuperare lista
        $.ajax({
            'url':api_url,
            'method': 'GET',
            'success': function(data){
                var todos = data;
                //di ogni elemento
                for (var i = 0; i < todos.length; i++) {
                    var todo_current = todos[i];
                    // prendo il testo
                    var testo_todo = todo_current.text;
                    // e l'id
                    var id_todo = todo_current.id;
                    // mi salvo le variabili per il template
                    var context = {
                        'todo_id': id_todo,
                        'todo_text': testo_todo
                    }
                    //compilo il template
                    var html_finale = template_function(context);
                    //appendo il li dentro il contenitore della lista
                    $('#todo_list').append(html_finale);
                }
            },
            'error': function(){
                alert('Errore');
            }
        });
    }
});
