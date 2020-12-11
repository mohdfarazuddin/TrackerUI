var esid;
$(function() {

    function setstate(obj) {

        obj.state = $('#state').val().trim();
        return obj;
    }

    var form1 = $('#stateform');
    var validation = Array.prototype.filter.call(form1, function(form1) {
        form1.addEventListener('submit', function(event) {
            if ($('#msg').length)
                $('#msg').remove();
            if (form1.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
                form1.classList.add('was-validated');
                return;
            }
            event.preventDefault();
            var obj = {};
            obj = setstate(obj);
            if ($('#addstatebtn').html() === "Add State") {
                $.ajax({
                    type: "POST",
                    url: "https://localhost:44395/api/State/",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(obj),
                    success: function(data) {
                        var msg = '<div id="msg"><h5 class="pt-5">State added Successfully.</h5> <p>Click <a href="./state.html" >here</a> to view all States.</p></div>';
                        $(msg).appendTo('#cardbody');
                        $('#show').css("display", "block");
                        $('#addstateblock,#backbtn,#buttons').css("display", "none");
                    },
                    failure: function() {
                        alert("Error");
                    }
                });
            } else {
                obj.stateID = esid;
                $.ajax({
                    type: "PUT",
                    url: "https://localhost:44395/api/State/" + obj.stateID,
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(obj),
                    success: function(data) {
                        var msg = '<div id="msg"><h5 class="pt-5">State updated Successfully.</h5> <p>Click <a href="./state.html" >here</a> to view all States.</p></div>';
                        $(msg).appendTo('#cardbody');
                        $('#addstateblock,#backbtn,#buttons').css("display", "none");
                    },
                    failure: function() {
                        alert("Error");
                    }
                });
            }
        }, false);
    });

});

$('#addstate').click(function() {
    $('#backbtn').css("display", "block");
    $('#addstate').css("display", "none");
    $('#show').css("display", "none");
    $('#table').css("display", "none");
    $('#addstateblock').css("display", "block");
    $('#header').html("Add State");
    $('#addstatebtn').html("Add State");
});

$('#backbtn').click(function() {
    $('#addstate').css("display", "block");
    $('#backbtn').css("display", "none");
    $('#show').css("display", "block");
    $('#addstateblock').css("display", "none");
    document.getElementById('stateform').reset();
});

$('#gosearch').click(function() {
    if ($('#radiosearch input[type="radio"][name="search"]:checked').val() === "showall") {
        $.ajax({
            type: "GET",
            url: "https://localhost:44395/api/State/",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: {},
            success: function(result) {
                $('#table tbody').empty();
                $.each(result, function(i) {
                    $('#table tbody').append('<tr><th>' + (i + 1) + '</th><td>' + result[i].state + '</td><td>' + '<button type="button" class="btn btn-primary" onclick="edit(' + result[i].stateID + ')">Edit</button>' + '</td></tr>');
                });
                $('#table').css("display", "block");
            },
            failure: function() {
                alert("Error");
            }
        });
    }

});

function edit(id) {
    $('#backbtn').css("display", "block");
    $('#addstateblock').css("display", "block");
    $('#addstate').css("display", "none");
    $('#show').css("display", "none");
    $('#table').removeAttr('style');
    $('#table').css("display", "none");
    $('#header').html("Edit State");
    $('#addstatebtn').html("Save");
    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/State/" + id,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function(result) {
            $('#state').val(result.state);
        },
        failure: function() {
            alert("Error");
        }
    });
    esid = id;
}