/**
 * Created by czamanskik on 2015-04-20.
 */
// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    // Add User button click
    $('#btnAddUser').on('click', addUser);
    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);


});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/locationlist', function( data ) {
        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.cause.id + '</td>';
            tableContent += '<td>' + this.latitude + '</td>';
            tableContent += '<td>' + this.longitude + '</td>';
            tableContent += '<td>' + this.ambulance.id + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="'+this._id + '">delete</a></td>';
            tableContent += '</tr>';

        });
        initialize();
        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};
// Show User Info
// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero


        // If it is, compile all user info into one object
        var newUser = {
         'cause': $('#inputCause').val(),
        'ambulanceId': $('#inputAmbulanceId').val(),
         'latitude': $('#inputLatitude').val(),
         'longitude': $('#inputLongitude').val()

        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            url: '/users/addlocation',
            data: newUser,
            dataType: 'json'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                //$('#addUser fieldset input').val('');
                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });

};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this log?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deletelocation/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};


var map;
function initialize() {
    $.getJSON( '/users/locationlist', function( data ) {

            var mapOptions = {
                zoom:3,
                center: new google.maps.LatLng(52.24,16,54),
                mapTypeId: google.maps.MapTypeId.TERRAIN
            }


    var map = new google.maps.Map(document.getElementById('mapa'),
        mapOptions);

        setMarkers(map, data);
        setRoute(map,data);
    });
}


function setMarkers(map, locations) {

    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18 , 1],
        type: 'poly'
    };
    for (var i = 0; i < locations.length; i++) {
        var location = locations[i];
        var myLatLng = new google.maps.LatLng(location.latitude, location.longitude);
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            shape: shape,
            title: location.cause.id
        });
    }
}

function setRoute(map, locations) {
    var routeCoordinates = [
    ];
    for (var i = 0; i < locations.length; i++) {
        var location = locations[i];
        routeCoordinates[i] = new google.maps.LatLng(location.latitude, location.longitude);
    }
    var flightPlanCoordinates = [
        new google.maps.LatLng(37.772323, -122.214897),
        new google.maps.LatLng(21.291982, -157.821856),
        new google.maps.LatLng(-18.142599, 178.431),
        new google.maps.LatLng(-27.46758, 153.027892)
    ];
    var route = new google.maps.Polyline({
        path: routeCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    route.setMap(map);
}
    google.maps.event.addDomListener(window, 'load', initialize);
