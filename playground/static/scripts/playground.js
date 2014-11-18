var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.getSession().setMode("ace/mode/json");

var results = ace.edit("results");
results.setTheme("ace/theme/monokai");
results.getSession().setMode("ace/mode/javascript");
results.setReadOnly(true);


$('#submit').on('click', function(event){
    var inputs = editor.session.getValue();
    var object;

    try {
        object = JSON.parse(inputs)
    }catch (e){
        results.setValue("Input JSON was invalid");
        return;
    }

    $.ajax({
        url: object.url,
        type: object.method,
        data: object.data
    }).then(function(data, textStatus, jqXHR){
        var r = {
            status: jqXHR.status,
            result: textStatus,
            data: data
        };

        results.setValue(JSON.stringify(r, undefined, 2))
    }, function(jqXHR, textStatus, error){
        var e = {
            status: jqXHR.status,
            error: error,
            message: jqXHR.responseText
        };
        results.setValue(JSON.stringify(e, null, 2))
    })
});
