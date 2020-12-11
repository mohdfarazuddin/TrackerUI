var edid;
$(function() {

    function setdiseasetype(obj) {
        obj.diseaseType = $('#diseasetype').val().trim();
        return obj;
    }

    var form1 = $('#adddiseasetypeblock #diseaseform');
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
            obj = setdiseasetype(obj);
            if ($('#adddiseasetypebtn').html() === "Add Disease Type") {
                $.ajax({
                    type: "POST",
                    url: "https://localhost:44395/api/DiseaseType/",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(obj),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        var msg = '<div id="msg"><h5 class="pt-5">Disease Type added Successfully.</h5> <p>Click <a href="./DiseaseType.html" >here</a> to view all Disease Types.</p></div>';
                        $(msg).appendTo('#cardbody');
                        $('#adddiseasetypeblock,#backbtn,#buttons').css("display", "none");
                    },
                    failure: function() {
                        alert("Error");
                    }
                });
            } else {
                obj.diseaseTypeID = edid;
                $.ajax({
                    type: "PUT",
                    url: "https://localhost:44395/api/DiseaseType/" + obj.diseaseTypeID,
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(obj),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        var msg = '<div id="msg"><h5 class="pt-5">Disease Type updated Successfully.</h5> <p>Click <a href="./DiseaseType.html" >here</a> to view all Disease Types.</p></div>';
                        $(msg).appendTo('#cardbody');
                        $('#adddiseasetypeblock,#backbtn,#buttons').css("display", "none");
                    },
                    failure: function() {
                        alert("Error");
                    }
                });
            }
        }, false);
    });

});

$('#adddiseasetype').click(function() {
    $('#backbtn').css("display", "block");
    $('#adddiseasetype').css("display", "none");
    $('#show').css("display", "none");
    $('#table').css("display", "none");
    $('#adddiseasetypeblock').css("display", "block");
    $('#header').html("Add Disease Type");
    $('#adddiseasetypebtn').html("Add Disease Type");
});

$('#backbtn').click(function() {
    $('#adddiseasetype').css("display", "block");
    $('#backbtn').css("display", "none");
    $('#show').css("display", "block");
    $('#adddiseasetypeblock').css("display", "none");
    $('#editblock').css("display", "none");
    document.getElementById('diseaseform').reset();
});

$('#gosearch').click(function() {
    if ($('#radiosearch input[type="radio"][name="search"]:checked').val() === "showall") {
        $.ajax({
            type: "GET",
            url: "https://localhost:44395/api/DiseaseType/",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: {},
            success: function(result) {
                $('#table tbody').empty();
                $.each(result, function(i) {
                    $('#table tbody').append('<tr><th>' + (i + 1) + '</th><td>' + result[i].diseaseType + '</td><td>' + '<button type="button" class="btn btn-primary" onclick="edit(' + result[i].diseaseTypeID + ')">Edit</button>' + '</td></tr>');
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
    $('#adddiseasetypeblock').css("display", "block");
    $('#adddiseasetype').css("display", "none");
    $('#show').css("display", "none");
    $('#table').removeAttr('style');
    $('#table').css("display", "none");
    $('#header').html("Edit Disease Type");
    $('#adddiseasetypebtn').html("Save");
    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/DiseaseType/" + id,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function(result) {
            $('#diseasetype').val(result.diseaseType);
        },
        failure: function() {
            alert("Error");
        }
    });
    edid = id;
}