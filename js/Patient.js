var euid;
var epresid;
var epermid;
var eoccid;
var eoccaid;
var etreatid;
var x = "No";

$(function() {
    $('#uidcheck').keyup(function() {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });
    var form1 = $('#UIDcheck');
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
            $.ajax({
                type: "GET",
                url: "https://localhost:44395/api/Patient/" + $('#uidcheck').val(),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: {},
                xhrFields: {
                    withCredentials: true
                },
                success: function(data, textStatus, jqXHR) {
                    var msg = '<div id="msg"><h5 class="pt-5">Patient with this Aadhaar Number already exist.</h5> <p>Click <a href="./Patient.html?id=' + $("#uidcheck").val() + '" >here</a> to view or edit the Patient Details.</p></div>';
                    $(msg).appendTo('#cardbody');
                },
                statusCode: {
                    404: function() {
                        $('#UIDcheck').css("display", "none");
                        $('#addpatient,#addpatientdiv,#backbtn').css("display", "none");
                        $('#addpatient,#addpatientdiv,#backbtn').css("display", "block");
                        $('#uid').val($("#uidcheck").val());
                        $('#uid').attr({ disabled: "true" });
                        exec();
                    }
                },
                failure: function() {
                    alert("Error");
                }
            });
        }, false);
    });
    var addressblock = $('#address1').html();
    var mobilenoblock = $('#mobilenumber1').html();
    $(addressblock).appendTo('#address2');
    $(mobilenoblock).appendTo('#mobilenumber2');
    $(addressblock).appendTo('#address3');
    $(mobilenoblock).appendTo('#mobilenumber3');
});

function exec() {

    dropdown1 = $('#address1 #state, #address2 #state, #address3 #state, #hstate');
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
            dropdown1.empty();
            dropdown1.append('<option selected disabled="true">Select State</option>');
            $.each(result, function(i) {
                dropdown1.append($('<option></option>').val(result[i].stateID).text(result[i].state));
            });
        },
        failure: function() {
            alert("Error");
        }
    });
    let dropdown2 = $('#diseasetype');
    dropdown2.empty();
    dropdown2.append('<option selected disabled="true">Select Disease Type</option>');
    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/DiseaseType/",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        success: function(result) {
            let dropdown2 = $('#diseasetype');
            dropdown2.empty();
            dropdown2.append('<option selected disabled="true">Select Disease Type</option>');
            $.each(result, function(i) {
                dropdown2.append($('<option></option>').val(result[i].diseaseTypeID).text(result[i].diseaseType));
            });
            dropdown2.append('<option value="0">Others</option>');
        },
        failure: function() {
            alert("Error");
        }
    });

    var form2 = $('#addpatientdiv');
    var validation = Array.prototype.filter.call(form2, function(form2) {
        form2.addEventListener('submit', function(event) {
            if (form2.checkValidity() === false) {
                if ($('#msg').length)
                    $('#msg').remove();
                event.preventDefault();
                event.stopPropagation();
                form2.classList.add('was-validated');
                return;
            }
            var obj = {};
            obj.uniqueID = $('#uid').val().trim();
            obj.name = $('#name').val().trim();
            obj.age = parseInt($('#age').val());
            obj.sex = $('#radiosex input[type="radio"][name="sex"]:checked').val();
            obj.phone = $('#mobilenumber1 #mobile').val().trim();
            setaddress(obj);
            setoccupation(obj);
            settreatment(obj);
            if ($('#addpatientbtn').html() == "Save")
                setids(obj);
            event.preventDefault();
            if ($('#addpatientbtn').html() == "Add Patient") {
                $.ajax({
                    type: "POST",
                    url: "https://localhost:44395/api/Patient/",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(obj),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data, textStatus, jqXHR) {
                        var msg = '<div id="msg"><div class="h5 pt-5">Patient added Successfully.</div> <p>Click <a href="./Patient.html?id=' + $("#uidcheck").val() + '" >here</a> to view the Patient Details.</p></div>';
                        $('#msg').remove();
                        $(msg).appendTo('#cardbody');
                        $('#uidcheck').val("");
                        $('#addpatient,#addpatientdiv,#backbtn,#UIDcheck').css("display", "none");
                    },
                    failure: function() {
                        alert("Error");
                    }
                });
            }
            if ($('#addpatientbtn').html() == "Save") {
                $.ajax({
                    type: "PUT",
                    url: "https://localhost:44395/api/Patient/" + euid,
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(obj),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data, textStatus, jqXHR) {
                        var msg = '<div id="msg"><div class="h5 pt-5">Patient Updated Successfully.</div> <p>Click <a href="./Patient.html?id=' + euid + '" >here</a> to view the Patient Details.</p></div>';
                        $('#msg').remove();
                        $(msg).appendTo('#cardbody');
                        $('#uidcheck').val("");
                        $('#addpatient,#addpatientdiv,#backbtn,#UIDcheck').css("display", "none");
                    },
                    failure: function() {
                        alert("Error");
                    }
                });
            }
        }, false);
    });

    $('#admitdate, #dischargedate').datepicker({
        format: "dd/mm/yyyy",
        weekStart: 0,
        maxViewMode: 2,
        autoclose: true,
        todayHighlight: true
    });

    function setids(obj) {
        obj.address[0].id = epresid;
        obj.address[1].id = epermid;
        obj.treatmentDetails[0].treatmentID = etreatid;
        if (x == "Yes") {
            obj.occupationDetails.occupationID = eoccid;
            obj.occupationDetails.address.id = eoccaid;
        }
        return obj;
    }

}

