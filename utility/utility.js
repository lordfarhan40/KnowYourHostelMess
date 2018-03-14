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
var makeMessMenu = (menu) => {
	var mess_menu = [];
    mess_menu.push({
      breakfast: menu.MondayBreakfast,
      lunch: menu.MondayLunch,
      evening: menu.MondayEvening,
      dinner: menu.MondayDinner,
    });
    mess_menu.push({
      breakfast: menu.TuesdayBreakfast,
      lunch: menu.TuesdayLunch,
      evening: menu.TuesdayEvening,
      dinner: menu.TuesdayDinner,
    });
    mess_menu.push({
      breakfast: menu.WednesdayBreakfast,
      lunch: menu.WednesdayLunch,
      evening: menu.WednesdayEvening,
      dinner: menu.WednesdayDinner,
    });
    mess_menu.push({
      breakfast: menu.ThursdayBreakfast,
      lunch: menu.ThursdayLunch,
      evening: menu.ThursdayEvening,
      dinner: menu.ThursdayDinner,
    });
    mess_menu.push({
      breakfast: menu.FridayBreakfast,
      lunch: menu.FridayLunch,
      evening: menu.FridayEvening,
      dinner: menu.FridayDinner,
    });
    mess_menu.push({
      breakfast: menu.SaturdayBreakfast,
      lunch: menu.SaturdayLunch,
      evening: menu.SaturdayEvening,
      dinner: menu.SaturdayDinner,
    });
    mess_menu.push({
      breakfast: menu.SundayBreakfast,
      lunch: menu.SundayLunch,
      evening: menu.SundayEvening,
      dinner: menu.SundayDinner,
    });
    return mess_menu;
}
module.exports = {
	getNotifications,
	addNotification,
	removeNotification,
	makeMessMenu
}