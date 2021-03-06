$(document).ready(function(){

    var api_url = 'http://157.230.17.132:3017/todos/';
    var template_html = $('#todo-template').html();
    var template_function = Handlebars.compile(template_html);

    stampa_todos();

    //quando clicco su button + inserisco nuovo todo
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

    //quando premo invio inserisco nuovo todo
    $('#new-text-todo').keypress(function(){
        if (event.which == 13) {
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
        }
    });

    //quando clicco su icona bidone DELETE todo
    $(document).on('click', '.delete-todo', function(){
        //recuperare l'id del todo selezionato
        var todo_id = $(this).parent().attr('data-todo_id');
        cancella_todo(todo_id);
    });

    //quando clicco su modifica
    $(document).on('click', '.edit-todo', function(){
        //controllo che sia possibile modifica solo un campo alla volta
        $('.text-todo').show();
        $('.input-edit-todo').hide();
        $('.edit-todo').show();
        $('.save-todo').hide();
        //recuperare l'id del todo selezionato
        var todo_id = $(this).parent().attr('data-todo_id');
        //appare icona SALVA
        $(this).parent().find('.save-todo').show();
        //scompare icona MODIFICA
        $(this).parent().find('.edit-todo').hide();
        //scompare lo span che contiene todo
        $(this).parent().find('.text-todo').hide();
        //appare campo input per inserire testo
        $(this).parent().find('.input-edit-todo').show();
    });

    //quando clicco su SALVA
    $(document).on('click', '.save-todo', function(){
        //recuperare l'id del todo selezionato
        var todo_id = $(this).parent().attr('data-todo_id');
        //leggo nuovo testo
        var edit_todo = $(this).parent().find('.input-edit-todo').val();
        //scompare icona SALVA
        $(this).parent().find('.save-todo').hide();
        //compare icona MODIFICA
        $(this).parent().find('.edit-todo').show();

        modifica_todo(todo_id, edit_todo);
    });

    //quando faccio click sullo span si aggiunge/toglie la classe done
    $('#todo_list').on('click','.text-todo', function(){
        //verifico se l'elemento ha già la classe done
        var done_todo = $(this).parent().hasClass('done');
        //leggo dal data l'id per passarlo all api_url
        var id_todo = $(this).parent().attr('data-todo_id');
        verifica_stato(id_todo, done_todo);
    });

    //---------FUNZIONI--------------

    function verifica_stato(id_todo, done_todo){
        //facciamo una chiamata ajax in PATCH per scrivere la proprietà done
        $.ajax({
            'url': api_url + id_todo,
            'method':'PATCH',
            'data': {
                //if ternario (se done = false(0) allora done=1 (mettilo fatto), altrimenti done = true(1) mettilo a 0 )
                'done': (done_todo == false ? 1 : 0)
            },
            'success': function(){
                //stampo lista aggiornata
                stampa_todos();
            },
            'error': function(){
                alert('Error');
            }
        });
    }

    function modifica_todo(id_todo, newText_todo){
        //chiamata ajax con PUT a cui passo id e testo per modificarlo
        //usiamo adesso PATCH per non sovrascrivere
        $.ajax({
            'url': api_url + id_todo,
            'method':'PATCH',
            'data': {
                'text': newText_todo
            },
            'success': function(){
                //stampo lista aggiornata
                stampa_todos();
            },
            'error': function(){
                alert('Error');
            }
        });
    }

    function cancella_todo(id_todo){
        // chiamata ajax in DELETE per cancellare id selezionato
        $.ajax({
            'url': api_url +  id_todo,
            'method': 'DELETE',
            'success': function(){
                //stampo lista aggiornata
                stampa_todos();
            },
            'error': function(){
                alert('Error');
            }
        });
    }

    function crea_todo(new_todo) {
        //chiamata ajax in POST per salvare il nuovo todo
        $.ajax({
            'url': api_url,
            'method': 'POST',
            'data': {
                //gli passo il testo da inserire
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
        //chiamata ajax in GET per recuperare lista
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
                    //verifico lo stato della proprietà bidone
                    var fatto = todo_current.done;
                    // mi salvo le variabili per il template
                    var context = {
                        'todo_id': id_todo,
                        'todo_text': testo_todo,
                        //la variabile fatto contiene 1? se si aggiungi done se no niente
                        //if compatta
                        'done': (fatto == 1 ? 'done' : '')
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