$('#age,#uid,#mobilenumber1 #mobile,#mobilenumber2 #mobile,#mobilenumber3 #mobile,#address1 #pincode,#address2 #pincode,#address3 #pincode,#hpincode').keyup(function() {
    this.value = this.value.replace(/[^0-9\.]/g, '');
});

$('#hstate').on('change', function() {
    hosstatechange($('#hstate').val());
});

function hosstatechange(a) {
    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/State/" + a + "/Hospitals",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function(result) {
            let dropdown3 = $('#hospital');
            dropdown3.empty();
            dropdown3.append('<option selected disabled="true">Select Hospital</option>');
            $.each(result, function(i) {
                dropdown3.append($('<option></option>').val(result[i].hospitalID).text(result[i].name));
            });
            dropdown3.append('<option value="0">Others</option>');
        },
        failure: function() {
            alert("Error");
        }
    });
}

$('#backbtn').click(function() {
    $('#UIDcheck').css("display", "block");
    $('#addpatient,#addpatient,#backbtn').css("display", "none");
    document.getElementById('addpatientdiv').reset();
});

function radioempchange() {
    if ($('#radioemployed input[type="radio"][name="employed"]:checked').val() === "Yes") {
        $('#occupationdetails').css("display", "block");
        $('#occupationtype').attr({ required: "true", pattern: ".{3,25}", maxlength: "25" });
        $('#companyname').attr({ required: "true", pattern: ".{3,40}", maxlength: "40" });
        $('#mobilenumber2 #mobile').attr({ required: "true", pattern: ".{10}", maxlength: "10" });
        $('#address3 #addressline').attr({ required: "true", pattern: ".{3,50}", maxlength: "50" });
        $('#address3 #city').attr({ required: "true", pattern: ".{3,30}", maxlength: "30" });
        $('#address3 #pincode').attr({ required: "true", pattern: ".{6}", maxlength: "6" });
    } else {
        $('#occupationdetails').css("display", "block");
        $('#occupationtype').removeAttr('required pattern maxlength');
        $('#companyname').removeAttr('required pattern maxlength');
        $('#mobilenumber2 #mobile').removeAttr('required pattern maxlength');
        $('#address3 #addressline').removeAttr('required pattern maxlength');
        $('#address3 #city').removeAttr('required pattern maxlength');
        $('#address3 #pincode').removeAttr('required pattern maxlength');
    }
}

