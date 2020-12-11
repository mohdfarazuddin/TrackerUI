var ehid;
var eaid;
var pagination;
$(function() {

    let dropdown1 = $('#statedd, #hstate');
    dropdown1.empty();
    dropdown1.append('<option selected value="0" disabled="true">Select State</option>');
    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/State/",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function(result) {
            $.each(result, function(i) {
                dropdown1.append($('<option></option>').val(result[i].stateID).text(result[i].state));
            });
        },
        failure: function() {
            alert("Error");
        }
    });

    $('#mobile,#hpincode,#pageno').keyup(function() {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });

    function sethospital(hosobj) {

        hosobj.name = $('#hospitalname').val().trim();
        hosobj.phone = $('#mobile').val().trim();
        hosobj.address = {
            "addressType": "Hospital",
            "addressline": $('#haddressline').val().trim(),
            "city": $('#hcity').val().trim(),
            "stateID": $('#hstate option:selected').val(),
            "zipCode": $('#hpincode').val().trim()
        }
        return hosobj;
    }



    var form1 = $('#hospitalform');
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
            if ($('#hstate option:selected').val() == "0") {
                event.preventDefault();
                event.stopPropagation();
                alert("Select State");
                return;
            }
            event.preventDefault();
            var hosobj = {};
            hosobj = sethospital(hosobj);
            if ($('#addhospitalbtn').html() === "Add Hospital") {
                $.ajax({
                    type: "POST",
                    url: "https://localhost:44395/api/Hospital/",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(hosobj),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        var msg = '<div id="msg"><h5 class="pt-5">Hospital Details added Successfully.</h5> <p>Click <a href="./hospital.html?id=' + data.hospitalID + '" >here</a> to view Hospital Details.</p></div>';
                        $(msg).appendTo('#cardbody');
                        $('#addhospitalblock,#backbtn,#buttons,#pages,#pagination').css("display", "none");
                    },
                    failure: function() {
                        alert("Error");
                    }
                });
            } else {
                hosobj.hospitalID = ehid;
                hosobj.address.iD = eaid;
                $.ajax({
                    type: "PUT",
                    url: "https://localhost:44395/api/Hospital/" + hosobj.hospitalID,
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(hosobj),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        var msg = '<div id="msg"><h5 class="pt-5">Hospital Details Updated Successfully.</h5> <p>Click <a href="./hospital.html?id=' + data.hospitalID + '" >here</a> to view Hospital Details.</p></div>';
                        $(msg).appendTo('#cardbody');
                        $('#addhospitalblock,#backbtn,#buttons,#pages,#pagination').css("display", "none");
                    },
                    failure: function() {
                        alert("Error");
                    }
                });
            }
        }, false);
    });

});

$('#addhospital').click(function() {
    $('#backbtn,#addhospitalblock').css("display", "block");
    $('#addhospital,#show,#table,#pages,#pagination').css("display", "none");
});

$('#backbtn').click(function() {
    $('#addhospital,#show').css("display", "block");
    $('#backbtn,#addhospitalblock,#showhospitalblock,#pages,#pagination').css("display", "none");
    document.getElementById('hospitalform').reset();
    window.location.href = window.location.pathname;
});

$('#radiosearch input[type="radio"][name="searchby"]').on('change', function() {
    if ($('#radiosearch input[type="radio"][name="searchby"]:checked').val() === "showall") {
        $('#statesearch').removeAttr('style');
        $('#statesearch').css("display", "none");
    }
    if ($('#radiosearch input[type="radio"][name="searchby"]:checked').val() === "statesearch") {
        $('#statesearch').removeAttr('style');
        $('#statesearch').css("display", "flex");
    }
    $('#table,#pages,#pagination').css("display", "none");
});

$('#statedd').on('change', function() {
    $('#statedd').removeClass("is-invalid");
    $('#statedd').addClass("is-valid");
    $('#table').css("display", "none");
    $('#msg').remove();
});

