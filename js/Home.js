var pagination;
var sid;
var hid;
(function() {
    $('#externallogins').css("display", "none");
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
            let dropdown1 = $('#statedd, #statedd1');
            dropdown1.empty();
            dropdown1.append('<option selected value="0" disabled="true">Select State</option>');
            $.each(result, function(i) {
                dropdown1.append($('<option></option>').val(result[i].stateID).text(result[i].state));
            });
        },
        failure: function() {
            alert("Error");
        }
    });

    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/Home/",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function(result) {
            $('#tc').html(result.totalCases);
            $('#ac').html(result.activeCases);
            $('#cc').html(result.curedCases);
            $('#f').html(result.fatalities);
        },
        failure: function() {
            alert("Error");
        }
    });

    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/Home/State",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function(result) {
            $('#msg').remove();
            $('#states tbody').empty();
            $.each(result, function(i) {
                $('#states tbody').append('<tr class="clickable-row" onClick="hosshow(' + result[i].stateID + ')"><th>' + (i + 1) + '</th><td>' + result[i].state + '</td><td>' + result[i].totalCases + '</td><td>' + result[i].activeCases + '</td><td>' + result[i].curedCases + '</td><td>' + result[i].fatalities + '</td></tr>');
            });
            $('#states').css("display", "block");
            $('#patients,#patienttable,#hospitals,#pages,#pagination').css("display", "none");
        },
        failure: function() {
            alert("Error");
        }
    });

})();

$('#addpatbtn').click(function() {
    window.location.href = "./Patient.html";
});

$('#hosbtn').click(function() {
    window.location.href = "./Hospital.html";
});

$('#distypbtn').click(function() {
    window.location.href = "./DiseaseType.html";
});

$('#statebtn').click(function() {
    window.location.href = "./State.html";
});

function hosshow(id) {
    $('#patients,#patienttable,#states,#hospitals,#pages,#pagination').css("display", "none");
    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/Home/Hospital?id=" + id,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function(result) {
            if ($.isEmptyObject(result)) {
                $('#msg').remove();
                $('#cardbody').append('<div class="h5 d-flex justify-content-center" id="msg"> No Hospitals Found </div>');
                return;
            }
            $('#msg').remove();
            $('#hospitals tbody').empty();
            $.each(result, function(i) {
                $('#hospitals tbody').append('<tr class="clickable-row" onClick="patshow(' + result[i].hospitalID + ')"><th>' + (i + 1) + '</th><td>' + result[i].hospital + '</td><td>' + result[i].totalCases + '</td><td>' + result[i].activeCases + '</td><td>' + result[i].curedCases + '</td><td>' + result[i].fatalities + '</td></tr>');
            });
            $('#hospitals').css("display", "block");
            $('#patients,#patienttable,#pages,#pagination').css("display", "none");
        },
        failure: function() {
            alert("Error");
        }
    });
}

var msguid = '<div id="uidmsg" class="pt-3 pb-3"> <h5>Enter 16 digit Aadhaar Number</h5> </div>';

$('#uidcheck').keyup(function() {
    this.value = this.value.replace(/[^0-9\.]/g, '');
    $('#table').css("display", "none");
    $('#msg').remove();
    if ($('#uidcheck').val().length == 16) {
        $('#uidcheck').removeClass("is-invalid");
        $('#uidcheck').addClass("is-valid");
        $('#table').css("display", "none");
        $('#msg').remove();
    }
    if ($('#uidcheck').val().length != 16) {
        $('#uidcheck').removeClass("is-valid");
        $('#uidcheck').addClass("is-invalid");
        $('#table').css("display", "none");
        $('#msg').remove();
    }
});

$('#searchby input[type="radio"][name="searchby"]').on('change', function() {
    if ($('#searchby input[type="radio"][name="searchby"]:checked').val() === "aadhaarsearch") {
        $('#aadhaarsearch').css("display", "flex");
        $('#statesearch,#hospitalsearch').css("display", "none");
    } else if ($('#searchby input[type="radio"][name="searchby"]:checked').val() === "statesearch") {
        $('#statesearch').css("display", "flex");
        $('#aadhaarsearch,#hospitalsearch').css("display", "none");
    } else if ($('#searchby input[type="radio"][name="searchby"]:checked').val() === "hospitalsearch") {
        $('#hospitalsearch').css("display", "block");
        $('#aadhaarsearch,#statesearch').css("display", "none");
    }
});

$('#statedd').on('change', function() {
    $('#statedd').removeClass("is-invalid");
    $('#statedd').addClass("is-valid");
    $('#table').css("display", "none");
    $('#msg').remove();
});