$('#radioemployed input[type="radio"][name="employed"]').on('change', function() {
    radioempchange();
});

$('#address1 #state').on('change', function() {
    if ($('#permaddresscheck').is(":checked")) {
        $('#address2 #state').val($('#address1 #state option:selected').val());
    }
});

$('#address1 #addressline,#address1 #city,#address1 #pincode').keyup(function() {
    if ($('#permaddresscheck').is(":checked")) {
        $('#address2 #addressline').val($('#address1 #addressline').val().trim());
        $('#address2 #city').val($('#address1 #city').val().trim());
        $('#address2 #pincode').val($('#address1 #pincode').val().trim());
    }
});

function permaddcheck() {
    if ($('#permaddresscheck').is(":checked")) {
        $('#address2 #addressline').val($('#address1 #addressline').val().trim());
        $('#address2 #city').val($('#address1 #city').val().trim());
        $('#address2 #state').val($('#address1 #state option:selected').val());
        $('#address2 #pincode').val($('#address1 #pincode').val().trim());
        $('#address2 #addressline, #address2 #city, #address2 #state, #address2 #pincode').prop('disabled', true);
    } else {
        $('#address2 #addressline, #address2 #city, #address2 #state, #address2 #pincode').prop('disabled', false);
        $('#address2 #addressline, #address2 #city, #address2 #pincode').val('');
        $('#address2 #state').val(0);
    }
}

$('#permaddresscheck').on('change', function() {
    permaddcheck();
});

function radioisfatality() {
    if ($('#radiofatality input[type="radio"][name="isfatality"]:checked').val() === "No") {
        $('#radiocured').css("display", "block");
        $('#dischargedatediv').css("display", "none");
        $('#iscuredyes').attr({ required: "true" });
        $('#dischargedate').removeAttr('required pattern maxlength');
    } else {
        $('#radiocured input[type="radio"][name="iscured"]').prop('checked', false);
        $('#radiocured').css("display", "none");
        $('#dischargedatediv').css("display", "flex");
        $('#iscuredyes').removeAttr('required');
        $('#dischargedate').attr({ required: "true", pattern: ".{10}", maxlength: "10" });
    }
}

$('#radiofatality input[type="radio"][name="isfatality"]').on('change', function() {
    radioisfatality();
});

function radioiscure() {
    if ($('#radiocured input[type="radio"][name="iscured"]:checked').val() === "Yes") {
        $('#dischargedatediv').css("display", "flex");
        $('#dischargedate').attr({ required: "true", pattern: ".{10}", maxlength: "10" });
    } else if ($('#radiocured input[type="radio"][name="iscured"]:checked').val() === "No") {
        $('#dischargedatediv').css("display", "none");
        $('#dischargedate').removeAttr('required pattern maxlength');
    }
}

$('#radiocured input[type="radio"][name="iscured"]').on('change', function() {
    radioiscure();
});

function distypchange() {
    if ($('#diseasetype').val() === "0") {
        $('#distypcus').css("display", "flex");
        $('#diseasetypecus').attr({ required: "true", pattern: ".{3,20}", maxlength: "20" });
    } else {
        $('#distypcus').css("display", "none");
        $('#diseasetypecus').removeAttr('required pattern maxlength');
    }
}

$('#diseasetype').on('change', function() {
    distypchange();
});