$('#gosearch').click(function() {
    if ($('#radiosearch input[type="radio"][name="searchby"]:checked').val() === "statesearch") {
        if ($('#statedd').hasClass("is-invalid")) {
            return;
        }
        var table = $('#table');
        $.ajax({
            type: "GET",
            url: "https://localhost:44395/api/State/" + $('#statedd').val() + "/Hospitals",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: {},
            xhrFields: {
                withCredentials: true
            },
            success: function(result) {
                if ($.isEmptyObject(result)) {
                    $('#msg').remove();
                    $('#table').css("display", "none");
                    $('#cardbody').append('<div class="h5 d-flex justify-content-center" id="msg"> No Hospitals Available </div>');
                    return;
                }
                $('#msg').remove();
                $('#table tbody').empty();
                $.each(result, function(i) {
                    $('#table tbody').append('<tr class="clickable-row" onClick="show(' + result[i].hospitalID + ')"><th>' + (i + 1) + '</th><td>' + result[i].name + '</td><td>' + result[i].address.city + '</td><td>' + result[i].address.stateName.state + '</td></tr>');
                });
                $('#table').css("display", "block");
            },
            failure: function() {
                alert("Error");
            }
        });
    } else {
        $.ajax({
            type: "GET",
            url: "https://localhost:44395/api/Hospital/",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: {},
            xhrFields: {
                withCredentials: true
            },
            success: function(result, textStatus, jqXHR) {
                if ($.isEmptyObject(result)) {
                    $('#table').css("display", "none");
                    $('#cardbody').append('<div class="h5 d-flex justify-content-center" id="msg"> No Hospitals Available </div>');
                    return;
                }
                var a = jqXHR.getResponseHeader("x-pagination");
                pagination = JSON.parse(a);
                $('#msg').remove();
                $('#table tbody').empty();
                $.each(result, function(i) {
                    $('#table tbody').append('<tr class="clickable-row" onClick="show(' + result[i].hospitalID + ',' + result[i].address.id + ')"><th>' + (((pagination.CurrentPage - 1) * 30) + (i + 1)) + '</th><td>' + result[i].name + '</td><td>' + result[i].address.city + '</td><td>' + result[i].address.stateName.state + '</td></tr>');
                });
                $('#table,#pages,#pagination').css("display", "block");
                var b = '<h5>showing ' + pagination.CurrentPage + ' Page out of ' + pagination.TotalPages + ' Pages';
                $('#pages').empty();
                $('#pages').append(b);
                if (pagination.CurrentPage == 1)
                    $('#prevt').addClass("disabled");
                else
                    $('#prevt').removeClass("disabled");
                if (pagination.TotalPages > pagination.CurrentPage)
                    $('#nextt').removeClass("disabled");
                else
                    $('#nextt').addClass("disabled");
            },
            failure: function() {
                alert("Error");
            }
        });
    }
});

$('#gopage').click(function() {
    data($('#pageno').val());
    $('#pageno').val("");
});

$('#prev').click(function() {
    data(pagination.CurrentPage - 1);
});

$('#next').click(function() {
    data(pagination.CurrentPage + 1);
});

function data(no) {
    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/Hospital?page=" + no,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function(result, textStatus, jqXHR) {
            if ($.isEmptyObject(result)) {
                $('#table,#pages,#pagination').css("display", "none");
                $('#msg').remove();
                $('#cardbody').append('<div class="h5 d-flex justify-content-center" id="msg"> No Hospitals Available </div>');
                return;
            }
            var a = jqXHR.getResponseHeader("x-pagination");
            pagination = JSON.parse(a);
            $('#msg').remove();
            $('#table tbody').empty();
            $.each(result, function(i) {
                $('#table tbody').append('<tr class="clickable-row" onClick="show(' + result[i].hospitalID + ')"><th>' + (((pagination.CurrentPage - 1) * 30) + (i + 1)) + '</th><td>' + result[i].name + '</td><td>' + result[i].address.city + '</td><td>' + result[i].address.stateName.state + '</td></tr>');
            });
            $('#table,#pages,#pagination').css("display", "block");
            var b = '<h5>showing ' + pagination.CurrentPage + ' Page out of ' + pagination.TotalPages + ' Pages';
            $('#pages').empty();
            $('#pages').append(b);
            if (pagination.CurrentPage == 1)
                $('#prevt').addClass("disabled");
            else
                $('#prevt').removeClass("disabled");
            if (pagination.TotalPages > pagination.CurrentPage)
                $('#nextt').removeClass("disabled");
            else
                $('#nextt').addClass("disabled");
        },
        failure: function() {
            alert("Error");
        }
    });
};


function show(hid) {
    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/Hospital/" + hid,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function(result) {
            $('#backbtn,#showhospitalblock').css("display", "block");
            $('#addhospital,#show,#table,#pages,#pagination').css("display", "none");
            $('#showhname,#showhmobileno,#showhaddressline,#showhcity,#showhstate,#showhpincode').html("");
            $('#showhname').html(result.name);
            $('#showhmobileno').html("+91-" + result.phone);
            $('#showhaddressline').html(result.address.addressline);
            $('#showhcity').html(result.address.city);
            $('#showhstate').html(result.address.stateName.state);
            $('#showhpincode').html(result.address.zipCode);
            eaid = result.address.id;
        },
        failure: function() {
            alert("Error");
        }
    });
    ehid = hid;
}

$('#editbtn').click(function() { edit(ehid); });

function edit(ehid) {
    $('#backbtn,#addhospitalblock').css("display", "block");
    $('#addhospital,#show,#table,#showhospitalblock,#pages,#pagination').css("display", "none");
    $('#header').html("Edit Hospital Details");
    $('#addhospitalbtn').html("Save");
    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/Hospital/" + ehid,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function(result) {
            $('#hospitalname').val(result.name);
            $('#mobile').val(result.phone);
            $('#haddressline').val(result.address.addressline);
            $('#hcity').val(result.address.city);
            $('#hstate').val(result.address.stateID);
            $('#hpincode').val(result.address.zipCode);
        },
        failure: function() {
            alert("Error");
        }
    });
}

var url = window.location.href;
var id = url.split("?id=");
if (!($.isEmptyObject(id[1]))) {
    show(id[1]);
}