$('#statedd1').on('change', function() {
    $('#statedd1').removeClass("is-invalid");
    $('#statedd1').addClass("is-valid");
    $('#table').css("display", "none");
    $('#msg').remove();
    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/State/" + $('#statedd1').val() + "/Hospitals",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function(result) {
            let dropdown2 = $('#hospitaldd');
            dropdown2.empty();
            dropdown2.append('<option selected disabled="true">Select Hospital</option>');
            $.each(result, function(i) {
                dropdown2.append($('<option></option>').val(result[i].hospitalID).text(result[i].name));
            });
            dropdown2.append('<option value="0">Others</option>');
        },
        failure: function() {
            alert("Error");
        }
    });
});

$('#hospitaldd').on('change', function() {
    $('#hospitaldd').removeClass("is-invalid");
    $('#hospitaldd').addClass("is-valid");
    $('#table').css("display", "none");
    $('#msg').remove();
});

$('#gosearch').click(function() {
    if ($('#radiosearch input[type="radio"][name="searchby"]:checked').val() === "aadhaarsearch") {
        if ($('#uidcheck').val().length != 16) {
            $('#uidmsg').remove();
            return;
        }
        $.ajax({
            type: "GET",
            url: "https://localhost:44395/api/Patient/" + $('#uidcheck').val(),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: {},
            xhrFields: {
                withCredentials: true
            },
            success: function(result) {
                $('#msg').remove();
                $('#patients tbody').empty();
                $('#patients tbody').append('<tr class="clickable-row" onClick="show(' + result.uniqueID + ')"><th>' + 1 + '</th><td>' + result.uniqueID + '</td><td>' + result.name + '</td><td>' + result.sex + '</td><td>' + result.age + '</td></tr>');
                $('#patients,#patienttable,#pages,#pagination').css("display", "block");
                $('#pages,#pagination').css("display", "none");
            },
            statusCode: {
                404: function() {
                    $('#msg').remove();
                    $('#patients,#patienttable').css("display", "none");
                    $('#cardbody').append('<div class="h5 d-flex justify-content-center" id="msg"> No Patient Found </div>');
                }
            },
            failure: function() {
                alert("Error");
            }
        });
    }
    if ($('#radiosearch input[type="radio"][name="searchby"]:checked').val() === "statesearch") {
        if ($('#statedd').hasClass("is-invalid")) {
            return;
        }
        sid = $('#statedd').val();
        $.ajax({
            type: "GET",
            url: "https://localhost:44395/api/State/" + sid + "/Patients",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: {},
            xhrFields: {
                withCredentials: true
            },
            success: function(result, textStatus, jqXHR) {
                if ($.isEmptyObject(result)) {
                    $('#msg').remove();
                    $('#patients,#patienttable').css("display", "none");
                    $('#cardbody').append('<div class="h5 d-flex justify-content-center" id="msg"> No Patients Found </div>');
                    return;
                }
                var a = jqXHR.getResponseHeader("x-pagination");
                pagination = JSON.parse(a);
                $('#msg').remove();
                $('#patients tbody').empty();
                $.each(result, function(i) {
                    $('#patients tbody').append('<tr class="clickable-row" onClick="show(' + result[i].uniqueID + ')"><th>' + (((pagination.CurrentPage - 1) * 30) + (i + 1)) + '</th><td>' + result[i].uniqueID + '</td><td>' + result[i].name + '</td><td>' + result[i].sex + '</td><td>' + result[i].age + '</td></tr>');
                });
                $('#patients,#patienttable,#pages,#pagination').css("display", "block");
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
    if ($('#radiosearch input[type="radio"][name="searchby"]:checked').val() === "hospitalsearch") {
        if ($('#hospitaldd').hasClass("is-invalid")) {
            return;
        }
        patshow($('#hospitaldd').val());
    }
});

function patshow(id) {
    hid = id;
    $('#patients,#patienttable,#states,#hospitals,#pages,#pagination').css("display", "none");
    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/Hospital/" + hid + "/Patients",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function(result, textStatus, jqXHR) {
            if ($.isEmptyObject(result)) {
                $('#msg').remove();
                $('#patients,#patienttable').css("display", "none");
                $('#cardbody').append('<div class="h5 d-flex justify-content-center" id="msg"> No Patients Found </div>');
                return;
            }
            var a = jqXHR.getResponseHeader("x-pagination");
            pagination = JSON.parse(a);
            $('#msg').remove();
            $('#patients tbody').empty();
            $.each(result, function(i) {
                $('#patients tbody').append('<tr class="clickable-row" onClick="show(' + result[i].uniqueID + ')"><th>' + (((pagination.CurrentPage - 1) * 30) + (i + 1)) + '</th><td>' + result[i].uniqueID + '</td><td>' + result[i].name + '</td><td>' + result[i].sex + '</td><td>' + result[i].age + '</td></tr>');
            });
            $('#patients,#patienttable,#pages,#pagination').css("display", "block");
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

function show(uid) {
    window.location.href = "./Patient.html?id=" + uid;
}

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
    if ($('#searchby input[type="radio"][name="searchby"]:checked').val() === "statesearch") {
        $.ajax({
            type: "GET",
            url: "https://localhost:44395/api/State/" + sid + "/Patients?page=" + no,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: {},
            xhrFields: {
                withCredentials: true
            },
            success: function(result, textStatus, jqXHR) {
                if ($.isEmptyObject(result)) {
                    $('#msg').remove();
                    $('#patients,#patienttable').css("display", "none");
                    $('#cardbody').append('<div class="h5 d-flex justify-content-center" id="msg"> No Patients Found </div>');
                    return;
                }
                var a = jqXHR.getResponseHeader("x-pagination");
                pagination = JSON.parse(a);
                $('#msg').remove();
                $('#patients tbody').empty();
                $.each(result, function(i) {
                    $('#patients tbody').append('<tr class="clickable-row" onClick="show(' + result[i].uniqueID + ')"><th>' + (((pagination.CurrentPage - 1) * 30) + (i + 1)) + '</th><td>' + result[i].uniqueID + '</td><td>' + result[i].name + '</td><td>' + result[i].sex + '</td><td>' + result[i].age + '</td></tr>');
                });
                $('#patients,#patienttable,#pages,#pagination').css("display", "block");
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
    } else {
        $.ajax({
            type: "GET",
            url: "https://localhost:44395/api/Hospital/" + hid + "/Patients?page=" + no,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: {},
            xhrFields: {
                withCredentials: true
            },
            success: function(result, textStatus, jqXHR) {
                if ($.isEmptyObject(result)) {
                    $('#msg').remove();
                    $('#patients,#patienttable').css("display", "none");
                    $('#cardbody').append('<div class="h5 d-flex justify-content-center" id="msg"> No Patients Found </div>');
                    return;
                }
                var a = jqXHR.getResponseHeader("x-pagination");
                pagination = JSON.parse(a);
                $('#msg').remove();
                $('#patients tbody').empty();
                $.each(result, function(i) {
                    $('#patients tbody').append('<tr class="clickable-row" onClick="show(' + result[i].uniqueID + ')"><th>' + (((pagination.CurrentPage - 1) * 30) + (i + 1)) + '</th><td>' + result[i].uniqueID + '</td><td>' + result[i].name + '</td><td>' + result[i].sex + '</td><td>' + result[i].age + '</td></tr>');
                });
                $('#patients,#patienttable,#pages,#pagination').css("display", "block");
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
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        url: 'https://localhost:44395/api/Account/auth/google?idtoken=' + id_token,
        method: 'POST',
        xhrFields: {
            withCredentials: true
        },
        success: function(data, textStatus, jqXHR) {
            $('#googleloginbtn').css("display", "none");
            $('#login').css("display", "none");
            $('#googlesignoutbtn').css("display", "flex");
        }
    });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut();
    $.ajax({
        url: 'https://localhost:44395/api/Account/sign-out',
        method: 'POST',
        xhrFields: {
            withCredentials: true
        },
        success: function(data, textStatus, jqXHR) {
            $('#googleloginbtn').css("display", "block");
            $('#googlesignoutbtn').css("display", "none");
            $('#login').css("display", "block");
        }
    });
}


// window.fbAsyncInit = function() {
//     FB.init({
//         appId: '433171077848490',
//         autoLogAppEvents: true,
//         xfbml: true,
//         version: 'v9.0'
//     });
// };

// FB.getLoginStatus(function(response) {
//     if (response.status === 'connected') {
//         var accessToken = response.authResponse.accessToken;
//     }
// });


// FB.login(function(response) {
//     if (response.authResponse) {
//         console.log('Welcome!  Fetching your information.... ');
//         FB.api('/me', function(response) {
//             console.log('Good to see you, ' + response.name + '.');
//         });
//     } else {
//         console.log('User cancelled login or did not fully authorize.');
//     }
// });

$('#login').click(function() {
    if ($('#externallogins').css("display") == "none")
        $('#externallogins').css("display", "flex");
    else
        $('#externallogins').css("display", "none");
});

$('#uidcheck').keyup(function() {
    this.value = this.value.replace(/[^0-9\.]/g, '');
});