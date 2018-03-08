const notifications = require('../models/notifications.js');
var getNotifications = (hid, count, callback) => {
	var notificationsToShow = [];

	if(hid == 0) {
		notifications.getGlobalNotifications((error, result) => {
			if(error)
				callback(error);
			if(!count)
				for(var i in result)
					notificationsToShow.push(result[i]);
			else
				for(var i = 0; i < count && i < result.length; i++)
					notificationsToShow.push(result[i]);
			callback(undefined, notificationsToShow);
		});
	}
	else {
		notifications.getNotificationsByHid(hid, (error, result) => {
			if(!count)
				for(var i in result)
					notificationsToShow.push(result[i]);
			else
				for(var i = 0; i < count && i < result.length; i++)
					notificationsToShow.push(result[i]);
				callback(undefined, notificationsToShow);
		});
	}
}

module.exports = {
	getNotifications
}