function hoschange(a) {
    if (a === "0") {
        $('#hdetails').css("display", "block");
        $('#hospitalnamecus').attr({ required: "true", pattern: ".{3,20}", maxlength: "20" });
        $('#mobilenumber3 #mobile').attr({ required: "true", pattern: ".{10}", maxlength: "10" });
        $('#haddressline').attr({ required: "true", pattern: ".{3,50}", maxlength: "50" });
        $('#hcity').attr({ required: "true", pattern: ".{3,30}", maxlength: "30" });
        $('#hpincode').attr({ required: "true", pattern: ".{6}", maxlength: "6" });
    } else {
        $('#hdetails').css("display", "block");
        $('#hospitalnamecus,#mobilenumber3 #mobile,#haddressline,#hcity,#hpincode').removeAttr('required pattern maxlength');
        $('#hospitalnamecus,#mobilenumber3 #mobile,#haddressline,#hcity,#hpincode').prop("disabled", "true");
        $.ajax({
            type: "GET",
            url: "https://localhost:44395/api/Hospital/" + a,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: {},
            xhrFields: {
                withCredentials: true
            },
            success: function(result) {
                $('#hospitalnamecus').val(result.name);
                $('#mobilenumber3 #mobile').val(result.phone);
                $('#haddressline').val(result.address.addressline);
                $('#hcity').val(result.address.city);
                $('#hpincode').val(result.address.zipCode);
                $('#hospital').val(a);
            },
            failure: function() {
                alert("Error");
            }
        });
    }
}

$('#hospital').on('change', function() {
    hoschange($('#hospital').val());
});

function setaddress(obj) {
    var addressobj = [{
            "addressType": "Temporary",
            "addressline": $('#address1 #addressline').val().trim(),
            "city": $('#address1 #city').val().trim(),
            "stateID": $('#address1 #state option:selected').val(),
            "zipCode": $('#address1 #pincode').val().trim()
        },
        {
            "addressType": "Permanent",
            "addressline": $('#address2 #addressline').val().trim(),
            "city": $('#address2 #city').val().trim(),
            "stateID": $('#address2 #state option:selected').val(),
            "zipCode": $('#address2 #pincode').val().trim()
        }
    ];
    obj.address = addressobj;
    return obj;
};

function setoccupation(obj) {
    if ($('#radioemployed input[type="radio"][name="employed"]:checked').val() === "Yes") {
        var occuobj = {
            "occupationType": $('#occupationtype').val().trim(),
            "companyName": $('#companyname').val().trim(),
            "phone": $('#mobilenumber2 #mobile').val().trim(),
            "address": {
                "addressType": "Work",
                "addressline": $('#address3 #addressline').val().trim(),
                "city": $('#address3 #city').val().trim(),
                "stateID": $('#address3 #state option:selected').val(),
                "zipCode": $('#address3 #pincode').val().trim()
            }
        }
        obj.occupationDetails = occuobj;
        return obj;
    } else {
        return obj;
    }
}

function setdiseasetype(treatobj) {
    if ($('#diseasetype').val() === "0") {
        var distypobj = {}
        distypobj.diseaseType = $('#diseasetypecus').val().trim();
        treatobj.diseaseType = distypobj;
        return treatobj;
    } else {
        treatobj.diseaseTypeID = $('#diseasetype').val();
        return treatobj;
    }
}

function sethospital(treatobj) {
    if ($('#hospital').val() === "0") {
        var hosobj = {}
        hosobj.name = $('#hospitalnamecus').val().trim();
        hosobj.phone = $('#mobilenumber3 #mobile').val().trim();
        hosobj.address = {
            "addressType": "Hospital",
            "addressline": $('#hospitaldetails #haddressline').val().trim(),
            "city": $('#hospitaldetails #hcity').val().trim(),
            "stateID": $('#hospitaldetails #hstate option:selected').val(),
            "zipCode": $('#hospitaldetails #hpincode').val().trim()
        }
        treatobj.hospital = hosobj;
        return treatobj;
    } else {
        treatobj.hospitalID = $('#hospital').val();
        return treatobj;
    }
}

function dateformatter(datestring) {
    var datearray = datestring.split("/");
    var formatteddate = (datearray[2] + '-' + datearray[1] + '-' + datearray[0]);
    return formatteddate;
}

