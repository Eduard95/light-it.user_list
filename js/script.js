var numUsers = 7;


function getUserData(data) {
	var users = data.results.map(function (u) {
		return {
			username: u.login.username,
			email: u.email,
			registered: u.registered,
			last_name: u.name.last,
			first_name: u.name.first,
			gender: u.gender,
			phone: u.phone,
			cell: u.cell,
			birthday: u.dob,
			state: u.location.state,
			address: u.location.street,
			city: u.location.city,
			zip_code: u.location.postcode,
			avatar_url: u.picture.large
		};
	});
	return users;
}

$(function () {
	var currentExpanded = null;
	var oldButton = null;
	var userTemplate = $('#user_template');
	var users = null;
	var popup = $('#gender-stats-popup');

	$.ajax({
		url: 'https://randomuser.me/api/?results=' + numUsers + '&nat=gb',
		dataType: 'json',
		success: function (data) {
			users = getUserData(data);
			$('#content').loadTemplate(userTemplate, users);
		}
	});

	popup.dialog({
	  dialogClass: "no-close",
		autoOpen: false,
		minWidth: 680,
		show: { effect: "blind", duration: 300 },
		title: 'Gender stats',
	  buttons: [
	    {
	      text: "OK",
	      click: function() {
	        $( this ).dialog( "close" );
	      }
	    }
	  ]
	});

	$(document).on('click', '.details_link', function () {
		var thisButton = $(this);
		var detailsId = thisButton.data('details-id');
		var details = $('#' + detailsId);

		if (currentExpanded) {
			currentExpanded.removeClass('expanded');
			oldButton.removeClass('glyphicon-minus');
			oldButton.addClass('glyphicon-plus');
		}

		if (currentExpanded && currentExpanded.is(details)) {
			currentExpanded = null;
		}
		else {
			thisButton.removeClass('glyphicon-plus');
			thisButton.addClass('glyphicon-minus');
			details.addClass('expanded');
			currentExpanded = details;
			oldButton = thisButton;
		}
	});

	$('#gender-stats-btn').click(function (e) {
		e.preventDefault();
		popup.dialog('open');
		var ctx = document.getElementById('gender-chart');
		var malesCount = users.filter(function (user) {
			return user.gender == 'male';
		}).length * 100 / users.length;
		var femalesCount = users.filter(function (user) {
			return user.gender == 'female';
		}).length * 100 / users.length;
		var chart = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: ['Males', 'Females'],
				datasets: [
					{
						data: [malesCount.toFixed(2), femalesCount.toFixed(2)],
						backgroundColor: ['red', 'blue']
					}
				]
			}
		})
		return false;
	})
});
