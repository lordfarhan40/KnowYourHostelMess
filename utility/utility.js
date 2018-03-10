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

var addNotification = (user, body, callback) => {
	if(!user) {
		callback('User is Not Defined');
		return;
	}
	else if(!body) {
		callback('Notification is not specified');
		return;
	}

	var notificationObject = {
      uid: user.hid,
      hid: user.hostel_id,
      title: body.notificationTitle,
      text: body.notificationText,
      date: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    notifications.createNotification(notificationObject, (error, result) => {
    	if(error)
    		callback(error);
    	else
    		callback(undefined, result);
    });
}

var removeNotification = (nid, callback) => {
	if(!nid)
		callback('Notification Not specified');
	else
		notifications.removeNotificationByNid(nid, (error, result) => {
			if(error)
				callback(error);
			else
				callback(undefined, result);
		})
}

module.exports = {
	getNotifications,
	addNotification,
	removeNotification
}