function settreatment(obj) {
    var treatobj = [];
    treatobj[0] = {};
    if (!($('#prescription').val().trim().length === 0)) {
        treatobj.prescription = $('#prescription').val().trim();
    }
    treatobj[0].diseaseName = $('#diseasename').val().trim();
    treatobj[0].admitDate = dateformatter($('#admitdate').val().trim());
    if (($('#radiofatality input[type="radio"][name="isfatality"]:checked').val() === "Yes") || ($('#radiocured input[type="radio"][name="iscured"]:checked').val() === "Yes"))
        treatobj[0].dischargeDate = dateformatter($('#dischargedate').val().trim());
    treatobj[0].currentStatus = $('#currentstatus').val().trim();
    treatobj[0].isFatality = $('#radiofatality input[type="radio"][name="isfatality"]:checked').val();
    setdiseasetype(treatobj[0]);
    sethospital(treatobj[0]);
    obj.treatmentDetails = treatobj;
    return obj;
}

function daterev(date) {
    if (date == null)
        return "Not Discharged";
    var ndate = date.substr(0, 10);
    var a = ndate.split('-');
    return a[2] + "/" + a[1] + "/" + a[0];
}

function show(uid) {
    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/Patient/" + uid,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function(result) {
            $('#showpatientblock').css("display", "block");
            $('#UIDcheck,#backbtn,#addpatientdiv').css("display", "none");
            $('#showhname,#showhmobileno,#showhaddressline,#showhcity,#showhstate,#showhpincode').html("");
            $('#showano').html(result.uniqueID);
            $('#showname').html(result.name);
            $('#showage').html(result.age);
            $('#showsex').html(result.sex);
            $('#showmobileno').html("+91-" + result.phone);
            $('#showaddressline1').html(result.address[0].addressline);
            $('#showcity1').html(result.address[0].city);
            $('#showstate1').html(result.address[0].stateName.state);
            $('#showpincode1').html(result.address[0].zipCode);
            $('#showaddressline2').html(result.address[1].addressline);
            $('#showcity2').html(result.address[1].city);
            $('#showstate2').html(result.address[1].stateName.state);
            $('#showpincode2').html(result.address[1].zipCode);
            if (result.occupationDetails == null) {
                $('#showoccblock').css("display", "none");
                $('#noocc').css("display", "flex");
            } else {
                $('#showocctyp').html(result.occupationDetails.occupationType);
                $('#showoccname').html(result.occupationDetails.companyName);
                $('#showoccmobileno').html("+91-" + result.occupationDetails.phone);
                $('#showaddressline3').html(result.occupationDetails.address.addressline);
                $('#showcity3').html(result.occupationDetails.address.city);
                $('#showstate3').html(result.occupationDetails.address.stateName.state);
                $('#showpincode3').html(result.occupationDetails.address.zipCode);
                $('showoccblock').css("display", "block");
                $('#noocc').css("display", "none");
            }
            $('#showdistyp').html(result.treatmentDetails[0].diseaseType.diseaseType);
            $('#showdisname').html(result.treatmentDetails[0].diseaseName);
            $('#showisfat').html(result.treatmentDetails[0].isFatality);
            $('#showadmitdate').html(daterev(result.treatmentDetails[0].admitDate));
            $('#showdischargedate').html(daterev(result.treatmentDetails[0].dischargeDate));
            $('#showpres').html(result.treatmentDetails[0].prescription);
            $('#showstatus').html(result.treatmentDetails[0].currentStatus);
            $('#showhosname').html(result.treatmentDetails[0].hospital.name);
            $('#showhosmobileno').html("+91-" + result.treatmentDetails[0].hospital.phone);
            $('#showaddressline4').html(result.treatmentDetails[0].hospital.address.addressline);
            $('#showcity4').html(result.treatmentDetails[0].hospital.address.city);
            $('#showstate4').html(result.treatmentDetails[0].hospital.address.stateName.state);
            $('#showpincode4').html(result.treatmentDetails[0].hospital.address.zipCode);
            if (result.treatmentDetails[0].prescription == null)
                $('#showpres').html("Not Available");
        },
        failure: function() {
            alert("Error");
        }
    });
    euid = uid;
}

