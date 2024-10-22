// // In service-worker.js
// self.addEventListener("install", (event) => {
//     console.log("installed")
//     event.waitUntil(self.skipWaiting());
// })

// // self.addEventListener("fetch", () => {
// //     console.log("fetched")
// // })

// self.addEventListener("activate", (event) => {
//     console.log("activated")
//     event.waitUntil(self.clients.claim());
// })

// self.addEventListener('activate', function (event) {

//     console.log(event.data);

//     const data = event.data ? event.data?.json() : {};

//     const options = {
//         body: data.body || 'Default message body',
//         actions: [{ action: 'update', title: 'Update' }],
//         //   icon: '/icon.png', // Optional icon for notification
//         //   badge: '/badge.png', // Optional badge icon
//         data: {
//             url: data.url || '/settings#progressUpdate',
//         },
//     };

//     console.log("here")
//     event.waitUntil(
//         self.registration.showNotification(data.title || 'Reminder!', options)
//     );
// });

// self.addEventListener('notificationclick', function (event) {
//     event.notification.close();
//     if (event.action === 'update') {
//         clients.openWindow(event.notification.data.url);
//     }
// });