$('#edit1btn').on('click', function() { edit1(euid); });

function employed(a) {
    if (a == null) {
        return "No";
    } else {
        return "Yes";
    }
}

function addcheckbox(a, b) {
    if ((a.addressline == b.addressline) && (a.city == b.city) && (a.stateID == b.stateID) && (a.zipCode == b.zipCode)) {
        $('#permaddresscheck').prop("checked", true);
        permaddcheck();
    } else
        return;
}

function selectiscure(a, b) {
    if (a == "No") {
        if (b == null)
            return "No";
        else {
            $('#dischargedate').val(daterev(b));
            return "Yes";
        }
    } else {
        $('#dischargedate').val(daterev(b));
        return;
    }
}

function hosset(a) {
    $('#hospital').val(a);
    hoschange();
    alert(a);
}

function edit1(euid) {
    exec();
    $('#addpatientdiv').css("display", "block");
    $('#UIDcheck,#backbtn,#showpatientblock').css("display", "none");
    $('#header1').html("Edit Patient Details");
    $('#addpatientbtn').html("Save");
    $.ajax({
        type: "GET",
        url: "https://localhost:44395/api/Patient/" + euid,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function(result) {
            $('#uid').val(result.uniqueID);
            $('#uid').prop("disabled", true);
            $('#name').val(result.name);
            $('#age').val(result.age);
            $('#radiosex input[type="radio"][name="sex"][value="' + result.sex + '"]').prop("checked", true);
            $('#mobile').val(result.phone);
            $('#radioemployed input[type="radio"][name="employed"][value="' + employed(result.occupationDetails) + '"]').prop("checked", true);
            radioempchange();
            $('#addressline').val(result.address[0].addressline);
            $('#city').val(result.address[0].city);
            $('#address1 #state').val(result.address[0].stateID);
            $('#pincode').val(result.address[0].zipCode);
            $('#address2 #addressline').val(result.address[1].addressline);
            $('#address2 #city').val(result.address[1].city);
            $('#address2 #state').val(result.address[1].stateID);
            $('#address2 #pincode').val(result.address[1].zipCode);
            addcheckbox(result.address[0], result.address[1]);
            if (result.occupationDetails != null) {
                x = "Yes";
                $('#occupationtype').val(result.occupationDetails.occupationType);
                $('#companyname').val(result.occupationDetails.companyName);
                $('#mobilenumber2 #mobile').val(result.occupationDetails.phone);
                $('#address3 #addressline').val(result.occupationDetails.address.addressline);
                $('#address3 #city').val(result.occupationDetails.address.city);
                $('#address3 #state').val(result.occupationDetails.address.stateID);
                $('#address3 #pincode').val(result.occupationDetails.address.zipCode);
                eoccid = result.occupationDetails.occupationID;
                eoccaid = result.occupationDetails.address.id;
            }
            $('#diseasename').val(result.treatmentDetails[0].diseaseName);
            $('#radiofatality input[type="radio"][name="isfatality"][value="' + result.treatmentDetails[0].isFatality + '"]').prop("checked", true);
            radioisfatality();
            $('#radiocured input[type="radio"][name="iscured"][value="' + selectiscure(result.treatmentDetails[0].isFatality, result.treatmentDetails[0].dischargeDate) + '"]').prop("checked", true);
            radioiscure();
            $('#admitdate').val(daterev(result.treatmentDetails[0].admitDate));
            $('#prescription').val(result.treatmentDetails[0].prescription);
            $('#currentstatus').val(result.treatmentDetails[0].currentStatus);
            $('#hstate').val(result.treatmentDetails[0].hospital.address.stateID);
            hosstatechange(result.treatmentDetails[0].hospital.address.stateID);
            hoschange(result.treatmentDetails[0].hospitalID);
            $('#diseasetype').val(result.treatmentDetails[0].diseaseTypeID);
            epresid = result.address[0].id;
            epermid = result.address[1].id;
            etreatid = result.treatmentDetails[0].treatmentID;
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